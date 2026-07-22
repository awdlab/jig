The Table renders an array of row objects as a data grid with sorting,
per-column filtering, single and multi selection, row grouping, column
resize/reorder/sticky, pagination, virtual scrolling, and per-row actions.
Structure is opt-in and declarative — you enable each feature by adding a
directive to a header cell or an input to `ngn-table`.

> **Data is client-side by default.** Sorting, filtering, grouping and
> pagination all operate on the in-memory `rows` array (the pipeline is filter
> → sort → group → paginate). For server-driven data, provide `dataSource`
> instead (see "Lazy Loading" further down) — sort/filter are then delegated
> to the loader and grouping is unsupported. The `virtual` input is about
> _rendering_ (only visible rows hit the DOM) independent of lazy loading,
> though the two combine for infinite scroll.

### Basic Usage

You provide a `#header` template of `<th ngnTableTh>` cells and a `#body`
template of `<td ngnTableTd>` cells, then turn features on with directives such
as `ngnTableSortableColumn`, `ngnTableFilterableColumn`, or
`ngnTableStickyColumn`. `rows` and `fieldId` are required — `fieldId` names the
property that uniquely identifies each row and is used for selection keys and row
tracking. Give the table a fixed height, as it scrolls its body internally.

{{ demo: Demo_Table_Base }}

### Selection

Set `selectionMode` to `'single'` or `'multi'` (or leave it `null` to disable
selection) and two-way bind `[(selection)]`, an array of row IDs (the `fieldId`
values). In `multi` mode use Ctrl-click to toggle individual rows and Shift-click
to extend a range; add a `<th ngnTableSelectionColumn>` / `<td ngnTableSelectionColumn>`
pair to get per-row checkboxes plus a header select-all checkbox (which shows an
indeterminate state on a partial selection).

#### Single Selection

{{ demo: Demo_Table_Selection_Single }}

#### Multi Selection

{{ demo: Demo_Table_Selection_Multi }}

### Sorting Columns

Add `ngnTableSortableColumn` to a header cell. Clicking the header cycles the
sort ascending → descending → unsorted, reflected in the two-way `[(sort)]`
model (`{ column, direction }` or `null`). The default comparator handles
numbers numerically and everything else via `localeCompare`, with nulls first
on ascending; pass a `sortComparator` to override it. The active header carries
`aria-sort="ascending" | "descending"`.

{{ demo: Demo_Table_Sorting }}

### Filtering Columns

Add `ngnTableFilterableColumn` with a `…Type` (the column's data type, which
picks the available operators and UI) and, for list filters, a `…Items` option
set. A filter button appears in the header and opens a filter popover; applied
filters live in the two-way `[(filters)]` model, keyed by column. Multiple
column filters combine (AND).

{{ demo: Demo_Table_Filtering }}

### Row Grouping

Set `groupBy` to a column key to collect rows sharing that value under
collapsible group-header rows (each showing the group value and its count).
Two-way bind `[(expandedGroups)]` (an array of group values) to control which
groups are open — it defaults to `[]` (all collapsed), so pass every group value
to start expanded. Grouping is applied after sorting, so a group's rows honour
the active sort.

{{ demo: Demo_Table_Grouping }}

### Paged Table

Set `paginator` to render an `ngn-paginator` below the grid and page the rows
client-side. Combine freely with sorting and filtering — paging is the last step
of the pipeline, so it pages the already-sorted/filtered result.

{{ demo: Demo_Table_Paged }}

### Virtual Scrolling

Set `virtual` and provide a fixed `rowHeight` to render only the rows in (and a
small `virtualPadding` around) the viewport. This keeps very large datasets
smooth. Because rows are recycled, avoid stateful per-row DOM outside the
control's own machinery.

{{ demo: Demo_Table_Virtual }}

### Resizable Columns

Set `resizable` to add drag handles to header cells; double-clicking a handle
auto-sizes the column to its content. Each `ngnTableTh` accepts a `size`
(e.g. `'1fr'`, `'200px'`, `'25%'`), `minSize`, and `maxSize`. `resizeMode`
chooses how the drag distributes width: `'adjacent'` (default) keeps the total
width constant by shrinking the neighbour, while `'push'` lets the column grow
independently and enables horizontal scrolling. `lockSizes` controls whether
affected columns are pinned to fixed `px` after a resize.

{{ demo: Demo_Table_Resizable }}

### Reorderable Columns

Set `reorderable` to let users drag column headers into a new order (a drop
indicator shows the target position). The order is exposed through the two-way
`[(columnOrder)]` model — an array of column IDs — which you can persist and
restore. An empty array means natural DOM order.

{{ demo: Demo_Table_Reorderable }}

### Sticky Columns

Add `ngnTableStickyColumn="start"` or `="end"` to a header cell to pin that
column to the left or right edge while the rest of the grid scrolls
horizontally. Multiple sticky columns stack against their edge.

{{ demo: Demo_Table_StickyColumns }}

### Row Actions

Add `ngnTableRowActions` to a body `<tr>` with an `NgnActionItem[]`. By default
the same actions are exposed two ways (both independently toggleable): a
right-click context menu (`…Context`) and an inline button-bar at the row's edge
revealed on hover or keyboard focus (`…Inline`). Actions may nest via `children`
to open submenus. The keyboard context menu (Enter / ContextMenu / Shift+F10 on
the current row) is always available even when the right-click affordance is off.

{{ demo: Demo_Table_RowActions }}

### Lazy Loading

Provide a `dataSource` loader instead of `rows` to fetch rows on demand — the
table switches into lazy mode, delegating sort/filter to the loader and
ignoring `rows`. The loader receives a `TableLoadRequest` (page/slice
coordinates, active sort/filters, and an abort signal for superseded requests)
and resolves a `TableLoadResult` (`rows`, `hasMore`, and optionally
`total`/`cursor`). Incompatible with `groupBy`.

With `paginator`, the loader is called with `pagination.slice.skip`/`.take` for
the requested page:

{{ demo: Demo_Table_LazyPagination }}

Without `paginator`, set `virtual` and `rowHeight` to infinite-scroll: the
table calls the loader again as the user scrolls near the end, appending rows
until `hasMore` is `false`.

{{ demo: Demo_Table_LazyInfiniteScroll }}

Omit `total` from the result and return a `cursor` instead to switch the
paginator into compact mode (next/previous only, no page count) — useful for
cursor-based backends where the total row count isn't known.

{{ demo: Demo_Table_CompactCursorPagination }}
