import type { PaginationState } from '@awdlab/jig/paginator';
import type { AwdFilterConfig } from '@awdlab/jig/filter';

export type FormattedTableDataRow<T> = {
  kind: 'data' | 'header' | 'footer';
  id: T[keyof T] & (string | number);
  data: T;
  index: number;
};

export type TableSelectionMode = 'single' | 'multi';

export type FormattedTableGroupHeaderRow<V = unknown> = {
  kind: 'group-header';
  id: string;
  groupKey: V;
  groupValue: V;
  count: number;
  expanded: boolean;
  index: number;
};

export type FormattedTableRow<T, V = unknown> =
  | FormattedTableDataRow<T>
  | FormattedTableGroupHeaderRow<V>;

/**
 * The request passed to a {@link TableDataSource}. Carries the page/slice
 * coordinates (reused from the paginator), the active sort/filters, and an
 * abort signal for superseded requests.
 */
export type TableLoadRequest = {
  /** Page/slice coordinates. `pagination.slice` for offset backends, `pagination.page` for page-number backends. */
  pagination: PaginationState;
  /** Active sort descriptor, or `null` when unsorted. */
  sort: { column: string; direction: 'asc' | 'desc' } | null;
  /** Active per-column filter config, or `null` when unfiltered. */
  filters: Record<string, AwdFilterConfig> | null;
  /**
   * Continuation token from the previous page's {@link TableLoadResult.cursor},
   * when navigating forward in compact/cursor pagination. `undefined` on the first
   * page. Offset backends ignore this; cursor backends ignore `pagination.slice`.
   */
  cursor?: unknown;
  /** Aborts when the request is superseded (sort/filter/pageSize change) or the table is destroyed. */
  signal: AbortSignal;
};

/**
 * The result a {@link TableDataSource} resolves with.
 */
export type TableLoadResult<T> = {
  /** The rows for the requested page/window. */
  rows: readonly T[];
  /**
   * Total item count. Required for the full paginator (drives page count).
   * Omit for infinite scroll and compact/cursor pagination where total is unknown.
   */
  total?: number;
  /**
   * Explicit end-of-data flag. Never inferred from a short page — a page may be
   * short due to permissions filtering. Drives infinite-scroll stop and the
   * compact paginator's "next" button.
   */
  hasMore: boolean;
  /** Opaque continuation token for the next page. Compact/cursor mode only. */
  cursor?: unknown;
};

/**
 * A loader callback. Its presence on {@link AwdTable} switches the table into
 * lazy mode. Called with a {@link TableLoadRequest}, resolves a {@link TableLoadResult}.
 */
export type TableDataSource<T> = (req: TableLoadRequest) => Promise<TableLoadResult<T>>;
