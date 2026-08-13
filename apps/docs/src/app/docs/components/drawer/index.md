The Drawer is a panel that slides in from an edge of the screen — for navigation
or for showing extra content without leaving the page. It is built on the native
Popover API, so it renders in the top layer and gets Escape and light-dismiss
handling for free. Control it with the two-way `open` model (or the imperative
`show()` / `hide()` / `toggle()` methods) and react to `closed`, which fires once
the close animation has finished.

### Basic Usage

A modal drawer opened from a button through the two-way `open` model, with a
`header` string that renders the default header and close button.

{{ demo: Demo_Drawer_Base }}

### Positioning

`position` chooses the edge: `start` (default), `end`, `top`, `bottom`, or
`fullscreen`. `start`/`end` follow the writing direction, so a `start` drawer
opens from the left in LTR and from the right in RTL. `size` sets the width for
`start`/`end` drawers and the height for
top/bottom drawers (default `300px`); it is ignored for `fullscreen`. On small
viewports (under 600px in either dimension) the drawer automatically falls back
to `fullscreen` regardless of the requested position.

{{ demo: Demo_Drawer_Position }}

### Modal vs non-modal

`modal` (default `false`) determines both the interaction model and the
accessibility semantics:

- **Modal** drawers block interaction with the rest of the page. The host takes
  `role="dialog"` with `aria-modal="true"`, and a focus trap is activated on open
  — it moves focus into the drawer, wraps `Tab`/`Shift+Tab` inside it, and
  restores focus to the previously focused element on close. When a `header` is
  set it is wired as `aria-labelledby`, naming the dialog.
- **Non-modal** drawers leave the page interactive and expose the panel as a
  `complementary` landmark, so it reads as supplementary side content rather than
  a dialog.

`closeBy` controls which interactions dismiss the drawer (default `'any'`).

### Content, headers and lazy loading

Provide a `header` string to render the default header (with a close button whose
icon you can override via `iconClose`), or project your own header/footer
templates. Set `lazy` to defer rendering the content until the drawer first
opens, and `cache` to keep that content in the DOM after it closes instead of
tearing it down each time.
