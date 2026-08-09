The Dialog wraps the native HTML `<dialog>` element, so it inherits the
platform's top-layer rendering, focus handling, and Escape behaviour rather than
reimplementing them. Content can be an eager template, a lazily-loaded one, a
plain string, or a whole component, and the dialog can be opened declaratively
via `[(open)]` or imperatively via `show()` / `hide()` / `toggle()`.

### Modal vs. non-modal

The `modal` input decides which native mode is used. When `modal` is `true` the
dialog opens with `showModal()`: it renders a backdrop and makes the rest of the
page inert. When `false` (the default) it opens as a Popover (`showPopover()`) —
still in the top layer, but non-modal, so the page behind stays interactive.
`autofocus` defaults to the value of `modal`, so modal dialogs grab focus on open
by default.

### Basic Usage

Bind `[(open)]` to your own signal and react to its changes, or call the
component's methods. `title` populates the default header; `size` accepts any CSS
length for `width`/`height` and their `min`/`max` variants.

{{ demo: Demo_Dialog_Base }}

### Closing behaviour

`closeBy` controls how the _user_ can dismiss the dialog:

- `'any'` (default) — click the backdrop / outside, or press Escape.
- `'escape'` — Escape only.
- `'none'` — no user dismissal; close it programmatically by setting `open` to
  `false`.

Regardless of `closeBy`, the `closed` output fires only once the close animation
has fully finished.

### Buttons

Pass `footerButtons` an array of action-button configs to render a footer action
row. Each config carries a `value`; clicking a button emits that value through
`buttonClicked` — it does not close the dialog on its own, so react to the event
(e.g. set `open` to `false`). This is the building block the prompt dialogs below
use to report which button resolved them.

{{ demo: Demo_Dialog_Buttons }}

### Movable & resizable

Set `movable` to let the user drag the dialog by its header, and `resizable` to
add a resize affordance. Both are off by default and can be combined.

{{ demo: Demo_Dialog_Movable }}

### Lazy Loading

For template content, set `lazy` so the content is only instantiated the first
time the dialog opens — useful when the body is expensive or has side effects on
init. Add `cache` to keep the content alive between opens after that first load
instead of recreating it each time.

{{ demo: Demo_Dialog_Lazy }}

### Creating Dialogs Programmatically

`createDialog(injector, config)` spins up a dialog imperatively — handy for
confirmations and one-off dialogs you don't want to declare in a template. The
config mirrors the component inputs (`title`, `size`, `modal`, `closeBy`,
`footerButtons`, `content`, `movable`, `resizable`), and `content` may be a
string, a `TemplateRef`, or a component type.

{{ demo: Demo_Dialog_CreateDialog }}

### Prompt Dialog

A prompt dialog collects a value and resolves with it. Write the body as a
component extending `PromptDialogBase`, handle the footer button in
`onDialogButtonClicked`, and call `fulfilPrompt(value)` to resolve (or
`fulfilPrompt()` with no argument to resolve as cancelled). Created via
`createDialog`, it returns a `result` promise carrying both the produced value
and the button that triggered it, so the caller can tell confirm from cancel.

{{ demo: Demo_Dialog_Prompt }}

### Custom header, footer & content

Beyond `title` and `footerButtons`, every region is overridable. Project an
`<ng-template #header>`, `#footer`, or `#content` inside `awd-dialog`, or bind
the `templateHeader` / `templateFooter` / `content` inputs. The header template
receives `headerId` and `title` in its context so custom headers stay wired to
the dialog's accessible name.
