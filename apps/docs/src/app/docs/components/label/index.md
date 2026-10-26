`jigFor` connects a `<label>` to any jig control — use it wherever you would
write `<label for>`.

A plain `for` only works for native form elements (`input`, `select`,
`textarea`, `button`, …). Controls such as the slider, rating or select-button
render no native input, so `for` names nothing and clicking the label does
nothing. `jigFor` closes that gap and works the same way for every target.

### Basic Usage

Pass the control itself through a template reference. The label names the
control, and clicking it moves focus to the control.

```html
<label [jigFor]="volume">Volume</label>

<jig-slider #volume />
```

A template reference on a native input gives you the element, not the
control; use the directive's export instead (`#name="jigInput"`,
`#amount="jigNumberInput"`), or pass an id.

{{ demo: Demo_Label_Base }}

### Groups

For a control that groups several items — select-button, radio-group, a range
slider, otp — the label names the group, and clicking it focuses the group's
tab stop — the item Tab would land on, which is the selected option when there
is one.

{{ demo: Demo_Label_Group }}

### Labels in another template

When the label is rendered by a different component than the control — a
form-row layout that receives a field id, for example — there is no template
reference to pass. Pass the id instead, and set the same id as the control's
`inputId`:

```html
<!-- form-row.html -->
<label [jigFor]="fieldId()">{{ label() }}</label>
<ng-content />

<!-- usage -->
<app-form-row label="Volume" fieldId="volume">
  <jig-slider inputId="volume" />
</app-form-row>
```

### How it works

`jigFor` sets the label's `for` attribute to the control's `inputId` (or the
given id) and then looks up that element:

- The label gets an id, which is added to the target's `aria-labelledby`. That
  makes the visible label the accessible name on every control, winning over the
  control's own `label` input.
- A label click focuses the target when it is a tab stop, otherwise its first
  enabled tab stop inside. Native inputs also get the browser's own label
  behaviour, such as toggling a checkbox.

The lookup runs once after the label renders and again on every click, so a
control rendered later than its label is named on the first click.

### Inside an input field

`<jig-input-field [label]>` uses `jigFor` for its own label and points it at the
projected control, so you don't need the directive there.

### Label or `labelledBy`, not both

A control rewrites its `aria-labelledby` whenever its own `labelledBy` input
changes, which drops the label's id. Name a control with one or the other.
