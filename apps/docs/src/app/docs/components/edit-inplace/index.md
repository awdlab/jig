Edit Inplace (`jig-edit-inplace`) shows a `value` as read-only text and, on
activation, swaps it for an inline text field in the same spot — no separate
form or dialog. It is a value control with a two-way `value` model (`string`)
and the usual `label`, `invalid`, `readonly`, and `disabled` inputs, and
participates in validation.

Built on the generic **inplace** control (an arbitrary display/content swap):
use `edit-inplace` to edit a text value, `inplace` to reveal richer content in
place.

### Basic Usage

Click the text to switch to the inline field; while editing, the field is bound
directly to `value`, so edits apply live. Pressing **Enter**, clicking the
confirm button, or moving focus out of the control returns to the display view —
an empty value shows a placeholder. The `editVisible` model reflects which view
is open, and `switchToEdit()` / `switchToDisplay()` / `toggle()` change it from
code.

{{ demo: Demo_EditInplace_Base }}

### Validation

Wire the standard `ngnErrors` / hint machinery to the control to surface
validation messages; the `invalid` state is reflected on both the display and
edit views.

{{ demo: Demo_EditInplace_Validation }}

### States

The control across its states — `readonly`, `disabled`, and `invalid`, plus
combinations. `readonly` and `disabled` both block switching to the edit view.

{{ demo: Demo_EditInplace_States }}

### Custom templates

Override the default views with `<ng-template>`s (`#display` / `#edit`, or the
`templateDisplay` / `templateEdit` inputs). The edit template receives a context
with the current `value`, an `update(value)` callback, and a `close()` callback.
Content is loaded lazily by default (`lazy`); set `cache` to keep the edit view
alive between openings.

{{ demo: Demo_EditInplace_Templates }}
