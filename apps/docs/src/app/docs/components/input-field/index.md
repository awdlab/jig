The Input Field (`<jig-input-field>`) is the standard chrome around a form
control — label, border, focus ring, adornments, and states. It is a
**composition wrapper**, not a variant of the input: it projects whatever control
you place inside it (`jigInput`, `jigNumberInput`, `jigMaskInput`, a calendar or
select, …) and wires the field to it.

### Basic Usage

The field discovers the projected primary control automatically and skips
auxiliary controls (buttons, icons, spin buttons), so their placement never
shadows the real input; clicking anywhere on the chrome forwards focus to that
control, and it manages the `id` / `aria-labelledby` wiring between the label and
the input. Set a `label` (with optional `labelKind` for placement) or wire an
external label via `labelledBy`. Content placed before or after the projected
control becomes a prefix or suffix — icons, `<jig-state>` indicators, tooltips,
or `jigButton` actions.

The control keeps its own `id`, and the field label follows it, so an `id` on
the `<input>` (or `inputId` on a select, calendar, …) is what external labels
reference. The **A11y** tab shows the external-label pattern.

{{ demo: Demo_InputField_Base }}

### Validation

The field mirrors the projected control's validity for styling; pair it with
`jigErrors` / `jig-hint` to surface messages beneath the field.

{{ demo: Demo_InputField_Validation }}

### Required Marker

`showRequiredMarker` appends a `*` to the label when the projected control is
required. The field reads that from the control itself, so all three form
paradigms work without extra wiring: reactive `Validators.required`, the
template-driven `required` attribute, and the signal-forms `required()` rule
(setting `required` on the control by hand works too).

Switch it on for the whole app with `provideJigControls({ defaults: { inputField:
{ showRequiredMarker: true } } })` — it is off by default — and override it per
field with `[showRequiredMarker]`.

{{ demo: Demo_InputField_Required }}

### Textarea

The same wrapper works around a multi-line `<textarea>` — the field adapts its
height to the projected element.

{{ demo: Demo_InputField_Textarea }}

### Clear Button

Enable `showClearButton` for a built-in affordance that empties the value and
refocuses the input (customize the glyph with `iconClearButton`). Controls that
manage their own value clear through a hook; plain inputs clear via the DOM. A
`readonly` field hides the button — clearing would write to the control.

{{ demo: Demo_InputField_Clear }}

### States

`disabled`, `readonly`, and `invalid` can be set explicitly on the field to force
the corresponding styling when your validity comes from outside Angular forms; a
disabled field is made `inert`. States compose — a field can be invalid and
readonly at once.

The field only reflects the invalid state of its own projected control — an
invalid `<form>` or form group does not mark the other fields inside it. For
group-level errors (e.g. a password confirmation), bind `invalid` on the fields
that should show them: `[invalid]="form.hasError('mismatch')"`.

{{ demo: Demo_InputField_States }}

### Label

`labelKind` chooses how the label is presented relative to the field.

{{ demo: Demo_InputField_Label }}
