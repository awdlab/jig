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

Because the field owns that wiring, it also owns the projected input's `id`: pass
`inputId` on the field rather than setting `id` on the `<input>`, which the field
overwrites. The **A11y** tab shows the external-label pattern.

{{ demo: Demo_InputField_Base }}

### Validation

The field mirrors the projected control's validity for styling; pair it with
`jigErrors` / `jig-hint` to surface messages beneath the field.

{{ demo: Demo_InputField_Validation }}

### Textarea

The same wrapper works around a multi-line `<textarea>` — the field adapts its
height to the projected element.

{{ demo: Demo_InputField_Textarea }}

### Clear Button

Enable `showClearButton` for a built-in affordance that empties the value and
refocuses the input (customize the glyph with `iconClearButton`). Controls that
manage their own value clear through a hook; plain inputs clear via the DOM.

{{ demo: Demo_InputField_Clear }}

### States

`disabled`, `readonly`, and `invalid` can be set explicitly on the field to force
the corresponding styling when your validity comes from outside Angular forms; a
disabled field is made `inert`. States compose — a field can be invalid and
readonly at once.

{{ demo: Demo_InputField_States }}

### Label

`labelKind` chooses how the label is presented relative to the field.

{{ demo: Demo_InputField_Label }}
