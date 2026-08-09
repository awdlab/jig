The Command palette (`<awd-command>`) is a chromeless modal dialog holding a search
field over a filtered list of actions — the `⌘K` pattern. Pass the same
`NgnActionItem[]` you would give a menu: leaf entries are runnable commands, and a
top-level entry with `children` renders as a labelled group. Picking a command runs
its `callback`, navigates its `route`, emits `commandSelected`, and closes the palette.

### Basic Usage

Bind `[(open)]` and open the palette however you like — `awd-command` deliberately
registers no global hotkey, so the shortcut stays yours to own.

{{ demo: Demo_Command_Base }}

### Grouped Commands

Give a top-level item `children` to render a labelled section. Searching keeps the
sections that still have a match and hides the rest.

{{ demo: Demo_Command_Grouped }}

### Routing

An item with a `route` navigates through the Angular router when picked, so the
palette doubles as a jump-to-page search.

{{ demo: Demo_Command_Routes }}

### Keyboard Shortcuts

Give an item a `shortcut` — `+`-joined lowercase tokens like `mod+n` or
`shift+mod+p`, where `mod` is ⌘ on macOS and Ctrl elsewhere — and the palette
renders it as a keycap on the row and runs the command whenever the combo is
pressed, open or closed. A footer legend spells out the keys that drive the palette
itself.

Opening the palette stays with you — `awd-command` registers no hotkey of its own.
Wrap the surface in `[ngnKeyboardShortcut]` and pass the binding you want.

{{ demo: Demo_Command_Shortcuts }}

### Searching

Search matches item labels case-insensitively, word by word. Pass a `FilterConfig`
to `[filter]` to match other fields or change the matching strategy.

### Supplying your own matches

To rank or fetch results yourself — a scored index, or a remote endpoint — bind
`[(filterText)]` and derive `[items]` from it, with `[filter]="false"` so the
matches you supply are not filtered a second time. `filterText` resets whenever the
palette closes. The docs search in this site's header works exactly this way.
