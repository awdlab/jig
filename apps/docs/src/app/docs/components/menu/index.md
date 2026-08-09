The Menu (`<jig-menu>`) renders a list of actions from a data array (`items`)
rather than markup, carrying `role="menu"` with each item a `role="menuitem"`
button. Use it inline as a static list, as a popover next to a trigger, or as a
right-click context menu.

### Basic Usage

Rendered inline, the menu is a static list you can embed anywhere. Each item is
an action — `label` (a string or a function returning one), optional `icon`,
`callback`, `disabled`, and a `route` for navigation (wired through
`routerLink`) — plus `children` for submenus or a `{ separator: true }` divider.

{{ demo: Demo_Menu_Base }}

### Popover Menu

Set `popover` and pass an `anchor` element to float the menu next to a trigger;
`placement` positions it (default `bottom-start`). Open and close it with the
`show()` / `hide()` / `toggle()` methods or the two-way `open` model, and react
to `closing` / `closed`. When the anchor is a `<button>` the menu manages its
ARIA automatically — setting `aria-haspopup="menu"`, `aria-controls`, and
`aria-expanded` — which you can force on or off with `autoAnchorAria`.

{{ demo: Demo_Menu_Popover }}

### Context Menu

Apply the `jigContextMenu` directive to any element and pass it an items array to
open that menu at the pointer on right-click.

{{ demo: Demo_Menu_ContextMenu }}

### Tiered Menus

An item with `children` becomes a submenu, which itself nests arbitrarily deep.
Submenus open on click, and on hover in popover mode (never on touch devices).
Keyboard navigation follows the menu pattern: `ArrowUp` / `ArrowDown` move focus
between items (wrapping at the ends), `ArrowRight` opens the focused submenu, and
`ArrowLeft` closes the current submenu and returns to its parent. Parent items
expose `aria-haspopup="menu"` and `aria-expanded`.

{{ demo: Demo_Menu_Tiered }}

### Separators

Insert a `{ separator: true }` entry to render a divider between groups of items.

{{ demo: Demo_Menu_Separator }}
