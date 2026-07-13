The Checkbox is a form control for boolean input, rendered on top of a real
native `<input type="checkbox">`. It extends the value-control base, so it
participates in Angular forms — bind `value`/`(valueChange)`, or use `ngModel`
/ `formControlName` — and tracks `touched` on blur. `readonly`, `disabled`, and
`invalid` apply the matching states (readonly and disabled also block the
toggle).

### Basic Usage

A standalone checkbox. Bind `value` / `(valueChange)` (or `ngModel`) to read and
set its checked state.

{{ demo: Demo_Checkbox_Base }}

### Validation

The checkbox plugs into the shared `ngnErrors` + `ngn-hint` validation flow like
any other control.

{{ demo: Demo_Checkbox_Validation }}

### Indeterminate State

Set `allowIndeterminate` to enable the tri-state behavior. This widens the value
type from `boolean` to `boolean | null`, where `null` is the indeterminate
("mixed") state — typically used for a parent checkbox whose children are only
partly selected. Because the real native input's `indeterminate` property is set,
the browser reports the mixed state to assistive technology automatically (as
`aria-checked="mixed"`); checked and unchecked are announced the same way. Note
that a user click always resolves to `true`/`false` — the control never toggles
back into `null` on its own, so drive the indeterminate value from your own
logic.

{{ demo: Demo_Checkbox_Indeterminate }}

### Control States

The checkbox across its states — `disabled`, `readonly`, `invalid`, and
combinations. Each state's glyph can be overridden with `iconChecked`,
`iconUnchecked`, and `iconIndeterminate`.

{{ demo: Demo_Checkbox_States }}
