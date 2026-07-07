The Tree component displays hierarchical data with expand/collapse, virtual
scrolling, filtering, single & multi-select, and tri-state cascading
checkboxes. It is accessible by default (WAI-ARIA `tree` pattern).

### Basic Usage

{{ demo: Demo_Tree_Base }}

### Validation

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
