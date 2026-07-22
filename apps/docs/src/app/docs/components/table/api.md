# API

## NgnTable

Selector: `ngn-table`

### Lazy Loading

Setting `dataSource` switches the table into lazy (server-driven) mode: `rows`
is ignored, and sort/filter are delegated to the loader instead of applied
client-side. `dataSource` is incompatible with `groupBy` — setting both throws
an `NgnError` (grouping needs the full row set, which lazy mode never has).

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
| `filters`          | `Record<string, NgnFilterConfig> \| null`                | Active per-column filter config, or `null` when unfiltered.                          |
| `cursor`           | `unknown` (optional)                                     | Continuation token from the previous page's `cursor`. `undefined` on the first page. |
| `signal`           | `AbortSignal`                                            | Aborts when the request is superseded or the table is destroyed.                     |

| `TableLoadResult<T>` | Type                 | Description                                                                                                         |
| -------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `rows`               | `readonly T[]`       | The rows for the requested page/window.                                                                             |
| `total`              | `number` (optional)  | Total item count. Required to drive the full paginator's page count; omit for infinite scroll / compact pagination. |
| `hasMore`            | `boolean`            | Explicit end-of-data flag, never inferred from a short page.                                                        |
| `cursor`             | `unknown` (optional) | Opaque continuation token for the next page. Compact/cursor mode only.                                              |

## NgnTableRowActions

Selector: `[ngnTableRowActions]` (apply to a body `<tr>`)

| Input                       | Type              | Default | Description                                                 |
| --------------------------- | ----------------- | ------- | ----------------------------------------------------------- |
| `ngnTableRowActions`        | `NgnActionItem[]` | —       | Actions for this row.                                       |
| `ngnTableRowActionsContext` | `boolean`         | `true`  | Right-click opens a context menu of the actions.            |
| `ngnTableRowActionsInline`  | `boolean`         | `true`  | Renders an inline hover button-bar at the row's right edge. |

Keyboard: the table body is a single tab stop. ↑/↓ move the active row, → enters
the row's actions, ←/→ move between them (← off the first returns to the row),
Enter/Space trigger an action, and Enter/ContextMenu/Shift+F10 open the menu.
