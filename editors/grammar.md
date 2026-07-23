<!-- This is a grammar guide written by Claude used to generate syntax highlighting for Zed & VSCode -->

# Bloom — Language Specification

Bloom is a small component language that compiles to TypeScript. It exists to
learn how frameworks work; it is a signals-based, fine-grained-reactive
framework with a compiler, in the same family as Svelte, Vue SFCs, and Solid.

This document specifies the **syntax** (for building a parser / Tree-sitter
grammar) and the **semantics** (what each construct compiles to). If you are
implementing a Tree-sitter grammar, read §4, §5, and §9 closely.

---

## 1. Design principles

1. **Two zones per component.** A component body is a _script zone_ (plain
   JS/TS, copied out verbatim, never rewritten) followed by a _view zone_ (the
   trailing element, the only part the compiler transforms). This mirrors
   Svelte's `<script>` + markup split.
2. **Compiles to runtime calls, not HTML.** The view becomes imperative calls
   into a small runtime (`el`, `insert`, `each`, `bind`, `mount`) wired with
   `signal` / `effect` / `computed`. HTML only ever exists as the live DOM the
   runtime builds at execution time.
3. **TypeScript-first.** The compiler is purely syntactic and never
   type-checks. Types in the script zone and in view expressions ride through
   untouched; `tsc` / esbuild handles them downstream. The pipeline is:
   `Foo.bloom → [Bloom compiler] → Foo.ts → [tsc/esbuild] → Foo.js`.
4. **Expressions are opaque.** Inside the view, everything in an attribute
   value, an interpolation hole, an `if` condition, or an `each` source is an
   arbitrary JS/TS expression. The Bloom grammar does **not** parse these; it
   captures their text and passes them through. (For editor tooling they are
   injection points for a JS/TS grammar — see §9.)
5. **One root per component.** The view zone is a single root element.
   (Fragments are a future extension — see §10.)

---

## 2. File & module structure

- One `.bloom` file = one module = one component.
- The component compiles to the module's `export default function`.
- `import` statements at file scope are module-level and are emitted at the top
  of the generated module unchanged. `import Foo from "./Foo.bloom"` resolves to
  the compiled component (the build plugin transforms every `.bloom` import).
- The user imports runtime primitives they use (`signal`, `computed`, `effect`,
  types); the compiler additionally auto-injects the DOM-runtime imports its
  emitted view needs (`el`, `insert`, `each`, `bind`, `mount`).

---

## 3. Terminology

| Term          | Meaning                                                          |
| ------------- | ---------------------------------------------------------------- |
| Script zone   | JS/TS statements at the top of a component body; passed through. |
| View zone     | The single trailing element; the compiled part.                  |
| Element       | A DOM node (`div { ... }`) or component call (`Footer(...)`).    |
| Tag           | Lowercase/known-HTML name → DOM element.                         |
| Component ref | Capitalized name in element position → a child component.        |
| Attribute     | `name: expr` inside an element's `( )`.                          |
| Event         | An attribute whose name matches `on[A-Z]…`.                      |
| Child         | A node inside an element's `{ }` block.                          |
| Interpolation | A `{ expr }` hole inside a view string.                          |
| Opaque expr   | Arbitrary JS/TS text the grammar captures but does not parse.    |

---

## 4. Lexical structure

### 4.1 Comments

```
// line comment — to end of line
/* block comment — may span lines */
```

Allowed anywhere (script zone and view zone).

### 4.2 Keywords

Structural keywords recognized by the Bloom grammar:

```
component   if   else   each   in
```

`key` is a **contextual** keyword: it is only special as the label inside an
`each` key hint `( key: … )`. Everywhere else it is an ordinary identifier.

The script zone also contains ordinary JS/TS keywords (`let`, `const`,
`function`, `return`, `type`, `interface`, `import`, `from`, `as`, `async`,
`await`, …). These are **not** Bloom keywords — they live inside opaque script
text — but a highlighter will typically still color them (see §9).

### 4.3 Identifiers & names

```
Ident       ::= [a-z_][A-Za-z0-9_]*          // lowercase-initial (values, each item)
TypeName    ::= [A-Z][A-Za-z0-9_]*           // Capitalized (components, TS types)
AttrName    ::= [A-Za-z_][A-Za-z0-9_-]*      // attribute / event names (may contain '-')
EventName   ::= on[A-Z][A-Za-z0-9_]*         // subset of AttrName
```

### 4.4 Tag names

A **fixed set** of known HTML element names is treated as `TagName` (DOM
elements). Anything else in element-lead position that is lowercase is treated
as an _expression_, not a tag; anything Capitalized is a component ref. The set
(extend as needed):

```
a abbr address area article aside audio b bdi bdo blockquote br button canvas
caption cite code col colgroup data datalist dd del details dfn dialog div dl dt
em embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 header hgroup
hr i iframe img input ins kbd label legend li main map mark menu meter nav object
ol optgroup option output p picture pre progress q rp rt ruby s samp section
select slot small source span strong sub summary sup table tbody td template
textarea tfoot th thead time tr track u ul var video wbr
```

### 4.5 Strings (view zone)

View text uses double-quoted strings, which may contain interpolation holes:

```
String      ::= '"' ( StringChar | Interpolation )* '"'
Interpolation ::= '{' Expr '}'
```

- `"Tasks"` → static text.
- `"{remaining()} left"` → interpolation hole `remaining()` followed by literal
  `" left"`.
- `\{` is a literal brace (escape). `\"` is a literal quote.

Strings in the **script zone** are ordinary JS/TS strings (single, double,
template) and are opaque.

### 4.6 Numbers, operators, punctuation

Numbers and operators appear only inside opaque expressions and script text;
the Bloom grammar does not tokenize them structurally. Structural punctuation:

```
( )   { }   [ ]   ,   :
```

---

## 5. Grammar (EBNF)

Notation: `X*` zero+, `X+` one+, `X?` optional, `A | B` choice, `( )` group,
`"lit"` literal, `<Name>` nonterminal.

```
SourceFile   ::= Item*
Item         ::= ScriptStmt | Component

Component    ::= "component" TypeName Props? Body
Props        ::= "(" OpaqueTS ")"            // e.g. (props: { name: string })
Body         ::= "{" ScriptStmt* ViewRoot "}"
ViewRoot     ::= Element                      // exactly one

ScriptStmt   ::= <opaque JS/TS statement>     // import / type / interface /
                                              // let / const / function / expr / …

Element      ::= Tag Attributes? Children?
Tag          ::= TagName | TypeName           // TagName → DOM; TypeName → component
Attributes   ::= "(" ( Attribute ("," Attribute)* ","? )? ")"
Attribute    ::= AttrName ":" Expr
Children     ::= "{" Child* "}"

Child        ::= Text
               | ExprText
               | Element
               | IfBlock
               | EachBlock

Text         ::= String                       // may contain {Interpolation}
ExprText     ::= Expr                          // bare expression → reactive text

IfBlock      ::= "if" Expr Children ElseClause?
ElseClause   ::= "else" ( IfBlock | Children ) // "else if" chains via IfBlock

EachBlock    ::= "each" Ident "in" Expr KeyHint? Children
KeyHint      ::= "(" "key" ":" Expr ")"

Expr         ::= <opaque JS/TS expression>     // captured, not parsed
```

---

## 6. Constructs in detail

### 6.1 Component

```
component TodoApp { …script… …view root… }
component Footer(props: { remaining: number }) { …view root… }
```

- `TypeName` is the component name; it is the module's default export.
- `Props?` is an opaque TS parameter list. Conventionally a single `props`
  parameter with an inline object type, but any valid TS parameter text is
  allowed. Absent = the component takes no props.
- The body is `ScriptStmt* ViewRoot`.

### 6.2 Script zone

Zero or more opaque JS/TS statements: imports, `type`/`interface` declarations,
`let`/`const` (state via `signal(…)`, derived values via functions/`computed`),
`function` handlers, and any other TS. Copied to the emitted module verbatim
(imports hoisted to module top). The compiler never inspects these beyond
finding where the view root begins.

### 6.3 View zone / elements

An `Element` is a `Tag`, then an optional `Attributes` group, then an optional
`Children` block. All four shapes are legal:

```
br                                   // tag only
input(type: "text")                  // tag + attrs
h1 { "Title" }                       // tag + children
div(class: "x") { … }                // tag + attrs + children
```

### 6.4 Tags vs component refs

- Lowercase name in the known HTML set → **DOM element** → `el("div", …)`.
- Capitalized name → **component ref** → a function call `Footer({ … })` whose
  returned node is inserted.
- A lowercase name **not** in the HTML set, in child position, is **not** an
  element — it is an `ExprText` expression (see §9 ambiguity note).

### 6.5 Attributes & events

Inside `( )`, a comma-separated list (optional trailing comma) of `name: expr`.

- `class: "x"`, `type: "checkbox"`, `value: draft`, `checked: todo.done` —
  attributes / props. Values are opaque expressions.
- `onClick`, `onInput`, `onKeydown`, `onChange`, `onMouseEnter` — **events**
  (name matches `on[A-Z]…`); value is an opaque expression (usually a function).
- Passing a signal itself (e.g. `value: draft`) is the hook for two-way
  binding; see §7.

### 6.6 Children

An element's `{ }` block holds zero or more children in order. A child is:

- **Text** — a string literal, static (`"Add"`) or interpolated
  (`"{remaining()} left"`).
- **ExprText** — a bare JS/TS expression → a reactive text node
  (`span { todo.text }`, `button(…) { name }`).
- **Element** — a nested DOM element or component ref.
- **IfBlock** / **EachBlock** — control flow.

### 6.7 `if` / `else`

```
if visible().length === 0 {
  p(class: "empty") { "Nothing here." }
} else {
  ul { … }
}
```

No parentheses around the condition (the condition is an opaque expression up to
the `{`). `else` may be followed by a block or by another `IfBlock`
(`else if …`).

### 6.8 `each`

```
each todo in visible() (key: todo.id) {
  li { … }
}

each name in ["all", "active", "completed"] {
  button(…) { name }
}
```

- `Ident` is the loop variable, in scope inside the block.
- `in` separates it from the source (an opaque expression).
- The optional `KeyHint` `( key: expr )` supplies the reconciliation key. Absent
  = keyed by index (see §7 caveat).

---

## 7. Semantics & compilation target

The emitter walks the AST and returns a **string of TypeScript**. Script zone
text is emitted verbatim; the view root emits a function body that builds and
returns DOM. Reference runtime API:

```ts
signal<T>(v: T): [() => T, (v: T) => void]   // read/write accessor pair
computed<T>(fn: () => T): () => T            // cached derived accessor
effect(fn: () => void): void                 // side effect; re-runs on change
el(tag, props): HTMLElement                  // create element + bind props/events
insert(parent, () => value): void            // reactive child (text/node)
each(parent, () => list, keyFn, renderFn)    // keyed list reconciliation
bind(inputEl, signal): void                  // two-way input binding
mount(Component, container): void            // attach a component to the DOM
```

Emission rules (informative, not exhaustive):

- **Component** → `export default function Name(props) { … return root; }`. The
  script zone is spliced in ahead of the view. `component()` runs **once**;
  there is no re-render.
- **DOM element** `div(class: c) { … }` →
  `const _d = el("div", { class: c }); /* append children */ return _d;`
- **Static text** `"Add"` → `document.createTextNode("Add")`.
- **Interpolated / ExprText** `"{r()} left"`, `todo.text` →
  `insert(parent, () => …)` so a text node updates in place when signals change.
- **Attribute with dynamic value** → wrapped in an `effect` that sets the
  attribute/property on change.
- **Event** `onClick: fn` → `el.addEventListener("click", fn)`.
- **Two-way** `value: sig` (+ `onInput`) → `bind(inputEl, sig)`.
- **Component ref** `Footer(remaining: r(), onPick: f)` → a call
  `Footer({ get remaining() { return r(); }, onPick: f })`. **Value props
  compile to getters** so reads inside the child subscribe across the component
  boundary; callback props pass through as-is.
- **`if` / `else`** → a reactive branch (e.g. `insert(parent, () => cond ? a() : b())`)
  that swaps the mounted node when the condition flips.
- **`each`** → `each(parent, () => list, keyFn, (item) => …)`; unchanged keys
  keep the same DOM element identity across updates.

The runtime is a separate package; the compiler emits calls **by name** and the
two never import each other. Their only contract is these signatures.

---

## 8. Reserved words

Structural: `component`, `if`, `else`, `each`, `in`. Contextual: `key` (only
inside an `each` key hint). All other identifiers — including JS/TS keywords —
are not reserved by Bloom and may appear freely in opaque regions.

---

## 9. Notes for the Tree-sitter implementer

**Opaque regions & injections.** Attribute values, interpolation holes, `if`
conditions, `each` sources, `Props`, and every script statement are arbitrary
JS/TS. Two viable strategies:

1. **Opaque tokens** — capture the region as a single node and stop. Simplest;
   the region gets no internal highlighting.
2. **Injection** — expose these regions so an injected `tree-sitter-typescript`
   grammar highlights them. This is the good end state and is how component
   languages (Svelte/Vue) do it. Provide an `injections.scm` mapping the opaque
   nodes to `typescript`.

**The one real ambiguity: element vs. ExprText.** A child that begins with an
identifier is an **element** iff that identifier is a known `TagName` (§4.4) or
a `TypeName` (Capitalized) _and_ is immediately followed by `(` or `{`.
Otherwise it is `ExprText` (a reactive-text expression). Examples:

- `p { … }` → element (`p` is a tag, followed by `{`).
- `Footer(…)` → element (Capitalized, followed by `(`).
- `todo.text` → ExprText (`todo` is not a tag; followed by `.`).
- `remaining()` in child position → ExprText (`remaining` is not a tag).
  Enumerating the HTML tag set in the grammar is what makes this decidable.
  Recommended authoring style: put function-call text inside string interpolation
  (`"{remaining()} left"`) rather than bare in a child slot, to keep this clean.

**Delimiting the two zones.** The view root is the _final_ element in the
component body; everything before it is script. A pragmatic parse: match script
statements loosely (line/statement granularity) until an element in the known
element-lead form begins at body top level; that element is the `ViewRoot`.

**Whitespace.** Insignificant except as a token separator. Newlines do not
terminate constructs.

**Testing.** Tree-sitter development is corpus-driven. The `examples/` folder
accompanying this spec is a ready set of fixtures spanning every construct; turn
each into a `test/corpus` entry with its expected S-expression tree.

---

## 10. Not yet specified (future / optional)

These are intentionally out of scope for v0. Design later:

- **Fragments** — more than one root element per component.
- **Slots / children props** — passing a `{ … }` block _into_ a component ref so
  the child renders parent-supplied content (a `children` prop).
- **`bind:` shorthand** — collapsing `value: sig` + `onInput` into one binding
  token.
- **Boolean attribute shorthand** — `disabled` alone meaning `disabled: true`.
- **`each` index** — a second loop binding for the index.
- **Event modifiers** — e.g. `onClick|preventDefault`.

Anything in this section should be treated as absent by a v0 grammar.
