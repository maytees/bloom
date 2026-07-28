# Bloom

> [!IMPORTANT]  
> AI was not used to create this project. If a file, or text block is fully or mostly written by AI, the block/file will specify clearly with **100%** transparency. To check whether a markdown block is written by AI, see the raw file for comments.

A simple _"frontend"_ library.

## Ethos

Bloom is a signals-based component language that compiles to TypeScript — building UIs without the < and >. A project for learning how frameworks work.

## Current State

Currently, there is no Bloom markup language. See below for what Bloom's current capabilties are.

## Docs

### Signals

A signal is a way to get and set reactive values; this is similar to `useState` in React.

Unlike react, you don't have a seperate values for get and set; instead, you get one function that does both:

```typescript
const name = signal();

// Set the state
name("Adam");

// Get the state
name();
```

Generics, objects, and default values also work:

```typescript
type Human = {
	name: string;
	age: number;
};

const human = signal<Human>({
	name: "Maytham",
	age: 19,
});

// Type error!
human("not a human");
```

You can also use a dollar sign `$` as a shorthand for creating a signal:

```typescript
const num = $(5);
// ^^^ same as cosnt num = signal(5);
```

### Effect

An effect is a callback function that runs immediately and automatically re runs whenever any signal it reads changes.

To use an effect, simply call the effect function from Bloom:

```typescript
const number = signal(5);

effect(() => {
	console.log(number(), " <-- Number just changed because I called it here!");
});

number(10); // will trigger the console.log statement to run
```

Notice how there's no dependency array? Bloom will auto detect which signals are called inside it and automatically add them as a dependency.

> [!IMPORTANT]  
> Calling `dispose` will simply _"shut off"_ the effect, it does not change the signal's behavior in any way. For example, in a counter increment app, when you call dispose on an effect updating a count text block, it will still increment the signal, it just won't run what's inside of the effect. If you're confused, see the counter example in the [playground](https://github.com/maytees/bloom/tree/master/playground)

To dispose of an effect:

```typescript
const name = signal("Jeff");

const { dispose: disposeNameEffect } = effect(() => {
	console.log(name(), " is a new name");
});

disposeNameEffect();
```

<!-- This section is mostly written by AI, but edited/tweaked by a human (me) -->

### Reactive values must stay lazy

A signal is just a function. Calling it via `count()` just reads the value **right now**, synchronously. There's no tracking magic on the read itself; tracking only happens when that read occurs _inside_ something that re runs later, like an `effect()` (or the effects `el()` sets up internally for reactive props).

The moment you build an expression around a signal read whether its a comparison, a ternary, string concatenation — and hand the _result_ to something else, you've frozen it. The read already happened; nothing is left to re run later.

```typescript
const isRed = signal(true);

// BAD: isRed() runs once, immediately. The boolean result is
// what gets passed in, it's now dead and never updates again.
el("p", { class: isRed() ? "red" : "" });

// GOOD: the whole expression is deferred inside a function.
// Whatever consumes it calls this function and gets `isRed()` on it's own terms, so
// isRed() gets read fresh every time.
el("p", { class: () => (isRed() ? "red" : "") });
```

Passing a **bare signal** directly (no `()`, no wrapping) is fine on its own, for example`isRed` by itself is already callable, and whatever receives it knows to call it at the right time. The trap only appears once you build an expression _from_ a signal read (`name() === "Jane Doe"`, `count() > 5`, etc.). That expression needs to be wrapped in `() => ...` too, not just the raw signal.

> "But in React I don't have to do this!"

Simple answer is that React re-renders an entire component whenver state inside it changes, and re-reads every state automatically. Here though, Bloom only updates the exact DOM attribute/node that actually changed.

So, stay in the habit of wraping reactive values in closures. Be aware that _you don't see an error_ when you mistakingly pass in frozen values. This is necessary for now, but will be automatically handled by the Bloom markup language later on.

### DOM

Now we get into actually creating elements and modifying them. Currently, `mount()`, and `insert()`, don't have much functionality and just have a basic implementation for the sake of testing `el()`.

#### Creating elements

You can create an element using the `el()` function:

```typescript
import { el, signal, insert, mount } from "bloom";

const someLabel = signal("label");

const someParagraph = el("p", {
	class: "text-2xl",
	onClick: () => someAction,
	"aria-label": someLabel, // signals need to be passed without (), or wrap with closure
});

// Docs are a WIP for insert() and mount()
insert(someParagraph, "This is paragraph text");

mount(someParagraph, "mountId");
```

Tag and props args are fully typesafe thanks to Preact's DOM type definitions, only difference is `className` -> `class`, which we'll get into in another section.

See [Reactive values must stay lazy](#reactive-values-must-stay-lazy) for why `"aria-label": someLabel` works as-is here, but a derived condition wouldn't.

#### Dynamic Classes

You may be familiar with the `cn()` utility — the clsx + tailwind-merge helper popularized by shadcn/ui. It's a simple function that allows you to conditionally set classes in your code. This functionality is available in bloom via the `dynamicClass()` util (alias `$dc()`) imported from `"bloom/utils"`. Later on, this will be built into the Bloom markup language.

See [Reactive values must stay lazy](#reactive-values-must-stay-lazy) — every condition here follows the same rule: pass a bare signal directly, or wrap a derived condition in a closure.

Example Usage:

```typescript
import { el, signal } from "bloom";
import { dynamicClass } from "bloom/utils";

const isActive = signal(true);

el("button", {
	// can also call $c()
	class: dynamicClass("btn", {
		active: isActive, // a bare signal works directly
		disabled: () => !isActive(), // a derived condition must be wrapped
	}),
});
```

## Playground vs Examples

`/playground` - Interactive demo's of Bloom's reactivity engine. So in other words, current progress, not concept.

`/examples` - Bloom markup examples (not implemented yet)

To see the playground, go to the [folder's readme](https://github.com/maytees/bloom/tree/master/playground) to view instructions. These playground examples will most likely be on a website sooner or later.

On the other hand, see the `/examples` folder to see what the Bloom markup (similar to jsx) should look like in the future if things go to plan. As of right now, this is just a concept, it doesn't work.
