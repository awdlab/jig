The Input is an attribute directive (`jigInput`) on a native `<input>` or
`<textarea>` that keeps a `value` model (`string | null`) in sync with the
element in both directions. Because it is a plain directive on a real form
element, `ngModel`, `formControl`, or `formControlName` work alongside it out of
the box — validation, dirty/touched tracking, and value access all behave
natively.

Wrap it in `jig-input-field` for field chrome (label, borders, focus ring,
adornments); unlike `input-field`, this directive is only the value binding on
the element itself.

### Basic Usage

A bare `jigInput` on an `<input>`, projected into a `jig-input-field`, with its
`value` bound two-way through `value` / `valueChange`.

{{ demo: Demo_Input_Base }}

### Validation

Combine `jigInput` with `ngModel` and Angular validators; `jigErrors` plus an
`jig-hint` surfaces the messages under the field.

{{ demo: Demo_Input_Validation }}

### States

`jig-input-field` mirrors the input's state for styling: `readonly` and
`disabled` come from the native attributes on the element, and `invalid` applies
error styling. Set `invalid` explicitly when your validity comes from outside
Angular forms. States compose — a field can be invalid and readonly at once.

{{ demo: Demo_Input_States }}

### Composition

`jig-input-field` projects arbitrary content, so prefixes and suffixes are just
elements placed before or after the input — icons, `<jig-state>` indicators,
tooltips, or `jigButton` actions. Auxiliary controls are skipped when the field
picks its primary control, so their placement never shadows the real input.
Provide a `label` (with an optional `labelKind` for placement) or wire
`labelledBy`/`inputId` to an external label; enable `showClearButton` for a
built-in clear affordance.

### Textarea

The same directive drives a `<textarea>` for multi-line input — set `rows` (and
any other native attributes) directly on the element.

{{ demo: Demo_Input_Textarea }}
