---
name: ngn-controls
description: Use @ngneers/controls (ngn) Angular UI components correctly — discover controls, look up their real API, selectors, and theme-dependent kind/color values before writing template or component code. Use whenever building or editing Angular UI in a project that depends on @ngneers/controls.
metadata:
  version: 1
---

# Using @ngneers/controls

`@ngneers/controls` (prefix `ngn`) is a signal-first Angular component library. Do
NOT guess component names, selectors, or input signatures — they are precise and
theme-driven. This project has the `@ngneers/controls-mcp` MCP server connected;
use its tools as the source of truth.

## Workflow

1. **Discover** — call `list_controls` to see every control with its selector and
   a one-line summary. Use `search_docs` when you know the goal but not the
   control ("how do I theme dark mode", "date picker").
2. **Look up the real API** — before writing any code that uses a control, call
   `get_control` with its name (e.g. `select`, `number-input`, `tooltip`). It
   returns the exact inputs/outputs, types, defaults, and usage prose.
3. **Resolve kind/color** — a control's `kind` / `color` inputs are
   **theme-dependent** (not a fixed type). Call `get_theme_options` (optionally
   scoped to a control) for the allowed values in the built-in themes. If the app
   uses a custom theme, read its `createTheme({ …, kinds, colors })` or the app's
   `NgnCustomTypes` (`CustomKind` / `CustomColor`).
4. **Explain a concept** — use `search_docs` / the `ngn://concept/<slug>`
   resources for cross-cutting topics (theming, colors, passthrough, state).

## Conventions to honor

- **Signals, not decorators** — controls use `input()` / `model()` / `output()`.
  Bind values two-way with the signal model, e.g. `[(value)]="mySignal"`.
- **Field chrome** — wrap form controls (`ngn-select`, `input[ngnInput]`,
  `input[ngnNumberInput]`, …) in `ngn-input-field` for label/hint/error.
- **The field owns the input's `id`** — `ngn-input-field` writes `inputId()` onto
  the projected input, replacing an `id` set on the `<input>` itself. Put the id
  on the field (`<ngn-input-field [inputId]="'x'">`) when an external
  `<label for>` references it, or read it back via a template ref
  (`[for]="field.inputId()"`). Grouped controls without a single focusable
  element (`ngn-otp`) take `labelledBy` instead of `for`/`id`.
- **Selectors are exact** — some controls are elements (`ngn-select`), others are
  attribute directives (`button[ngnButton]`, `[ngnTooltip]`). Copy the selector
  from `get_control`; never invent it.
- **Style through the theme**, never hardcode colors in component styles.

## Rule

Never write code using an ngn control whose API you have not confirmed via
`get_control` in this session. Verify, then write.
