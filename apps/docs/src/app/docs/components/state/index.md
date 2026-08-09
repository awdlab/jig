The State component (`<jig-state>`) is a compact status indicator for one of
five kinds — `loading` (renders a spinner), `success`, `warning`, `error`, and
`cancelled` (each renders a status icon). Set the `kind` input and swap it as an
operation progresses (e.g. `loading` → `success`) to give inline feedback next
to a button or form field.

### Button

Drop an `<jig-state>` inside an `ngnButton` to show progress in place. By default
the indicator sits alongside the button's label; set `replaceContent` to hide the
label and show only the indicator while it is visible — useful for a submit
button that should collapse to a spinner while the request is in flight.

{{ demo: Demo_State_Button }}

### Input Field

Placed inside an `jig-input-field`, the indicator acts as a trailing status
adornment — pairing well with `ngnTooltip` to explain a warning or error.

{{ demo: Demo_State_InputField }}

### Interaction

Toggle `visible` to mount and unmount the indicator as state changes, and bind
`kind` to a signal to drive the loading → success → idle cycle.

{{ demo: Demo_State_Interactive }}

### Sizing and icons

`size` sets the indicator size in pixels (default `16`), and `thickness` sets the
spinner's stroke for the `loading` kind. Replace any kind's glyph with the
matching `iconSuccess`, `iconWarning`, `iconError`, or `iconCancelled` input.
