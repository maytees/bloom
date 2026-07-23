; Structural keywords
[
  "component"
  "if"
  "else"
  "each"
  "in"
] @keyword

; `key` is contextual: only special inside an each key hint
(key_hint "key" @keyword)

; Component declaration
(component name: (type_identifier) @type)

; Props are a bare TS parameter list, so injections.scm leaves them alone;
; paint them flat rather than letting them fall through uncolored.
(props_text) @variable

; Element leads: HTML tag vs. component ref
(element tag: (tag_name) @tag)
(element tag: (type_identifier) @constructor)

; Attributes; events (on[A-Z]…) get the function color
(attribute name: (attr_name) @property)
((attribute name: (attr_name) @function)
 (#match? @function "^on[A-Z]"))

; each loop variable
(each_block item: (identifier) @variable)

; Text and interpolation
(string) @string
(escape) @string.escape
(interpolation ["{" "}"] @punctuation.special)

(comment) @comment

; Punctuation
[
  "("
  ")"
  "{"
  "}"
] @punctuation.bracket

[
  ","
  ":"
] @punctuation.delimiter
