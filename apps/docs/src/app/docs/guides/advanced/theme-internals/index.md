This page describes how the engine turns theme parts into CSS. You don't need it to _use_
themes — see [Authoring a Theme](/guides/authoring-a-theme) for that — but it explains the
behavior you'll hit when authoring parts.

### Runtime injection

Nothing is compiled ahead of time. `applyTheme(theme, scopes, options)` runs in the
browser and emits **two `<style>` elements per control scope**: one for CSS variables
(tokens) and one for style rules. Scopes load **lazily** — a control calls
`loadScope(scope)` from `injectThemeTemplate` the first time it renders, and the engine
also pulls in that scope's **dependency scopes transitively**, so a composed control's
nested controls are always styled.

### Tokens → CSS variables

A token part supplies a `values` tree; the engine walks it and emits custom properties.
Names are derived by joining the scope and key path, replacing `.` with `-` and camelCase
with kebab-case, prefixed with `--ngn-`:

```text
scope 'size',  key 'rounded.lg'      → --ngn-size-rounded-lg
scope 'color', key 'surface.50'      → --ngn-color-surface-50
scope 'shadow', key 'md'             → --ngn-shadow-md
```

A value wrapped in braces is emitted as a **reference** to another token
(`'{color.text}'` → `var(--ngn-color-text)`) — this is how the auto-contrast colors
self-heal per scheme.

### The `css` helpers: `v`, `c`, `d`

A part's `root`/`dark` block is a function returning a CSS string, given three helpers:

- **`v(key)`** → `var(--ngn-<key>)` — reference a design token.
- **`c(className)`** → the control's own scope class selector.
- **`d(scope, className)`** → a **dependency** control's class selector, for styling a
  nested control from its parent. The allowed `(scope, className)` pairs are constrained by
  the template's declared `dependencies`.

### Layering: base then the themed layer, source order wins

For a part with a `base`, the base CSS is emitted **first**, then the theme's rules (nova,
shade, or material). Both are given a selector suffix that adds exactly one pseudo-class of
specificity — base uses `:not(.ngn-css-specificity)` (a class that never exists), the themed
layer uses `:not(.ngn-unstyled)`. Equal specificity means **source order decides, so the
theme wins**. Two consequences:

- Adding the `ngn-unstyled` class to a control makes it fail the themed layer's
  `:not(.ngn-unstyled)` match, dropping it while the structural base rules remain — that's
  how `unstyled` controls work.
- Dark values are emitted under `&.dark { … }` on the scope root, activated by the `dark`
  class on `<html>` (see [Dark Mode](/guides/dark-mode)).

### Scope flattening & `$deps`

A control's template lists nested controls under `dependencies`. On the **type** side,
`ThemeClasses<T>` exposes those nested class maps under a `$deps` key (keyed by child
scope). This `$deps` object is consumed by the type system and by test harnesses to build
selectors — it is **not** a passthrough authoring path (the `pt` runtime never reads it).
To style or pass through to a nested control, use its **flattened scope class** via `d()`
in themes or the parent's flattened scope name in [Passthrough](/guides/passthrough).

### Gotchas

- A part may declare `light` and `highContrast` blocks, but only `root` and `dark` are
  currently emitted. Put light-mode values in `root`.
- `createTheme` does not validate that all required parts are present — a missing part
  warns and is skipped at runtime rather than failing loudly.
- The `css` tag is just `String.raw` — no minification or processing; it exists for editor
  highlighting.
