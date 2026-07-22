# NgnTable lazy loading — design

**Date:** 2026-07-22
**Status:** Approved (v1 scope). Lazy grouping deferred to v2.

## Problem

`NgnTable` is fully client-side: `rows` is a required input holding the entire
dataset, and sort / filter / group / paginate all run in-memory
(`filterRows`, `sortRows`, `groupRows`, `paginateRows`). This does not scale to
datasets that live on a server and must be fetched on demand.

Add **lazy loading** in two modes:

- **Lazy pagination** — fetch one page at a time; paginator drives page/size.
- **Infinite scroll** — fetch and append windows as the user scrolls to the end.

## Non-goals (v1)

- **Lazy grouping** — deferred to v2 (see below). v1 throws if `groupBy` and
  `dataSource` are set together.
- **Observable data sources** — Promise only. Add if a real case appears.

---

## API surface

### `NgnTable` — new / changed inputs

| Member              | Type                                      | Notes                                                                                                                      |
| ------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `dataSource`        | `input<TableDataSource<T> \| null>(null)` | The loader callback. **Presence switches the table into lazy mode.**                                                       |
| `rows`              | `input<readonly T[]>([])`                 | **Relaxed from `input.required`.** Ignored when `dataSource` is set. Type-only change; existing consumers keep passing it. |
| `reload()`          | public method                             | Force cache-invalidate + refetch the current view. For use after the consumer mutates data.                                |
| `selectAllMatching` | `model<boolean>(false)`                   | **Infinite-scroll only.** Set by the header select-all checkbox; consumer interprets it for server-side bulk actions.      |

**Mode resolution:**

- `dataSource` set + `paginator === true` → **lazy pagination**.
- `dataSource` set + `paginator === false` (default) → **infinite scroll**.
- No `dataSource` → today's client-side behavior, unchanged.
- `virtual` stays manual and orthogonal — the consumer opts into virtualization
  in either mode. Infinite scroll without `virtual` grows the DOM unbounded (the
  consumer's choice).

### Loader contract

Types live in the table's `api/` type module; a request-builder helper is
colocated in the control folder (per `feedback_helpers_colocated_with_control`).

The request **reuses `PaginationState`** (from the paginator) as a nested
`pagination` property, rather than extending it — `PaginationState` already
exposes both page-based (`page.{size, current}`) and slice-based
(`slice.{skip, take}`) coordinates, so the loader picks whichever its backend
wants. For infinite scroll the same shape applies — the next window is just
`page.current + 1` / `slice.skip += take`. All shapes are `type` aliases, matching
the repo convention (`PaginationState` itself is a `type`).

```ts
type TableLoadRequest = {
  /** Page/slice coordinates, reused from the paginator. */
  pagination: PaginationState;
  sort: { column: string; direction: 'asc' | 'desc' } | null;
  filters: Record<string, NgnFilterConfig> | null;
  /**
   * Continuation token from the previous page's result, when navigating forward
   * in compact/cursor pagination. Undefined on the first page. Offset-based
   * backends ignore this and use `pagination.slice`; cursor-based backends ignore it.
   */
  cursor?: unknown;
  /** Aborts when the request is superseded (epoch change) or the table is destroyed. */
  signal: AbortSignal;
};

type TableLoadResult<T> = {
  rows: readonly T[];
  /**
   * Total item count. Required for the full paginator (drives page count).
   * Omit for infinite scroll and for compact/cursor pagination where the total
   * is unknown.
   */
  total?: number;
  /**
   * Explicit end-of-data flag. NEVER inferred from a short/empty page — a page
   * may be short due to permissions filtering, not because data is exhausted.
   * Drives infinite-scroll stop and the compact paginator's "next" button.
   */
  hasMore: boolean;
  /** Opaque continuation token for requesting the next page. Compact/cursor mode. */
  cursor?: unknown;
};

type TableDataSource<T> = (req: TableLoadRequest) => Promise<TableLoadResult<T>>;
```

---

## Engine — `TableLazyModel<T>`

A plain class holding signals, injected with the inputs it needs — matches the
existing `TableSelectionModel` / `TableColumnLayoutModel` pattern. Instantiated
in `NgnTable`'s field initializers.

**State:**

- `loaded` — accumulated rows (infinite) or the current page's rows (pagination).
- `status` — `'idle' | 'loading' | 'error'`.
- `error` — last rejection, for the error row.
- `total` — from the last result; feeds paginator `totalItems`.
- `hasMore` — from the last result; gates further infinite loads.
- `cache: Map<number, TableLoadResult<T>>` — keyed by page index within the
  current epoch.
- `epoch` — counter; bumping it clears the cache, aborts the in-flight request,
  and resets to page 0 / first window.

**Behavior:**

- **epoch bumps** on change of: `sort`, `filters`, `pageSize`, or `dataSource`
  identity. (Not on `page` — that's normal navigation.)
- **Pagination:** page change → serve from `cache` if present, else load and
  **replace** `loaded`. `total` (when present) populates the full paginator.
- **Compact / cursor pagination:** when a result omits `total`, the table drives
  the paginator in compact mode (prev/next only). Forward requests carry
  `cursor = cache[currentPage].cursor` (the previous page's token); the per-page
  `cache` doubles as the cursor history, so prev navigates back to a cached page
  without a token. `hasMore` from the last result gates the "next" button.
- **Infinite:** an effect watches `distanceFromEnd` (from the scroll hook, below):
  `if distanceFromEnd() < endThreshold && hasMore() && status() !== 'loading'`
  → load next window index, **append** to `loaded`. Self-correcting — after an
  append `scrollHeight` grows, `distanceFromEnd` recomputes, and the effect
  re-fires until the viewport is filled or `hasMore === false`.
- **`reload()`** — bump epoch, clear cache, refetch current view.
- **Abort:** one `AbortController` per request; superseded requests abort on the
  next epoch bump and on component destroy.

**Client-side transforms are gated off in lazy mode.** `_filteredRows` /
`_sortedRows` return the loaded rows as-is when `dataSource` is set; sort and
filter descriptors ride the `TableLoadRequest` instead. `_baseRows` becomes
`computed(() => dataSource() ? lazy.loaded() : rows())` and the existing
computeds read from it.

---

## Compact paginator mode — `NgnPaginator`

For datasets where the total count is unknown or expensive (e.g. continuation-
token backends), add a mode that renders **only prev/next buttons, no page
indicators** — and needs no `totalItems`.

**Changes to `NgnPaginator`:**

| Member       | Type                                             | Notes                                                                                                        |
| ------------ | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `mode`       | `input<'pages' \| 'compact'>('pages')`           | `'compact'` hides page numbers + page count, shows prev/next only. Name open to bikeshedding.                |
| `totalItems` | relaxed `input<number>()` (was `input.required`) | Required only in `'pages'` mode — an effect throws if missing there. Ignored in `'compact'`.                 |
| `hasNext`    | `input<boolean>(true)`                           | Compact mode only: disables "next" when `false`. In `'pages'` mode "next" is still derived from `pageCount`. |

`previousPage`/`nextPage` already operate on the bare `page` index, so compact
mode reuses them unchanged: "prev" disabled at page 0, "next" disabled when
`hasNext() === false`. The `value` output still emits `PaginationState` (page +
slice) every change. `pageCount`/`pages` computeds are simply not rendered in
compact mode. Works identically for lazy (bind `hasNext` to the lazy model's
`hasMore`) and non-lazy compact paginators.

**Table wiring:** in lazy pagination, when a result omits `total` the table puts
the paginator in `compact` mode and binds `hasNext` to `hasMore`; when `total`
is present it stays in `pages` mode.

---

## Generic scroll-end hook — `NgnScrollAmount`

The near-end signal is added to the existing generic scroll directive, not to
the table — so any scroll container (chat lists, dropdowns, other lists) gets it.

**Added to `NgnScrollAmount`:**

```ts
// geometry signals — updated on scroll + on resize (reuse elementSizeSignal)
scrollHeight = signal(...)
clientHeight = signal(...)
scrollWidth  = signal(...)   // horizontal parity
clientWidth  = signal(...)

// the reusable primitive
distanceFromEnd   = computed(() => scrollHeight() - clientHeight() - scrollTop())
distanceFromRight = computed(() => scrollWidth() - clientWidth() - scrollLeft())

// convenience sugar on top of the primitive
endThreshold = input(0, { alias: 'ngnScrollAmountEndThreshold' }) // px
endReached   = output<void>()  // edge-triggered when crossing into the threshold zone
```

- **`distanceFromEnd` (signal)** is the real primitive. The table's infinite
  effect reads it directly and applies its own `hasMore`/loading guard — robust
  against the tall-viewport gotcha because the signal recomputes as content
  grows.
- **`endReached` (output)** is edge-triggered sugar for consumers _without_ their
  own guard (simple "load more" lists). The table does **not** use it.
- Vertical is what infinite scroll needs; horizontal `distanceFromRight` is added
  for symmetry (free read), but no horizontal `endReached` (YAGNI).
- Geometry updates reuse the existing `elementSizeSignal` pattern (already used by
  the scroller for viewport size) plus the existing scroll subscription. No new
  ResizeObserver plumbing.

---

## States (templatable, with defaults)

- **Skeleton rows** while loading, sized by `rowHeight`: `pageSize` rows for
  pagination, a tail chunk for infinite scroll. Default is a shimmer row; override
  via a `loadingTemplate` content projection input.
- **Error row + Retry** spanning all columns on rejection; Retry calls `reload()`.
  Override via an `errorTemplate` content projection input.
- Template inputs follow the `DialogTemplates` projection pattern; per CLAUDE.md,
  a `NgnTableTemplates` base already exists — extend it with these.

## Selection

- **Pagination:** header select-all toggles the current page, unchanged from today.
- **Infinite:** per-row selection is id-based and survives windows leaving/
  re-entering the DOM. Header select-all sets `selectAllMatching` (+ output) rather
  than pretending to select an unbounded set.

## Grouping (v2 — spec only, not built in v1)

Lazy grouping differs from client grouping: **group headers are present from the
start; child rows lazy-load on expand.** Planned shape: a `groups` input
(`{ key, label, count? }[]`); expanding a group calls the same `dataSource` with a
reserved `groupKey` in the request; children cache per group; `count` drives the
header and skeleton sizing. **v1 throws** (`NgnError`) if `groupBy` and
`dataSource` are set together, so the unsupported combination fails loud.

---

## Full-anatomy checklist (per CLAUDE.md)

- **Control source** — `dataSource`/`reload`/`selectAllMatching`, `TableLazyModel`,
  gated client-transform computeds, skeleton/error template wiring, `groupBy`+lazy
  guard.
- **`api/` types** — `TableLoadRequest` (nests `PaginationState`),
  `TableLoadResult` (+ `cursor`), `TableDataSource`. All `type` aliases.
- **`NgnPaginator`** — `mode: 'pages' | 'compact'`, relaxed `totalItems`,
  `hasNext`; template hides page indicators in compact mode; base + nova theme
  handle the compact layout.
- **`NgnScrollAmount`** — geometry signals, `distanceFromEnd`/`distanceFromRight`,
  `endThreshold`/`endReached`.
- **Theme** — templates + base + nova: skeleton row/cell, error row, loading
  indicator parts.
- **Tests** — loader called with correct request on init / page / sort / filter;
  pagination serves cache on revisit; `reload()` refetches; infinite appends and
  stops on `hasMore === false`; no re-fire while loading; abort supersedes stale;
  error → Retry re-issues; `groupBy` + `dataSource` throws; compact/cursor mode
  passes the previous page's `cursor` forward and disables "next" on
  `hasMore === false`; `NgnPaginator` compact mode renders prev/next only and
  throws in `pages` mode without `totalItems`; `NgnScrollAmount.distanceFromEnd`
  / `endReached` unit tests.
- **Docs** — `api.md` new members, playground.
- **Demos** — `lazy-pagination`, `lazy-infinite-scroll`, and a
  `compact-cursor-pagination` scenario, backed by a fake async data service. The
  paginator docs also gain a standalone compact-mode demo.

## Open implementation note

Confirm during implementation that `elementSizeSignal` observes the correct
element for `scrollHeight` (content) vs `clientHeight` (viewport) when an external
`container` is set. The scroll target is `container ?? host`; geometry must be read
off the same element.
