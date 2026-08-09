# API

## JigTable

Selector: `jig-table`

{{ api: table/table JigTable }}

### Lazy Loading

Setting `dataSource` switches the table into lazy (server-driven) mode: `rows`
is ignored, and sort/filter are delegated to the loader instead of applied
client-side. `dataSource` is incompatible with `groupBy` — setting both throws
an `JigError` (grouping needs the full row set, which lazy mode never has).

> **Bind `dataSource` to a stable reference** — a class field or method, not an
> inline arrow (`[dataSource]="req => …"`). A new function identity on every
> change-detection cycle invalidates the page cache and refetches every cycle.

| Input               | Type                         | Default | Description                                                                                                                                                                     |
| ------------------- | ---------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dataSource`        | `TableDataSource<T> \| null` | `null`  | Loader callback for server-driven lazy loading. With `[paginator]` it pages lazily; without, it infinite-scrolls.                                                               |
| `selectAllMatching` | `boolean` (two-way)          | `false` | Infinite-scroll only. Set by the header select-all checkbox to request a "select everything matching the current filters" bulk operation, since the full row set is not loaded. |

| Method     | Description                                                                   |
| ---------- | ----------------------------------------------------------------------------- |
| `reload()` | Force a lazy refetch, invalidating the page cache. No-op in client-side mode. |

| Template slot | Context            | Description                                                                                   |
| ------------- | ------------------ | --------------------------------------------------------------------------------------------- |
| `#loading`    | —                  | Rendered instead of the default skeleton rows while a lazy load is in flight.                 |
| `#error`      | `{ error, retry }` | Rendered instead of the default error row when a lazy load rejects. `retry` calls `reload()`. |

The loader has the shape `(req: TableLoadRequest) => Promise<TableLoadResult<T>>`:

| `TableLoadRequest` | Type                                                     | Description                                                                          |
| ------------------ | -------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `pagination`       | `PaginationState`                                        | Page/slice coordinates, reused from the paginator.                                   |
| `sort`             | `{ column: string; direction: 'asc' \| 'desc' } \| null` | Active sort descriptor, or `null` when unsorted.                                     |
| `filters`          | `Record<string, JigFilterConfig> \| null`                | Active per-column filter config, or `null` when unfiltered.                          |
| `cursor`           | `unknown` (optional)                                     | Continuation token from the previous page's `cursor`. `undefined` on the first page. |
| `signal`           | `AbortSignal`                                            | Aborts when the request is superseded or the table is destroyed.                     |

| `TableLoadResult<T>` | Type                 | Description                                                                                                         |
| -------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `rows`               | `readonly T[]`       | The rows for the requested page/window.                                                                             |
| `total`              | `number` (optional)  | Total item count. Required to drive the full paginator's page count; omit for infinite scroll / compact pagination. |
| `hasMore`            | `boolean`            | Explicit end-of-data flag, never inferred from a short page.                                                        |
| `cursor`             | `unknown` (optional) | Opaque continuation token for the next page. Compact/cursor mode only.                                              |

## Structure directives

These build the grid itself. `ngnTableTh` declares the column id that every
other feature is addressed by.

### JigTableHeadTr

Selector: `[ngnTableHeadTr]` — the header `<tr>`.

{{ api: table/table-header-row JigTableHeadTr }}

### JigTableTh

Selector: `[ngnTableTh]` — a header cell. The bound value is the column id.

{{ api: table/table-header-cell JigTableTh }}

### JigTableBodyTr

Selector: `[ngnTableBodyTr]` — a body `<tr>`; bind the row object from the
`#body` template.

{{ api: table/table-row JigTableBodyTr }}

### JigTableTd

Selector: `[ngnTableTd]` — a body cell. It has no inputs; it applies the cell
class, exposes the visual column index and mirrors sticky positioning.

### JigTableGroupHeaderTr

Selector: `[ngnTableGroupHeaderTr]` — the `<tr>` for a group header when
`groupBy` is set; bind the group-header row from the `#groupHeader` template.

{{ api: table/table-group-header-row JigTableGroupHeaderTr }}

## Column feature directives

Each goes on a header cell, except selection which is used on both header and
body cells.

### JigTableSortableColumn

Selector: `[ngnTableSortableColumn]`

{{ api: table/table-sortable-column JigTableSortableColumn }}

### JigTableFilterableColumn

Selector: `[ngnTableFilterableColumn]`

{{ api: table/table-filterable-column JigTableFilterableColumn }}

### JigTableSelectionColumn

Selector: `[ngnTableSelectionColumn]`

{{ api: table/table-selection-column JigTableSelectionColumn }}

### JigTableReorderableColumn

Selector: `[ngnTableReorderableColumn]`

{{ api: table/table-reorderable-column JigTableReorderableColumn }}

### JigTableStickyColumn

Selector: `[ngnTableStickyColumn]` — on a header cell; the body cells follow.

{{ api: table/table-sticky-column JigTableStickyColumn }}

## JigTableRowActions

Selector: `[ngnTableRowActions]` (apply to a body `<tr>`)

{{ api: table/table-row-actions JigTableRowActions }}

Keyboard: the grid is a single tab stop. ↑/↓/Home/End/PageUp/PageDown move the
current row, → enters the row's actions, ←/→ move between them (← off the first
returns to the row), Enter/Space trigger an action, and
Enter/ContextMenu/Shift+F10 open the menu. See the Accessibility tab for the
full key map.

## JigTableModule

An `NgModule` that imports and exports every table directive at once, for
convenience. All of them are standalone — importing the module is optional.
