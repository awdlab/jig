The Tree (`<awd-tree>`) renders hierarchical data as an expand/collapse outline
built from an `items` array whose nodes nest their own `items`. It supports
virtual scrolling, filtering, single or multi-select, and tri-state cascading
checkboxes, and binds its selection two-way through `value` for use in forms.
Reach for it when your data is nested; for a flat, filterable list use a
**select** instead. It is accessible by default (WAI-ARIA `tree` pattern).

### Basic Usage

Pass your nodes to `items`, nesting child nodes under each node's `items`;
branches expand and collapse on click and clicking a node selects it. This
example enables `multiple` for multi-node selection.

{{ demo: Demo_Tree_Base }}

### Validation

Because the tree is a form control it plugs into validation and dirty/touched
tracking. Here the `ngnErrors` directive surfaces a required-style message until
a node is selected.

{{ demo: Demo_Tree_Validation }}

### Custom Templates

Provide a global `#item` template (or a per-node `template`). The context
exposes the item plus `level`, `expanded`, and `hasChildren`.

{{ demo: Demo_Tree_Templates }}

### Selection, State & Events

Two-way bind `value` and `expandedValues`, and listen to `itemClicked`.

{{ demo: Demo_Tree_Events }}

### Filtering

Matching nodes and their ancestor path stay visible; branches with matches
auto-expand.

{{ demo: Demo_Tree_Filter }}

### Disabled Nodes

A disabled branch disables its whole subtree while remaining expandable.

{{ demo: Demo_Tree_Disabled }}

### Lazy Loading

Mark a branch `lazy` and provide `loadChildren`. Children are fetched on first
expand (a spinner shows while loading) and cached; `nodeExpand` also fires if
you prefer to load them yourself.

{{ demo: Demo_Tree_Lazy }}

### Persisting State

Pass a `storage` config (`key` + optional `NgnStorageKind`) to save expansion
and selection across reloads via `NgnStorage`. Use `states` to persist only
some of them, e.g. `{ key: 'my-tree', states: ['expanded'] }`. The `kind`
accepts `'localstorage'` (default), `'sessionstorage'`, or `'cookie'` — the
`cookie` kind is SSR-safe and restores state during server rendering.

{{ demo: Demo_Tree_Storage }}

### Virtual Scrolling

With `virtual` and a fixed `itemHeight`, only the visible rows are rendered —
here a 5,000-node tree stays smooth.

{{ demo: Demo_Tree_Virtual }}
