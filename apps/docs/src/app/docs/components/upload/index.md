The Upload component is a drop zone that wraps a **consumer-provided** native
`input[type=file]`. You project the input as content and configure its native
features there (`accept`, `multiple`, `name`, …) — the control discovers it,
hides it, and drives it for both click-to-select and drag-and-drop.

### Reporting progress

The control owns the list of tracked files and their lifecycle state, but it
cannot observe the actual transfer — your app runs the request. Report progress
and status back through the `exportAs="ngnUpload"` handle
(`setProgress`, `markDone`, `markFailed`).

### Auto Upload

Files upload the instant they are selected or dropped.

{{ demo: Demo_Upload_Base }}

### Confirm Upload

Files queue as `pending` until the rendered Upload button is pressed.

{{ demo: Demo_Upload_Confirm }}

### Manual Upload

Files queue as `pending` with no rendered trigger — uploading starts only from
code via the control's `uploadAll()` / `uploadFile(id)` methods.

{{ demo: Demo_Upload_Manual }}

### Interaction Modes

Restrict adding files to `click`, `drag`, or `both` (default). Click-only zones
drop the dashed "droppable" outline.

{{ demo: Demo_Upload_Interaction }}

### List Position

Place the file list `top`, `bottom` (default), `left`, or `right` of the zone.

{{ demo: Demo_Upload_Position }}

### Item States & Actions

Each list item exposes cancel, retry, and remove depending on its state.

{{ demo: Demo_Upload_States }}
