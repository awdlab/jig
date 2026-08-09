import { signal, type Signal } from '@angular/core';

import type { PaginationState } from '@awdlab/jig/paginator';
import type { JigFilterConfig } from '@awdlab/jig/filter';
import type { TableDataSource, TableLoadResult } from './types';

export type TableLazyMode = 'paginate' | 'infinite';

export type TableLazyDeps<T> = {
  dataSource: Signal<TableDataSource<T> | null>;
  sort: Signal<{ column: string; direction: 'asc' | 'desc' } | null>;
  filters: Signal<Record<string, JigFilterConfig> | null>;
  mode: Signal<TableLazyMode>;
};

/**
 * Owns lazy-loading state for {@link JigTable}: the loaded row window,
 * request status, per-page cache, and an epoch that invalidates on
 * sort/filter/pageSize/dataSource change. Plain signal class (no DI), mirroring
 * `TableSelectionModel`.
 */
export class TableLazyModel<T> {
  public readonly loaded = signal<readonly T[]>([]);
  public readonly status = signal<'idle' | 'loading' | 'error'>('idle');
  public readonly error = signal<unknown>(null);
  public readonly total = signal<number | undefined>(undefined);
  public readonly hasMore = signal(true);

  /** page index -> result, valid within the current epoch. */
  private readonly _cache = new Map<number, TableLoadResult<T>>();
  private _epoch = 0;
  private _controller: AbortController | null = null;
  private _lastState: PaginationState | null = null;
  private _nextWindow = 0;
  /** The most recent load attempt, replayed by {@link retry}. */
  private _lastLoad: {
    state: PaginationState;
    apply: 'replace' | 'append';
    cursor: unknown;
  } | null = null;

  constructor(private readonly _deps: TableLazyDeps<T>) {}

  /** Load (or serve from cache) the page described by `state`. */
  public async setPage(state: PaginationState): Promise<void> {
    this._lastState = state;
    const cached = this._cache.get(state.page.current);
    if (cached) {
      // Supersede any in-flight load so it can't resolve over the cached page.
      this._controller?.abort();
      this._controller = null;
      this.loaded.set(cached.rows);
      this.total.set(cached.total);
      this.hasMore.set(cached.hasMore);
      this.status.set('idle');
      this.error.set(null);
      return;
    }
    await this._load(state, 'replace');
  }

  /**
   * Invalidate everything and refetch the current page/window from scratch.
   * No-op if {@link setPage} has never been called (nothing to refetch yet).
   */
  public async reload(): Promise<void> {
    const state = this._lastState;
    // Capture the cursor before _bumpEpoch clears the cache it's read from.
    const cursor = state ? this.cursorFor(state.page.current) : undefined;
    this._bumpEpoch();
    if (state) await this._load(state, 'replace', cursor);
  }

  /** Called by the component when sort/filter/pageSize/dataSource change. */
  public invalidate(): void {
    this._bumpEpoch();
  }

  /**
   * Infinite scroll: load and append the next window of `pageSize` rows.
   * No-op while a load is in flight or when `hasMore` is false.
   */
  public async loadNext(pageSize: number): Promise<void> {
    if (this.status() === 'loading' || !this.hasMore()) return;
    const current = this._nextWindow;
    const state: PaginationState = {
      page: { current, size: pageSize },
      slice: { skip: current * pageSize, take: pageSize },
    };
    await this._load(state, 'append');
  }

  /** Re-issue the last load attempt after a rejection; keeps loaded rows in infinite scroll. */
  public async retry(): Promise<void> {
    const last = this._lastLoad;
    if (last) await this._load(last.state, last.apply, last.cursor);
  }

  protected cursorFor(pageIndex: number): unknown {
    return this._cache.get(pageIndex - 1)?.cursor;
  }

  private _bumpEpoch(): void {
    this._epoch++;
    this._cache.clear();
    this._controller?.abort();
    this._controller = null;
    this.loaded.set([]);
    this.total.set(undefined);
    this.hasMore.set(true);
    this.status.set('idle');
    this.error.set(null);
    this._nextWindow = 0;
    this._lastLoad = null;
  }

  protected async _load(
    state: PaginationState,
    apply: 'replace' | 'append',
    cursorOverride?: unknown
  ): Promise<void> {
    const loader = this._deps.dataSource();
    if (!loader) return;
    const cursor = cursorOverride ?? this.cursorFor(state.page.current);
    this._lastLoad = { state, apply, cursor };
    const epoch = this._epoch;
    this._controller?.abort();
    const controller = new AbortController();
    this._controller = controller;
    this.status.set('loading');
    this.error.set(null);
    try {
      const result = await loader({
        pagination: state,
        sort: this._deps.sort(),
        filters: this._deps.filters(),
        cursor,
        signal: controller.signal,
      });
      if (epoch !== this._epoch || controller !== this._controller) return; // superseded
      this._cache.set(state.page.current, result);
      this.total.set(result.total);
      this.hasMore.set(result.hasMore);
      this.loaded.set(apply === 'append' ? [...this.loaded(), ...result.rows] : result.rows);
      // Advance only on success, so a failed append retries the same window.
      if (apply === 'append') this._nextWindow = state.page.current + 1;
      this.status.set('idle');
    } catch (err) {
      if (epoch !== this._epoch || controller !== this._controller || controller.signal.aborted)
        return;
      this.error.set(err);
      this.status.set('error');
    }
  }
}
