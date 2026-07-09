Controls share a consistent, signal-backed state model. It lives in two base classes:

- **`NgnBase<T>`** — the root of every control. Owns presentation/identity state:
  `unstyled`, `kind`, `color`, and the `pt` passthrough input.
- **`ValueControlBase<T>`** — extends `NgnBase` for form-value controls. Adds the value and
  interaction state.

### The state signals

`ValueControlBase` exposes these (all boolean inputs use Angular's `booleanAttribute`
transform, so `<ngn-checkbox disabled>` works):

| Signal                             | Kind      | Meaning                       |
| ---------------------------------- | --------- | ----------------------------- |
| `value`                            | `model()` | the control's value (two-way) |
| `disabled`                         | `input()` | non-interactive, greyed       |
| `readonly`                         | `input()` | visible but not editable      |
| `invalid`                          | `input()` | failed validation styling     |
| `touched`                          | `model()` | has been focused/blurred      |
| `dirty`                            | `input()` | value has changed             |
| `label` / `labelledBy` / `inputId` | `input()` | accessibility wiring          |

`value` and `touched` are two-way `model()`s; the rest are one-way inputs.

{{ demo: Demo_ControlState_Flags }}

### `invalid` is set by you, not derived

Setting `[invalid]` is an explicit choice — the control does not flip it automatically from
form validation. There is **no `ControlValueAccessor`**. Instead:

- **Signal forms** — controls implement `FormValueControl`, so they bind directly.
- **Reactive/template forms** — a dedicated error directive reads the Angular
  `AbstractControl`'s `errors`/`touched`/`dirty` and drives a hint control, rather than
  mutating the control's own `invalid`.

### State drives theming

State signals are wired to theme classes when a control calls `injectThemeTemplate` with a
mapping. Each entry is a class name mapped to a boolean or a **callback** that reads a
signal:

```ts
protected readonly theme = this.injectThemeTemplate(inputControlTemplate, {
  root: true,
  invalid: () => this.invalid(),
  empty: () => !this.value(),
});
```

When `invalid()` flips to `true`, the `invalid` theme class appears on the host — no manual
DOM code. The callbacks are re-evaluated reactively, so they must read signals to stay
live. This is the same mechanism [Passthrough](/guides/passthrough) uses to apply classes.

### Inherited state

`unstyled` cascades from a parent control to its children automatically. `disabled` is
composed where it makes sense — e.g. a radio button is disabled if either it or its group
is disabled, and an input-field marks its host `inert` when disabled so projected controls
follow.
