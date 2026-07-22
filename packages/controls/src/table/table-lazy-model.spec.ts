import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { TableLazyModel } from './table-lazy-model';
import type { TableDataSource, TableLoadResult } from './types';

type Row = { id: number };

function pageState(current: number, size = 10) {
  return { page: { current, size }, slice: { skip: current * size, take: size } };
}

function makeModel(loader: TableDataSource<Row>) {
  return TestBed.runInInjectionContext(
    () =>
      new TableLazyModel<Row>({
        dataSource: signal(loader),
        sort: signal(null),
        filters: signal(null),
        mode: signal<'paginate' | 'infinite'>('paginate'),
      })
  );
}

describe('TableLazyModel — pagination', () => {
  it('loads a page and exposes rows + total', async () => {
    const loader = vi.fn(async () => ({ rows: [{ id: 1 }], total: 42, hasMore: true }));
    const model = makeModel(loader);
    await model.setPage(pageState(0));
    expect(model.loaded()).toEqual([{ id: 1 }]);
    expect(model.total()).toBe(42);
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it('serves a revisited page from cache without re-calling the loader', async () => {
    const loader = vi.fn(async req => ({
      rows: [{ id: req.pagination.page.current }],
      hasMore: true,
      total: 30,
    }));
    const model = makeModel(loader);
    await model.setPage(pageState(0));
    await model.setPage(pageState(1));
    await model.setPage(pageState(0)); // revisit
    expect(loader).toHaveBeenCalledTimes(2);
    expect(model.loaded()).toEqual([{ id: 0 }]);
  });

  it('reload() clears cache and refetches the current page', async () => {
    const loader = vi.fn(async () => ({ rows: [{ id: 1 }], hasMore: true, total: 30 }));
    const model = makeModel(loader);
    await model.setPage(pageState(0));
    await model.reload();
    expect(loader).toHaveBeenCalledTimes(2);
  });

  it('reload() in cursor mode retries the current page with its continuation cursor, not page 0', async () => {
    const cursors: unknown[] = [];
    let failPage1 = true;
    const loader = vi.fn(async req => {
      cursors.push(req.cursor);
      const page = req.pagination.page.current;
      if (page === 1 && failPage1) {
        failPage1 = false;
        throw new Error('boom');
      }
      return { rows: [{ id: page }], hasMore: true, total: 30, cursor: `c${page}` };
    });
    const model = makeModel(loader);
    await model.setPage(pageState(0)); // cursor undefined -> returns cursor 'c0'
    await model.setPage(pageState(1)); // cursor 'c0' reaches page 1, then rejects
    expect(model.status()).toBe('error');
    expect(cursors).toEqual([undefined, 'c0']);

    // Retry page 1 via reload: must resend the 'c0' token that reaches page 1,
    // NOT undefined (which would refetch page 0's window from scratch).
    await model.reload();
    expect(cursors).toEqual([undefined, 'c0', 'c0']);
    expect(model.loaded()).toEqual([{ id: 1 }]);
  });

  it('invalidate() while a request is in flight resets status instead of leaving it stuck loading', async () => {
    let resolveLoad!: (result: { rows: Row[]; hasMore: boolean; total: number }) => void;
    const loader = vi.fn(
      () =>
        new Promise<{ rows: Row[]; hasMore: boolean; total: number }>(resolve => {
          resolveLoad = resolve;
        })
    );
    const model = makeModel(loader);
    const pending = model.setPage(pageState(0));
    expect(model.status()).toBe('loading');

    model.invalidate();
    expect(model.status()).toBe('idle');
    expect(model.loaded()).toEqual([]);

    // Late resolution of the superseded request must not resurrect 'loading'/stale data.
    resolveLoad({ rows: [{ id: 1 }], hasMore: true, total: 30 });
    await pending;
    expect(model.status()).toBe('idle');
    expect(model.loaded()).toEqual([]);
  });
});

describe('TableLazyModel — supersede + error', () => {
  it('sets error status on rejection', async () => {
    const loader = vi.fn(async () => {
      throw new Error('boom');
    });
    const model = makeModel(loader);
    await model.setPage(pageState(0));
    expect(model.status()).toBe('error');
    expect((model.error() as Error).message).toBe('boom');
  });

  it('resolves to the newer page when two setPage calls race within the same epoch', async () => {
    let resolvePage0!: (r: TableLoadResult<Row>) => void;
    let resolvePage1!: (r: TableLoadResult<Row>) => void;
    let calls = 0;
    const loader = vi.fn(() => {
      calls++;
      return new Promise<TableLoadResult<Row>>(r => {
        if (calls === 1) resolvePage0 = r;
        else resolvePage1 = r;
      });
    });
    const model = makeModel(loader);

    // Same epoch (no invalidate) — only the abort-controller guard protects here.
    const p0 = model.setPage(pageState(0));
    const p1 = model.setPage(pageState(1));

    // Newer request (page 1) resolves first.
    resolvePage1({ rows: [{ id: 1 }], hasMore: true, total: 2 });
    await p1;
    expect(model.loaded()).toEqual([{ id: 1 }]);

    // Stale, superseded page-0 request resolves late — must not clobber page 1's result.
    resolvePage0({ rows: [{ id: 0 }], hasMore: true, total: 2 });
    await p0;
    expect(model.loaded()).toEqual([{ id: 1 }]);
    expect(model.total()).toBe(2);
  });
});

describe('TableLazyModel — infinite', () => {
  function makeInfinite(loader: TableDataSource<Row>) {
    return TestBed.runInInjectionContext(
      () =>
        new TableLazyModel<Row>({
          dataSource: signal(loader),
          sort: signal(null),
          filters: signal(null),
          mode: signal<'paginate' | 'infinite'>('infinite'),
        })
    );
  }

  it('appends successive windows and stops when hasMore is false', async () => {
    let call = 0;
    const loader = vi.fn(async () => {
      call++;
      return { rows: [{ id: call }], hasMore: call < 2 };
    });
    const model = makeInfinite(loader);
    await model.loadNext(10); // window 0
    await model.loadNext(10); // window 1 -> hasMore false
    await model.loadNext(10); // no-op, hasMore false
    expect(model.loaded()).toEqual([{ id: 1 }, { id: 2 }]);
    expect(loader).toHaveBeenCalledTimes(2);
  });

  it('does not fire a second load while one is in flight', async () => {
    let resolve!: (r: TableLoadResult<Row>) => void;
    const loader = vi.fn(() => new Promise<TableLoadResult<Row>>(r => (resolve = r)));
    const model = makeInfinite(loader);
    const p1 = model.loadNext(10);
    void model.loadNext(10); // should be ignored — still loading
    resolve({ rows: [{ id: 1 }], hasMore: true });
    await p1;
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it('does not skip a window when invalidate() races an in-flight loadNext', async () => {
    const skips: number[] = [];
    let resolveStale!: (r: TableLoadResult<Row>) => void;
    let resolveNext!: (r: TableLoadResult<Row>) => void;
    let calls = 0;
    const loader = vi.fn(req => {
      skips.push(req.pagination.slice.skip);
      calls++;
      return new Promise<TableLoadResult<Row>>(r => {
        if (calls === 1) resolveStale = r;
        else resolveNext = r;
      });
    });
    const model = makeInfinite(loader);

    const stale = model.loadNext(10); // window 0, skip 0 — left pending
    model.invalidate(); // epoch bump mid-flight; superseded load must not advance the window
    resolveStale({ rows: [{ id: 1 }], hasMore: true }); // resolves late, into the old epoch
    await stale;

    // Next real load after the invalidate must re-request window 0, not window 1.
    const next = model.loadNext(10);
    resolveNext({ rows: [{ id: 2 }], hasMore: true });
    await next;

    expect(skips).toEqual([0, 0]);
  });

  it('retry() re-requests the failed window, keeps prior rows, and advances only on success', async () => {
    const skips: number[] = [];
    let failWindow1 = true;
    const loader = vi.fn(async req => {
      skips.push(req.pagination.slice.skip);
      const window = req.pagination.page.current;
      if (window === 1 && failWindow1) {
        failWindow1 = false;
        throw new Error('boom');
      }
      return { rows: [{ id: window }], hasMore: true };
    });
    const model = makeInfinite(loader);

    await model.loadNext(10); // window 0, skip 0
    await model.loadNext(10); // window 1, skip 10 -> rejects
    expect(model.status()).toBe('error');
    expect(model.loaded()).toEqual([{ id: 0 }]); // prior rows preserved

    await model.retry(); // retries window 1 (skip 10), appends
    expect(model.status()).toBe('idle');
    expect(model.loaded()).toEqual([{ id: 0 }, { id: 1 }]);

    await model.loadNext(10); // must be window 2 (skip 20), not a duplicate of window 1
    expect(skips).toEqual([0, 10, 10, 20]);
  });
});

describe('TableLazyModel — cache-hit supersession + retry (paginate)', () => {
  it('serving a cached page aborts an in-flight uncached load so it cannot clobber it', async () => {
    let resolvePage1!: (r: TableLoadResult<Row>) => void;
    const loader = vi.fn((req: { pagination: { page: { current: number } } }) => {
      if (req.pagination.page.current === 0) {
        return Promise.resolve({ rows: [{ id: 0 }], hasMore: true, total: 30 });
      }
      return new Promise<TableLoadResult<Row>>(r => (resolvePage1 = r));
    });
    const model = makeModel(loader as unknown as TableDataSource<Row>);

    await model.setPage(pageState(0)); // caches page 0
    const p1 = model.setPage(pageState(1)); // page 1 in flight
    await model.setPage(pageState(0)); // cache hit -> shows page 0, must abort page 1
    expect(model.loaded()).toEqual([{ id: 0 }]);
    expect(model.status()).toBe('idle');

    // The superseded page-1 request resolves late and must NOT overwrite page 0.
    resolvePage1({ rows: [{ id: 1 }], hasMore: true, total: 30 });
    await p1;
    expect(model.loaded()).toEqual([{ id: 0 }]);
    expect(model.status()).toBe('idle');
  });

  it('retry() re-runs a rejected page load in replace mode', async () => {
    let fail = true;
    const loader = vi.fn(async () => {
      if (fail) {
        fail = false;
        throw new Error('boom');
      }
      return { rows: [{ id: 7 }], hasMore: true, total: 30 };
    });
    const model = makeModel(loader);

    await model.setPage(pageState(2));
    expect(model.status()).toBe('error');

    await model.retry();
    expect(model.status()).toBe('idle');
    expect(model.loaded()).toEqual([{ id: 7 }]);
    expect(loader).toHaveBeenCalledTimes(2);
  });
});
