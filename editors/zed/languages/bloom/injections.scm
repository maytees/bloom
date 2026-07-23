; Every opaque region in Bloom is arbitrary JS/TS (spec §4.4, §9). Hand each
; one to Zed's built-in TypeScript grammar so it highlights like real code.
;
; Note the doubled parens: a `#set!` predicate has to live *inside* the pattern
; it applies to. At top level it would parse as a separate, capture-less
; pattern and silently do nothing.

((script_statement) @injection.content
  (#set! injection.language "typescript"))

((attr_value) @injection.content
  (#set! injection.language "typescript"))

((condition) @injection.content
  (#set! injection.language "typescript"))

((each_source) @injection.content
  (#set! injection.language "typescript"))

((interp_expr) @injection.content
  (#set! injection.language "typescript"))

((expr_text) @injection.content
  (#set! injection.language "typescript"))

; `props_text` is deliberately not injected: it is a bare TS parameter list
; (`props: { onPick: (name: string) => void }`), which is not a standalone
; program. The TS grammar produces ERROR nodes on it and the result looks
; worse than leaving it plain. See highlights.scm for its flat fallback.
