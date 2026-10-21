Controls share a consistent, signal-backed state model. It lives in two base classes:

- **`JigBase<T>`** — the root of every control. Owns presentation/identity state:
  `unstyled`, `kind`, `color`, and the `pt` passthrough input.
- **`ValueControlBase<T>`** — extends `JigBase` for form-value controls. Adds the value and
  interaction state.

### The state signals

`ValueControlBase` exposes these (all boolean inputs use Angular's `booleanAttribute`
transform, so `<jig-checkbox disabled>` works):

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

### `invalid` comes from the form

Inside a form you never bind `invalid` — the bound control's validity reaches it
automatically. There is **no `ControlValueAccessor`**; controls implement
`FormValueControl`, and Angular's interop writes `invalid`, `touched` and `dirty` in for
signal forms (`[formField]`), reactive forms (`[formControl]` / `formControlName`) and
template-driven forms (`ngModel`) alike. `jigInput`, which classic forms drive through
the native value accessor, reads the same state from the bound control.

Set `[invalid]` yourself only for validity from outside Angular forms. Error _messages_
are a separate concern, handled by [`jigErrors`](/components/errors).

When the invalid styling actually appears is a separate decision, owned by `invalidOn`
(`touched` by default, or `dirty` / `immediate` / `never`). The full picture is in
[Forms & Validation](/guides/forms-validation).

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
