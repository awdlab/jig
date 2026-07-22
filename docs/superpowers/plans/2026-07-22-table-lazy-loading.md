# Table Lazy Loading Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add server-driven lazy loading to `NgnTable` in two modes — lazy pagination (incl. a total-less compact/cursor variant) and infinite scroll — via a loader callback, with skeleton/error states and a reusable scroll-end primitive on `NgnScrollAmount`.

**Architecture:** A `dataSource` loader callback puts the table in lazy mode; a new `TableLazyModel<T>` (plain signal class, mirroring `TableSelectionModel`) owns loading/cache/epoch/abort state and drives an internal `loaded` signal that replaces the client `rows` array. Client-side sort/filter/paginate are gated off in lazy mode; descriptors ride the loader request instead. Infinite scroll is driven by a generic `distanceFromEnd` signal added to `NgnScrollAmount`. A `compact` paginator mode renders prev/next only for total-less/cursor backends.

**Tech Stack:** Angular 21 signals (`input`/`model`/`output`/`computed`/`effect`), strict TS, Vitest (unit `.spec.ts`), Playwright (e2e `tests/components/*.test.ts`), theme system (`createControlTemplate`/`createThemePart`), Tailwind in templates.

## Global Constraints

- Angular signals API only — `input()`/`model()`/`computed()`/`signal()`/`output()`; never `@Input`/`@Output` decorators.
- Boolean inputs use `input(false, { transform: booleanAttribute })`.
- Selector prefix `ngn`; folder name === selector (kebab-case).
- No component-level CSS — all styling via the theme system (`injectThemeTemplate` + theme parts).
- Every `input`/`model`/`output` gets a 1–2 sentence TSDoc; `@default <value>` unquoted for non-obvious defaults; `{@link other}` cross-refs.
- All new shared shapes are `type` aliases (not `interface`) — repo convention.
- Icon inputs use `icon` prefix; directive input aliases must equal selector or selector+PascalCase(propertyName).
- 2-space indent, single quotes. Run `pnpm format` over changed files after each task (oxfmt for `.ts`/`.json`/`.md`, Prettier for `.html`).
- New theme parts need empty `package.json` markers and a `pnpm --filter @ngneers/controls-themes build` before e2e (Node resolves themes from `dist`).
- Control anatomy: every change spans source, theme template, base theme, nova theme, tests, docs, demos — touch all affected parts.

---

## File map

**New files**

- `packages/controls/src/table/table-lazy-model.ts` — `TableLazyModel<T>` engine.
- `packages/controls/src/table/table-lazy-model.spec.ts` — engine unit tests.
- `packages/controls/src/directives/scroll-amount.spec.ts` — geometry/end-detection unit tests.
- `apps/docs/src/app/demos/table/lazy-pagination.ts` — demo.
- `apps/docs/src/app/demos/table/lazy-infinite-scroll.ts` — demo.
- `apps/docs/src/app/demos/table/compact-cursor-pagination.ts` — demo.
- `apps/docs/src/app/demos/table/fake-data-service.ts` — shared fake async backend for demos.

**Modified files**

- `packages/controls/src/table/types.ts` — add `TableLoadRequest`/`TableLoadResult`/`TableDataSource`.
- `packages/controls/src/table/index.ts` — export new types.
- `packages/controls/src/table/table.ts` — `dataSource`, relax `rows`, `reload()`, `selectAllMatching`, lazy wiring, gated computeds, `groupBy`+lazy guard, infinite effect.
- `packages/controls/src/table/table.html` — skeleton rows, error row, lazy paginator binding.
- `packages/controls/src/table/table-templates.ts` — `loadingTemplate`/`errorTemplate` content children + template types.
- `packages/controls/src/directives/scroll-amount.ts` — geometry signals, `distanceFromEnd`/`distanceFromRight`, `endThreshold`, `endReached`.
- `packages/controls/src/scroller/scroller.ts` — re-expose `distanceFromEnd` from host `NgnScrollAmount`.
- `packages/controls/src/paginator/paginator.ts` — `mode`, relaxed `totalItems`, `hasNext`.
- `packages/controls/src/paginator/paginator.html` — hide page indicators + disable next in compact mode.
- `packages/themes/src/templates/table/index.ts` — add `skeleton-row`/`skeleton-cell`/`error-row`/`loading` class names.
- `packages/themes/src/base/table/index.ts` — structural styling for new parts.
- `packages/themes/src/nova/table/index.ts` — themed styling (shimmer, error) for new parts.
- `packages/themes/src/templates/paginator/index.ts` — `compact` class name (if needed for layout hook).
- `packages/themes/src/base/paginator/index.ts` + `packages/themes/src/nova/paginator/index.ts` — compact layout.
- `tests/components/table.test.ts` — lazy e2e scenarios.
- `tests/components/paginator.test.ts` — compact-mode e2e.
- `apps/docs/src/app/docs/components/table/api.md` + `playground.ts` — document new inputs.
- `apps/docs/src/app/docs/components/paginator/api.md` — document compact mode.

---

## Task 1: Loader types

**Files:**

- Modify: `packages/controls/src/table/types.ts`
- Modify: `packages/controls/src/table/index.ts`

**Interfaces:**

- Consumes: `PaginationState` from `@ngneers/controls/paginator`, `NgnFilterConfig` from `@ngneers/controls/filter`, `AllKeysOfUnion` from `@ngneers/controls/utils`.
- Produces: `TableLoadRequest`, `TableLoadResult<T>`, `TableDataSource<T>` — used by `TableLazyModel` (Task 6) and `NgnTable` (Task 9).

- [ ] **Step 1: Add the types**

Append to `packages/controls/src/table/types.ts`:

```ts
import type { PaginationState } from '@ngneers/controls/paginator';
import type { NgnFilterConfig } from '@ngneers/controls/filter';
import type { AllKeysOfUnion } from '@ngneers/controls/utils';

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
  filters: Record<string, NgnFilterConfig> | null;
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
 * A loader callback. Its presence on {@link NgnTable} switches the table into
 * lazy mode. Called with a {@link TableLoadRequest}, resolves a {@link TableLoadResult}.
 */
export type TableDataSource<T> = (req: TableLoadRequest) => Promise<TableLoadResult<T>>;
```

> Note: `AllKeysOfUnion` is imported for future strictness but `sort.column` stays `string` to match the existing `NgnTable.sort` model shape. If oxlint flags the unused import, drop it.

- [ ] **Step 2: Export from barrel**

In `packages/controls/src/table/index.ts`, ensure `export * from './types';` is present (add if missing).

- [ ] **Step 3: Typecheck**

Run: `pnpm --filter @ngneers/controls exec tsc --noEmit -p tsconfig.lib.json`
Expected: no new errors.

- [ ] **Step 4: Format + commit**

```bash
pnpm format packages/controls/src/table/types.ts packages/controls/src/table/index.ts
git add packages/controls/src/table/types.ts packages/controls/src/table/index.ts
git commit -m "feat(table): add lazy data-source types"
```

---

## Task 2: `NgnScrollAmount` geometry signals + `distanceFromEnd`

**Files:**

- Modify: `packages/controls/src/directives/scroll-amount.ts`
- Test: `packages/controls/src/directives/scroll-amount.spec.ts` (create)

**Interfaces:**

- Consumes: existing `scrollTarget`/`scrollTop`/`scrollLeft` signals, `elementSizeSignal` from `@ngneers/controls/api/ng`.
- Produces: `scrollHeight`, `clientHeight`, `scrollWidth`, `clientWidth` signals; `distanceFromEnd`, `distanceFromRight` computeds — consumed by scroller (Task 10) and by the end-detection sugar (Task 3).

- [ ] **Step 1: Write the failing test**

Create `packages/controls/src/directives/scroll-amount.spec.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { computeDistanceFromEnd } from './scroll-amount';

describe('computeDistanceFromEnd', () => {
  it('returns full remaining distance at the top', () => {
    // content 1000, viewport 300, scrolled 0 => 700 remaining
    expect(computeDistanceFromEnd(1000, 300, 0)).toBe(700);
  });

  it('returns 0 at the bottom', () => {
    expect(computeDistanceFromEnd(1000, 300, 700)).toBe(0);
  });

  it('never returns negative (overscroll clamps to 0)', () => {
    expect(computeDistanceFromEnd(1000, 300, 800)).toBe(0);
  });

  it('returns 0 when content fits the viewport', () => {
    expect(computeDistanceFromEnd(300, 300, 0)).toBe(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @ngneers/controls exec vitest run src/directives/scroll-amount.spec.ts`
Expected: FAIL — `computeDistanceFromEnd` is not exported.

- [ ] **Step 3: Implement geometry + pure helper**

Edit `packages/controls/src/directives/scroll-amount.ts`. Add the pure helper (exported for testing) and the geometry signals:

```ts
// add near the top, after imports
/** Remaining scrollable distance to the end, clamped at 0. Pure for testing. */
export function computeDistanceFromEnd(
  scrollSize: number,
  clientSize: number,
  scrollPos: number
): number {
  return Math.max(0, scrollSize - clientSize - scrollPos);
}
```

Add these members to the `NgnScrollAmount` class (after `scrollLeft`):

```ts
private readonly _size = elementSizeSignal(this.scrollTarget);

public readonly scrollHeight = signal(this._el.nativeElement.scrollHeight);
public readonly clientHeight = signal(this._el.nativeElement.clientHeight);
public readonly scrollWidth = signal(this._el.nativeElement.scrollWidth);
public readonly clientWidth = signal(this._el.nativeElement.clientWidth);

/** Remaining vertical scroll distance to the bottom (px), clamped at 0. */
public readonly distanceFromEnd = computed(() =>
  computeDistanceFromEnd(this.scrollHeight(), this.clientHeight(), this.scrollTop())
);
/** Remaining horizontal scroll distance to the right edge (px), clamped at 0. */
public readonly distanceFromRight = computed(() =>
  computeDistanceFromEnd(this.scrollWidth(), this.clientWidth(), this.scrollLeft())
);
```

Add `elementSizeSignal` to the existing `@ngneers/controls/api/ng` import. Then update the constructor to refresh geometry both on scroll and on size change. Inside the existing `afterRenderEffect`, after the `obs.subscribe(...)` block, add a size sync:

```ts
// keep geometry in sync with layout changes (content grows, viewport resizes)
afterRenderEffect(() => {
  this._size(); // dependency: re-read element geometry when size changes
  const el = this.scrollTarget();
  const target = el instanceof Document ? el.documentElement : el;
  this.scrollHeight.set(target.scrollHeight);
  this.clientHeight.set(target.clientHeight);
  this.scrollWidth.set(target.scrollWidth);
  this.clientWidth.set(target.clientWidth);
});
```

And in the scroll subscription callback (where `scrollTop`/`scrollLeft` are set), also refresh sizes so `distanceFromEnd` reflects content that changed between resize ticks:

```ts
obs.subscribe(scroll => {
  this.scrollTop.set(scroll.top);
  this.scrollLeft.set(scroll.left);
  const target = scroll.el;
  this.scrollHeight.set(target.scrollHeight);
  this.clientHeight.set(target.clientHeight);
});
```

Adjust the `map` in the observable to also pass the element:

```ts
map(e => {
  const target = e.target as HTMLElement;
  return { top: target.scrollTop, left: target.scrollLeft, el: target };
});
```

> `scrollTarget` can be an `HTMLElement` or `Document`; the size-sync branch above normalizes `Document` → `documentElement`. Confirm the scroller's external-container case (Task 10 verification) reads content height off the same element.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @ngneers/controls exec vitest run src/directives/scroll-amount.spec.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Format + commit**

```bash
pnpm format packages/controls/src/directives/scroll-amount.ts packages/controls/src/directives/scroll-amount.spec.ts
git add packages/controls/src/directives/scroll-amount.ts packages/controls/src/directives/scroll-amount.spec.ts
git commit -m "feat(scroll-amount): add geometry signals and distanceFromEnd"
```

---

## Task 3: `NgnScrollAmount` `endThreshold` + `endReached` output

**Files:**

- Modify: `packages/controls/src/directives/scroll-amount.ts`
- Test: `packages/controls/src/directives/scroll-amount.spec.ts` (extend)

**Interfaces:**

- Consumes: `distanceFromEnd` (Task 2), `endThreshold` input.
- Produces: `endThreshold` input (alias `ngnScrollAmountEndThreshold`), `endReached` output — edge-triggered convenience for simple "load more" consumers (the table does NOT use this).

- [ ] **Step 1: Write the failing test**

Add to `packages/controls/src/directives/scroll-amount.spec.ts`:

```ts
import { isWithinEndZone } from './scroll-amount';

describe('isWithinEndZone', () => {
  it('is true when distance is at or below the threshold', () => {
    expect(isWithinEndZone(50, 100)).toBe(true);
    expect(isWithinEndZone(100, 100)).toBe(true);
  });
  it('is false when distance exceeds the threshold', () => {
    expect(isWithinEndZone(150, 100)).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @ngneers/controls exec vitest run src/directives/scroll-amount.spec.ts`
Expected: FAIL — `isWithinEndZone` not exported.

- [ ] **Step 3: Implement threshold input + edge-triggered output**

Add the pure helper to `scroll-amount.ts`:

```ts
/** Whether the current end-distance is within the trigger threshold. Pure for testing. */
export function isWithinEndZone(distanceFromEnd: number, threshold: number): boolean {
  return distanceFromEnd <= threshold;
}
```

Add `input`/`output` imports (input already imported; add `output`). Add members:

```ts
/**
 * Distance (px) from the end at which {@link endReached} fires.
 * @default 0
 */
public readonly endThreshold = input(0, { alias: 'ngnScrollAmountEndThreshold' });
/**
 * Fires once each time the scroll position crosses into the end zone
 * (within {@link endThreshold} of the bottom). Edge-triggered — it does not
 * re-fire while the user stays in the zone. For guard-free "load more" lists;
 * consumers with their own loading guard should read {@link distanceFromEnd} instead.
 */
public readonly endReached = output<void>();
```

In the constructor, after the geometry effects, add the edge detector:

```ts
let wasInZone = false;
effect(() => {
  const inZone = isWithinEndZone(this.distanceFromEnd(), this.endThreshold());
  if (inZone && !wasInZone) this.endReached.emit();
  wasInZone = inZone;
});
```

Add `effect` to the `@angular/core` import.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @ngneers/controls exec vitest run src/directives/scroll-amount.spec.ts`
Expected: PASS (6 tests total).

- [ ] **Step 5: Format + commit**

```bash
pnpm format packages/controls/src/directives/scroll-amount.ts packages/controls/src/directives/scroll-amount.spec.ts
git add packages/controls/src/directives/scroll-amount.ts packages/controls/src/directives/scroll-amount.spec.ts
git commit -m "feat(scroll-amount): add endThreshold and endReached output"
```

---

## Task 4: `NgnPaginator` compact mode

**Files:**

- Modify: `packages/controls/src/paginator/paginator.ts`
- Modify: `packages/controls/src/paginator/paginator.html`
- Test: `tests/components/paginator.test.ts`

**Interfaces:**

- Consumes: existing `page` model, `previousPage`/`nextPage`, `appliedPageSize`, `value` output.
- Produces: `mode: 'pages' | 'compact'` input, `hasNext` input, relaxed `totalItems` — consumed by `NgnTable` lazy wiring (Task 9).

- [ ] **Step 1: Write the failing e2e test**

Add to `tests/components/paginator.test.ts` (follow the existing `loadComponent` pattern in the file):

```ts
test('compact mode shows only prev/next, no page numbers', async ({ mount, page }) => {
  const cmp = await loadComponent(page, {
    template: `
      <ngn-paginator #p [mode]="'compact'" [hasNext]="inputs().hasNext" [pageSize]="10" />
    `,
    inputs: { hasNext: true },
  });
  // page-number buttons are absent in compact mode
  await expect(cmp.getByRole('button', { name: /^\d+$/ })).toHaveCount(0);
  // next is enabled while hasNext is true
  const next = cmp.getByLabel('Next page');
  await expect(next).toBeEnabled();
});
```

> Match the exact `loadComponent`/mount signature already used at the top of `tests/components/paginator.test.ts`; adapt the harness call to that file's convention (do not invent a new one).

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec playwright test tests/components/paginator.test.ts -g "compact mode"`
Expected: FAIL — `mode`/`hasNext` inputs don't exist; page numbers still render.

- [ ] **Step 3: Implement the inputs**

In `packages/controls/src/paginator/paginator.ts`:

Relax `totalItems` and add `mode`/`hasNext`:

```ts
/**
 * Total number of items to paginate. Required in `'pages'` mode (drives the
 * page count); ignored in `'compact'` mode.
 */
public readonly totalItems = input<number>();
/**
 * Layout mode.
 * - `'pages'`: full paginator with numbered page buttons (needs {@link totalItems}).
 * - `'compact'`: prev/next buttons only, no page indicators, no total required.
 * @default 'pages'
 */
public readonly mode = input<'pages' | 'compact'>('pages');
/**
 * `'compact'` mode only: whether a next page exists. Disables the "next" button
 * when `false`. Bind to a lazy data source's `hasMore`.
 * @default true
 */
public readonly hasNext = input(true, { transform: booleanAttribute });
```

Update `pageCount` to tolerate a missing total, and enforce total in pages mode:

```ts
protected readonly pageCount = computed(() =>
  Math.ceil((this.totalItems() ?? 0) / this.appliedPageSize())
);
```

Add a constructor effect enforcing total in pages mode (place alongside the existing `effect`):

```ts
effect(() => {
  if (this.mode() === 'pages' && this.totalItems() === undefined) {
    throw new NgnError('paginator', "totalItems is required in 'pages' mode");
  }
});
```

Import `NgnError` from `@ngneers/controls/utils` (already imports `throwExp` from there — add `NgnError`).

Guard `nextPage` against advancing past the end in compact mode (no `pageCount`):

```ts
protected nextPage(event: PointerEvent): void {
  if (this.mode() === 'compact' && !this.hasNext()) return;
  const amount = event.shiftKey ? 10 : event.ctrlKey ? 100 : 1;
  const max = this.mode() === 'compact' ? this.page() + amount : this.pageCount() - 1;
  const newPage = Math.min(this.page() + amount, max);
  this.page.set(newPage);
}
```

- [ ] **Step 4: Update the template for compact mode**

In `packages/controls/src/paginator/paginator.html`:

Wrap the `<ngn-item-view>` page list in a `@if (mode() === 'pages')` block:

```html
@if (mode() === 'pages') {
<ngn-item-view #itemView ...>
  <!-- unchanged existing content -->
</ngn-item-view>
}
```

Disable next when compact + no more:

```html
<button
  ngnButton
  [kind]="'icon'"
  [ptInt]="this"
  [ptDep]="'next'"
  [disabled]="mode() === 'compact' && !hasNext()"
  [attr.aria-label]="i18n['paginator_nextPage']()"
  (click)="nextPage($event)"
>
  <ngn-icon [defaultIcon]="'paginator-next'" />
</button>
```

Disable prev at page 0 (applies to both modes, improves compact UX):

```html
<button
  ngnButton
  [kind]="'icon'"
  [ptInt]="this"
  [ptDep]="'previous'"
  [disabled]="page() === 0"
  [attr.aria-label]="i18n['paginator_previousPage']()"
  (click)="previousPage($event)"
>
  <ngn-icon [defaultIcon]="'paginator-previous'" />
</button>
```

- [ ] **Step 5: Build themes + run test**

```bash
pnpm --filter @ngneers/controls-themes build
pnpm exec playwright test tests/components/paginator.test.ts -g "compact mode"
```

Expected: PASS.

- [ ] **Step 6: Format + commit**

```bash
pnpm format packages/controls/src/paginator/paginator.ts tests/components/paginator.test.ts
pnpm prettier --write packages/controls/src/paginator/paginator.html
git add packages/controls/src/paginator tests/components/paginator.test.ts
git commit -m "feat(paginator): add compact mode (prev/next only)"
```

---

## Task 5: Paginator compact theme layout

**Files:**

- Modify: `packages/themes/src/base/paginator/index.ts`
- Modify: `packages/themes/src/nova/paginator/index.ts`
- Modify (if a layout hook class is needed): `packages/themes/src/templates/paginator/index.ts`

**Interfaces:**

- Consumes: existing paginator theme parts (`previous`/`next`/`page-number` deps).
- Produces: no code interface; visual only.

- [ ] **Step 1: Verify current layout tolerates a missing page list**

Read `packages/themes/src/base/paginator/index.ts` and `.../nova/paginator/index.ts`. If the root uses `display: flex` with `gap`, removing the `<ngn-item-view>` needs no change — prev/next simply sit adjacent. If it uses `justify-content: space-between` expecting three children, add a compact rule.

- [ ] **Step 2: Add a compact class name only if needed**

If a layout adjustment is required, add `'compact'` to `classNames` in `packages/themes/src/templates/paginator/index.ts`, bind it on the paginator host in `paginator.ts` via the theme mapping (`compact: () => this.mode() === 'compact'`), and add a rule in base/nova, e.g.:

```ts
${c('compact')} {
  justify-content: flex-start;
}
```

If the existing flex layout already looks correct with just prev/next (likely), skip the class and note it.

- [ ] **Step 3: Build + eyeball**

```bash
pnpm --filter @ngneers/controls-themes build
```

Verify against the paginator docs demo once Task 15 adds a compact demo, or via the existing paginator playground.

- [ ] **Step 4: Format + commit**

```bash
pnpm format packages/themes/src/base/paginator/index.ts packages/themes/src/nova/paginator/index.ts
git add packages/themes/src/base/paginator packages/themes/src/nova/paginator packages/themes/src/templates/paginator
git commit -m "style(paginator): compact-mode layout"
```

---

## Task 6: `TableLazyModel` — pagination load, cache, epoch

**Files:**

- Create: `packages/controls/src/table/table-lazy-model.ts`
- Test: `packages/controls/src/table/table-lazy-model.spec.ts`

**Interfaces:**

- Consumes: `TableDataSource`/`TableLoadRequest`/`TableLoadResult` (Task 1), `PaginationState` (paginator).
- Produces: `TableLazyModel<T>` with signals `loaded`, `status`, `error`, `total`, `hasMore` and methods `setPage(state: PaginationState)`, `reload()`. Consumed by `NgnTable` (Task 9) and infinite append (Task 7).

The model is constructed with a deps object mirroring `TableSelectionModel`: signal getters for `dataSource`, `sort`, `filters`, plus an `Injector` for `effect`. To stay unit-testable without TestBed, the model exposes plain methods that the component wires to signals; the spec drives it directly with a fake loader.

- [ ] **Step 1: Write the failing test**

Create `packages/controls/src/table/table-lazy-model.spec.ts`:

```ts
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { TableLazyModel } from './table-lazy-model';
import type { TableDataSource } from './types';

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
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @ngneers/controls exec vitest run src/table/table-lazy-model.spec.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the model**

Create `packages/controls/src/table/table-lazy-model.ts`:

```ts
import { signal, type Signal } from '@angular/core';

import type { PaginationState } from '@ngneers/controls/paginator';
import type { NgnFilterConfig } from '@ngneers/controls/filter';
import type { TableDataSource, TableLoadResult } from './types';

export type TableLazyMode = 'paginate' | 'infinite';

export type TableLazyDeps<T> = {
  dataSource: Signal<TableDataSource<T> | null>;
  sort: Signal<{ column: string; direction: 'asc' | 'desc' } | null>;
  filters: Signal<Record<string, NgnFilterConfig> | null>;
  mode: Signal<TableLazyMode>;
};

/**
 * Owns lazy-loading state for {@link NgnTable}: the loaded row window,
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

  constructor(private readonly _deps: TableLazyDeps<T>) {}

  /** Load (or serve from cache) the page described by `state`. */
  public async setPage(state: PaginationState): Promise<void> {
    this._lastState = state;
    const cached = this._cache.get(state.page.current);
    if (cached) {
      this.loaded.set(cached.rows);
      this.total.set(cached.total);
      this.hasMore.set(cached.hasMore);
      return;
    }
    await this._load(state, 'replace');
  }

  /** Invalidate everything and refetch the current page/window from scratch. */
  public async reload(): Promise<void> {
    this._bumpEpoch();
    if (this._lastState) await this._load(this._lastState, 'replace');
  }

  /** Called by the component when sort/filter/pageSize/dataSource change. */
  public invalidate(): void {
    this._bumpEpoch();
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
  }

  protected async _load(state: PaginationState, apply: 'replace' | 'append'): Promise<void> {
    const loader = this._deps.dataSource();
    if (!loader) return;
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
        cursor: this.cursorFor(state.page.current),
        signal: controller.signal,
      });
      if (epoch !== this._epoch) return; // superseded
      this._cache.set(state.page.current, result);
      this.total.set(result.total);
      this.hasMore.set(result.hasMore);
      this.loaded.set(apply === 'append' ? [...this.loaded(), ...result.rows] : result.rows);
      this.status.set('idle');
    } catch (err) {
      if (epoch !== this._epoch || controller.signal.aborted) return;
      this.error.set(err);
      this.status.set('error');
    }
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @ngneers/controls exec vitest run src/table/table-lazy-model.spec.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Format + commit**

```bash
pnpm format packages/controls/src/table/table-lazy-model.ts packages/controls/src/table/table-lazy-model.spec.ts
git add packages/controls/src/table/table-lazy-model.ts packages/controls/src/table/table-lazy-model.spec.ts
git commit -m "feat(table): TableLazyModel pagination + cache + epoch"
```

---

## Task 7: `TableLazyModel` — infinite append + stop

**Files:**

- Modify: `packages/controls/src/table/table-lazy-model.ts`
- Test: `packages/controls/src/table/table-lazy-model.spec.ts` (extend)

**Interfaces:**

- Consumes: `_load`, `hasMore`, `loaded` (Task 6).
- Produces: `loadNext(): Promise<void>` — appends the next window; no-op when loading or `!hasMore`. Consumed by the infinite effect (Task 10).

- [ ] **Step 1: Write the failing test**

Add to `table-lazy-model.spec.ts`:

```ts
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
});
```

Add `import type { TableLoadResult } from './types';` to the spec imports.

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @ngneers/controls exec vitest run src/table/table-lazy-model.spec.ts`
Expected: FAIL — `loadNext` not defined.

- [ ] **Step 3: Implement `loadNext`**

Add to `TableLazyModel`:

```ts
private _nextWindow = 0;

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
  if (this.status() === 'idle') this._nextWindow++;
}
```

Reset `_nextWindow` in `_bumpEpoch`:

```ts
this._nextWindow = 0;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @ngneers/controls exec vitest run src/table/table-lazy-model.spec.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Format + commit**

```bash
pnpm format packages/controls/src/table/table-lazy-model.ts packages/controls/src/table/table-lazy-model.spec.ts
git add packages/controls/src/table/table-lazy-model.ts packages/controls/src/table/table-lazy-model.spec.ts
git commit -m "feat(table): TableLazyModel infinite append + stop"
```

---

## Task 8: `TableLazyModel` — abort/supersede + error

**Files:**

- Modify: `packages/controls/src/table/table-lazy-model.spec.ts` (extend — behavior already implemented in Task 6/7)

**Interfaces:**

- Consumes: `_load` epoch guard, `AbortController` (Task 6).
- Produces: no new API — this task locks the abort/error behavior with tests.

- [ ] **Step 1: Write the tests**

Add to `table-lazy-model.spec.ts`:

```ts
describe('TableLazyModel — supersede + error', () => {
  it('invalidate() aborts an in-flight request and ignores its result', async () => {
    let resolve!: (r: TableLoadResult<Row>) => void;
    const loader = vi.fn(() => new Promise<TableLoadResult<Row>>(r => (resolve = r)));
    const model = makeModel(loader);
    const p = model.setPage(pageState(0));
    model.invalidate(); // supersede
    resolve({ rows: [{ id: 99 }], hasMore: true, total: 1 });
    await p;
    expect(model.loaded()).toEqual([]); // stale result discarded
  });

  it('sets error status on rejection', async () => {
    const loader = vi.fn(async () => {
      throw new Error('boom');
    });
    const model = makeModel(loader);
    await model.setPage(pageState(0));
    expect(model.status()).toBe('error');
    expect((model.error() as Error).message).toBe('boom');
  });
});
```

- [ ] **Step 2: Run**

Run: `pnpm --filter @ngneers/controls exec vitest run src/table/table-lazy-model.spec.ts`
Expected: PASS (7 tests). If the supersede test fails, verify the `epoch !== this._epoch` guard in `_load` runs before any signal write.

- [ ] **Step 3: Format + commit**

```bash
pnpm format packages/controls/src/table/table-lazy-model.spec.ts
git add packages/controls/src/table/table-lazy-model.spec.ts
git commit -m "test(table): lock TableLazyModel abort + error behavior"
```

---

## Task 9: Wire lazy mode into `NgnTable`

**Files:**

- Modify: `packages/controls/src/table/table.ts`
- Modify: `packages/controls/src/table/table.html`
- Test: `tests/components/table.test.ts`

**Interfaces:**

- Consumes: `TableLazyModel` (Tasks 6–8), `TableDataSource` (Task 1), paginator `mode`/`hasNext` (Task 4).
- Produces: `dataSource` input, relaxed `rows`, `reload()` method, `lazy`/`lazyMode` computeds, gated `_baseRows` — consumed by skeleton/error/infinite tasks (10–13).

- [ ] **Step 1: Write the failing e2e test**

Add to `tests/components/table.test.ts` a lazy pagination scenario using a template with `[dataSource]` bound to an inputs-provided async fn and `[paginator]="true"`. Assert the first page's rows render and the loader was called with `pagination.page.current === 0`. (Model the mount/inputs plumbing on the existing tests in the file; expose call capture via a signal or window hook per the harness convention already used.)

```ts
test('lazy pagination loads the first page from dataSource', async ({ mount, page }) => {
  const cmp = await loadComponent(page, {
    template: `
      <ngn-table #t style="height: 300px" [fieldId]="'id'" [paginator]="true"
                 [dataSource]="inputs().dataSource">
        <ng-template #header><tr ngnTableHeadTr><th [ngnTableTh]="t.column('id')">ID</th></tr></ng-template>
        <ng-template #body let-row [ngnTemplate]="t.templateTypes.body">
          <tr [ngnTableBodyTr]="row"><td ngnTableTd>{{ row.data.id }}</td></tr>
        </ng-template>
      </ngn-table>
    `,
    inputs: {
      dataSource: async () => ({ rows: [{ id: 1 }, { id: 2 }], total: 100, hasMore: true }),
    },
  });
  await expect(cmp.getByText('1')).toBeVisible();
  await expect(cmp.getByText('2')).toBeVisible();
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm exec playwright test tests/components/table.test.ts -g "lazy pagination"`
Expected: FAIL — `dataSource` input doesn't exist; nothing renders.

- [ ] **Step 3: Add inputs, relax `rows`, add computeds + model**

In `packages/controls/src/table/table.ts`:

Relax `rows` from required to optional (all internal reads already tolerate empty):

```ts
/** The data rows to render in client-side mode. Ignored when {@link dataSource} is set. */
public readonly rows = input<readonly T[]>([]);
```

Add lazy inputs (place near `paginator`):

```ts
/**
 * A loader callback for server-driven lazy loading. When set, the table fetches
 * rows on demand instead of reading {@link rows}, and client-side sort/filter are
 * delegated to the loader. With {@link paginator} it pages lazily; without, it
 * infinite-scrolls. Incompatible with {@link groupBy} (throws).
 * @default null
 */
public readonly dataSource = input<TableDataSource<T> | null>(null);
/**
 * Infinite scroll only: set by the header select-all checkbox to request a
 * "select everything matching the current filters" bulk operation, since the
 * full set is not loaded. Two-way bindable.
 * @default false
 */
public readonly selectAllMatching = model<boolean>(false);
```

Add derived state + the model (after `pageState`):

```ts
protected readonly lazy = computed(() => !!this.dataSource());
protected readonly lazyMode = computed<'paginate' | 'infinite'>(() =>
  this.paginator() ? 'paginate' : 'infinite'
);

private readonly _lazyModel = new TableLazyModel<T>({
  dataSource: this.dataSource,
  sort: this.sort,
  filters: computed(() => this.filters() as Record<string, NgnFilterConfig> | null),
  mode: this.lazyMode,
});

protected readonly loadStatus = this._lazyModel.status;
protected readonly loadError = this._lazyModel.error;
```

Introduce `_baseRows` and reroute the existing filter/sort computeds through it. Replace `_filteredRows`/`_sortedRows`:

```ts
private readonly _baseRows = computed<readonly T[]>(() =>
  this.lazy() ? this._lazyModel.loaded() : this.rows()
);
private readonly _filteredRows = computed<readonly T[]>(() =>
  this.lazy() ? this._baseRows() : filterRows(this._baseRows(), this.filters())
);
private readonly _sortedRows = computed<readonly T[]>(() =>
  this.lazy() ? this._baseRows() : sortRows(this._filteredRows(), this.sort(), this.sortComparator())
);
```

Update `pagedRows` so lazy pagination does NOT re-slice client-side (the loader already returned one page):

```ts
protected readonly pagedRows = computed<FormattedTableRow<T>[]>(() => {
  if (!this.paginator() || this.lazy()) {
    return this.formattedRows();
  }
  return [...paginateRows(this.formattedRows(), this.pageState())];
});
```

Add the `groupBy`+lazy guard and epoch/invalidation + page-driven load effects in the constructor:

```ts
effect(() => {
  if (this.lazy() && this.groupBy()) {
    throw new NgnError('table', 'groupBy is not supported with a lazy dataSource (v1)');
  }
});

// invalidate cache when sort/filter/pageSize/dataSource identity change
effect(() => {
  this.sort();
  this.filters();
  this.pageState()?.page.size;
  this.dataSource();
  untracked(() => this._lazyModel.invalidate());
});

// lazy pagination: load the page whenever pageState changes
effect(() => {
  const state = this.pageState();
  if (!this.lazy() || this.lazyMode() !== 'paginate' || !state) return;
  untracked(() => void this._lazyModel.setPage(state));
});
```

Add `reload()`:

```ts
/** Force a lazy refetch, clearing the page cache. No-op in client-side mode. */
public reload(): void {
  void this._lazyModel.reload();
}
```

Imports: add `TableLazyModel` from `./table-lazy-model`, `NgnError` from `@ngneers/controls/utils`, `untracked` from `@angular/core`, and `TableDataSource` to the `./types` type import.

- [ ] **Step 4: Bind lazy paginator in the template**

In `packages/controls/src/table/table.html`, replace the paginator block:

```html
@if (paginator()) {
<ngn-paginator
  [ptInt]="this"
  [ptDep]="'paginator'"
  [mode]="lazy() && loadTotal() === undefined ? 'compact' : 'pages'"
  [totalItems]="lazy() ? (loadTotal() ?? 0) : rows().length"
  [hasNext]="lazyHasMore()"
  (value)="pageChanged($event)"
/>
}
```

Expose the needed signals in `table.ts`:

```ts
protected readonly loadTotal = this._lazyModel.total;
protected readonly lazyHasMore = this._lazyModel.hasMore;
```

- [ ] **Step 5: Build themes + run test**

```bash
pnpm --filter @ngneers/controls-themes build
pnpm exec playwright test tests/components/table.test.ts -g "lazy pagination"
```

Expected: PASS.

- [ ] **Step 6: Format + commit**

```bash
pnpm format packages/controls/src/table/table.ts tests/components/table.test.ts
pnpm prettier --write packages/controls/src/table/table.html
git add packages/controls/src/table tests/components/table.test.ts
git commit -m "feat(table): wire lazy dataSource (pagination + compact)"
```

---

## Task 10: Infinite scroll wiring

**Files:**

- Modify: `packages/controls/src/scroller/scroller.ts`
- Modify: `packages/controls/src/table/table.ts`
- Test: `tests/components/table.test.ts`

**Interfaces:**

- Consumes: `NgnScrollAmount.distanceFromEnd` (Task 2), `TableLazyModel.loadNext` (Task 7), scroller `_scroller` viewChild.
- Produces: `NgnScroller.distanceFromEnd` re-export.

- [ ] **Step 1: Re-expose `distanceFromEnd` on the scroller**

In `packages/controls/src/scroller/scroller.ts`, add (the class already injects `_scrollAmount`):

```ts
/** Remaining vertical scroll distance to the bottom (px). Proxied from the host scroll directive. */
public readonly distanceFromEnd = this._scrollAmount.distanceFromEnd;
```

- [ ] **Step 2: Write the failing e2e test**

Add an infinite-scroll scenario to `tests/components/table.test.ts`: a `[dataSource]` table WITHOUT `[paginator]`, `[virtual]="true"`, `[rowHeight]="40"`, a fixed viewport height. Scroll the container to the bottom and assert more rows loaded (loader called ≥ 2×). Use the harness's scroll + `waitFor` helpers already present in the file.

- [ ] **Step 3: Run to verify it fails**

Run: `pnpm exec playwright test tests/components/table.test.ts -g "infinite scroll"`
Expected: FAIL — only the first window loads; scrolling does nothing.

- [ ] **Step 4: Add the infinite effect in `NgnTable`**

In `table.ts` constructor:

```ts
// infinite scroll: load the next window whenever the viewport nears the end
// and there is more to load. Self-correcting — appending grows the content,
// distanceFromEnd recomputes, and this re-runs until the viewport is filled.
effect(() => {
  if (!this.lazy() || this.lazyMode() !== 'infinite') return;
  const distance = this._scroller().distanceFromEnd();
  const threshold = (this.rowHeight() ?? 40) * this.virtualPadding();
  const pageSize = this.pageState()?.page.size ?? DEFAULT_LAZY_PAGE_SIZE;
  if (distance <= threshold) {
    untracked(() => void this._lazyModel.loadNext(pageSize));
  }
});
```

Add a module constant near the top of `table.ts`:

```ts
const DEFAULT_LAZY_PAGE_SIZE = 25;
```

> The effect reads `distanceFromEnd()` and `pageState()` as dependencies; the `loadNext` call is wrapped in `untracked` so its signal writes don't create a feedback loop. `loadNext` self-guards against re-entry while loading.

- [ ] **Step 5: Build + run**

```bash
pnpm --filter @ngneers/controls-themes build
pnpm exec playwright test tests/components/table.test.ts -g "infinite scroll"
```

Expected: PASS.

> Verification note: confirm `distanceFromEnd` reads content vs viewport off the correct element when the scroller uses an external `scrollContainer` (the table wrapper). If geometry reads 0 headless (per known `ResizeObserver`/`document.hidden` caveat), assert via `ng.getComponent` on `distanceFromEnd`/`loaded` length instead of pixel scroll.

- [ ] **Step 6: Format + commit**

```bash
pnpm format packages/controls/src/scroller/scroller.ts packages/controls/src/table/table.ts tests/components/table.test.ts
git add packages/controls/src/scroller/scroller.ts packages/controls/src/table/table.ts tests/components/table.test.ts
git commit -m "feat(table): infinite scroll via scroller distanceFromEnd"
```

---

## Task 11: Skeleton loading rows

**Files:**

- Modify: `packages/controls/src/table/table-templates.ts`
- Modify: `packages/controls/src/table/table.ts`
- Modify: `packages/controls/src/table/table.html`
- Modify: `packages/themes/src/templates/table/index.ts`
- Modify: `packages/themes/src/base/table/index.ts`
- Modify: `packages/themes/src/nova/table/index.ts`

**Interfaces:**

- Consumes: `loadStatus` (Task 9), `rowHeight`, `totalColumnCount`.
- Produces: `loadingTemplate` content child, `skeletonRows` computed, theme classes `skeleton-row`/`skeleton-cell`.

- [ ] **Step 1: Add the content-child template + type**

In `table-templates.ts`, add:

```ts
private readonly _loadingTemplate = contentChild<TemplateRef<unknown>>('loading');
protected readonly loadingTemplate = this._loadingTemplate;
```

- [ ] **Step 2: Add skeleton count + theme mapping in `table.ts`**

```ts
/** Number of placeholder rows to show while a lazy window loads. */
protected readonly skeletonRows = computed(() => {
  if (this.loadStatus() !== 'loading') return 0;
  return this.paginator() ? (this.pageState()?.page.size ?? DEFAULT_LAZY_PAGE_SIZE) : this.virtualPadding() * 2 + 1;
});
```

Add `skeleton` to the theme class mapping object in `injectThemeTemplate` if a state hook is wanted (`loading: () => this.loadStatus() === 'loading'`).

- [ ] **Step 3: Render skeletons in `table.html`**

Inside `<tbody>`, after the `<ng-template #item ...>` block (still inside the scroller), add:

```html
@if (skeletonRows() > 0) { @if (loadingTemplate(); as customLoading) {
<ng-container [ngTemplateOutlet]="customLoading"></ng-container>
} @else { @for (i of [].constructor(skeletonRows()); track $index) {
<tr [class]="theme.class('skeleton-row')" role="row" aria-hidden="true">
  @for (c of [].constructor(totalColumnCount()); track $index) {
  <td [class]="theme.class('skeleton-cell')" role="gridcell"><span></span></td>
  }
</tr>
} } }
```

- [ ] **Step 4: Add theme parts**

In `packages/themes/src/templates/table/index.ts`, add `'skeleton-row'`, `'skeleton-cell'`, `'loading'` to `classNames`.

In `packages/themes/src/base/table/index.ts` root css, add structural rules:

```ts
${c('skeleton-row')} {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / -1;
  height: var(--ngn-table-row-height);
}
${c('skeleton-cell')} {
  display: flex;
  align-items: center;
  padding: 0 var(--padding, 0.5rem);
}
${c('skeleton-cell')} span {
  display: block;
  width: 60%;
  height: 0.75em;
  border-radius: 0.25rem;
}
```

In `packages/themes/src/nova/table/index.ts` root css, add the shimmer:

```ts
${c('skeleton-cell')} span {
  background: linear-gradient(90deg,
    ${v('color.surface.200')} 25%,
    ${v('color.surface.100')} 37%,
    ${v('color.surface.200')} 63%);
  background-size: 400% 100%;
  animation: ngn-table-shimmer 1.4s ease infinite;
}
@keyframes ngn-table-shimmer {
  0% { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}
```

> Use color tokens that exist in the nova palette — verify against `packages/themes/src/nova/base` color scale before finalizing; substitute the nearest existing `surface`/`background` tokens if `surface.100/200` are absent. (Nova palette reverses shades in dark mode — the `500` shade is scheme-stable; prefer neutral tokens that read correctly in both.)

- [ ] **Step 5: Build + verify no lazy render regression**

```bash
pnpm --filter @ngneers/controls-themes build
pnpm exec playwright test tests/components/table.test.ts -g "lazy"
```

Expected: existing lazy tests still PASS; add an assertion that `skeleton-row` appears during a pending (unresolved) load if practical.

- [ ] **Step 6: Format + commit**

```bash
pnpm format packages/controls/src/table/table.ts packages/controls/src/table/table-templates.ts packages/themes/src/templates/table/index.ts packages/themes/src/base/table/index.ts packages/themes/src/nova/table/index.ts
pnpm prettier --write packages/controls/src/table/table.html
git add packages/controls/src/table packages/themes/src/templates/table packages/themes/src/base/table packages/themes/src/nova/table
git commit -m "feat(table): skeleton loading rows"
```

---

## Task 12: Error row + retry

**Files:**

- Modify: `packages/controls/src/table/table-templates.ts`
- Modify: `packages/controls/src/table/table.html`
- Modify: `packages/themes/src/templates/table/index.ts`
- Modify: `packages/themes/src/base/table/index.ts` + `.../nova/table/index.ts`
- Modify: `packages/controls/src/table/table.ts` (i18n key)

**Interfaces:**

- Consumes: `loadError`/`loadStatus` (Task 9), `reload()` (Task 9), `totalColumnCount`.
- Produces: `errorTemplate` content child, theme class `error-row`.

- [ ] **Step 1: Add content-child template**

In `table-templates.ts`:

```ts
private readonly _errorTemplate = contentChild<TemplateRef<unknown>>('error');
protected readonly errorTemplate = this._errorTemplate;
```

- [ ] **Step 2: Add i18n retry key**

Add a `table_retry` translation key alongside the existing `table_*` keys (find them via the i18n definition the table already imports; add `table_retry: () => 'Retry'` and locale equivalents following the existing pattern). If adding i18n keys is heavier than expected, use an existing generic retry/label key if present.

- [ ] **Step 3: Render the error row in `table.html`**

After the skeleton block inside `<tbody>`:

```html
@if (loadStatus() === 'error') { @if (errorTemplate(); as customError) {
<ng-container
  [ngTemplateOutlet]="customError"
  [ngTemplateOutletContext]="{ $implicit: { error: loadError(), retry: reload.bind(this) } }"
></ng-container>
} @else {
<tr [class]="theme.class('error-row')" role="row">
  <td [attr.colspan]="totalColumnCount()" role="gridcell">
    <span>{{ i18n['table_loadError']() }}</span>
    <button ngnButton [kind]="'text'" (click)="reload()">{{ i18n['table_retry']() }}</button>
  </td>
</tr>
} }
```

Add a `table_loadError` i18n key too (`() => 'Failed to load data'`). Import `NgnButton` into `NgnTable`'s `imports` array. Note the error-row `<td>` uses `colspan` and sits outside the grid subgrid flow — add a base rule to span it (Step 4).

- [ ] **Step 4: Theme parts**

Add `'error-row'` to `classNames` in the table template. In base:

```ts
${c('error-row')} {
  grid-column: 1 / -1;
}
${c('error-row')} td {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  padding: var(--ngn-table-row-height) 0;
}
```

In nova, color it:

```ts
${c('error-row')} {
  color: ${v('color.danger.500')};
}
```

Verify `color.danger.500` exists in the nova palette; substitute the nearest error/danger token otherwise.

- [ ] **Step 5: Build + test**

```bash
pnpm --filter @ngneers/controls-themes build
```

Add an e2e assertion: a rejecting `dataSource` renders the error row with a Retry button; clicking it re-issues the loader (spy count increases). Run:
`pnpm exec playwright test tests/components/table.test.ts -g "error"`
Expected: PASS.

- [ ] **Step 6: Format + commit**

```bash
pnpm format packages/controls/src/table packages/themes/src/templates/table packages/themes/src/base/table packages/themes/src/nova/table
pnpm prettier --write packages/controls/src/table/table.html
git add packages/controls/src/table packages/themes/src/templates/table packages/themes/src/base/table packages/themes/src/nova/table
git commit -m "feat(table): lazy error row + retry"
```

---

## Task 13: Infinite-mode select-all-matching

**Files:**

- Modify: `packages/controls/src/table/table-selection-model.ts`
- Modify: `packages/controls/src/table/table.ts`
- Test: `packages/controls/src/table/table-selection-model.spec.ts` (extend) or `tests/components/table.test.ts`

**Interfaces:**

- Consumes: `selectAllMatching` model (Task 9), `lazyMode` (Task 9), existing header-checkbox path.
- Produces: header select-all behavior branch for infinite mode.

- [ ] **Step 1: Write the failing test**

Extend the selection model spec (or add an e2e): in infinite lazy mode, clicking the header checkbox sets `selectAllMatching` to `true` instead of toggling per-loaded-row selection; in pagination mode the header checkbox behaves as today (toggles the current page). Model the spec on the existing `table-selection-model.spec.ts` setup.

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm --filter @ngneers/controls exec vitest run src/table/table-selection-model.spec.ts`
Expected: FAIL.

- [ ] **Step 3: Branch `toggleSelectAll`**

In `table.ts`, wrap the header-checkbox handler so infinite mode routes to the flag:

```ts
public toggleSelectAll(): void {
  if (this.lazy() && this.lazyMode() === 'infinite') {
    this.selectAllMatching.update(v => !v);
    return;
  }
  this._selection.toggleSelectAll();
}
```

And make `headerCheckboxValue` reflect `selectAllMatching` in infinite mode:

```ts
this.headerCheckboxValue = computed<boolean | null>(() =>
  this.lazy() && this.lazyMode() === 'infinite'
    ? this.selectAllMatching()
    : this._selection.headerCheckboxValue()
);
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm --filter @ngneers/controls exec vitest run src/table/table-selection-model.spec.ts`
Expected: PASS.

- [ ] **Step 5: Format + commit**

```bash
pnpm format packages/controls/src/table/table.ts packages/controls/src/table/table-selection-model.spec.ts
git add packages/controls/src/table
git commit -m "feat(table): select-all-matching in infinite lazy mode"
```

---

## Task 14: Demos + fake async backend

**Files:**

- Create: `apps/docs/src/app/demos/table/fake-data-service.ts`
- Create: `apps/docs/src/app/demos/table/lazy-pagination.ts`
- Create: `apps/docs/src/app/demos/table/lazy-infinite-scroll.ts`
- Create: `apps/docs/src/app/demos/table/compact-cursor-pagination.ts`

**Interfaces:**

- Consumes: `NgnTable` lazy API, `TableDataSource`/`TableLoadRequest`/`TableLoadResult`.
- Produces: demo components registered in the docs demo index (follow the existing registration pattern in `apps/docs/src/app/demos/table/`).

- [ ] **Step 1: Inspect an existing table demo**

Read one existing file in `apps/docs/src/app/demos/table/` to copy the standalone-component structure, imports, and how demos are registered/exported.

- [ ] **Step 2: Write the fake backend**

Create `fake-data-service.ts` — an in-memory dataset with a delay, supporting offset slices, sort, filter, cursor tokens, and a `total`. Example:

```ts
export type Person = { id: number; name: string; email: string; age: number };

const DATA: Person[] = Array.from({ length: 523 }, (_, i) => ({
  id: i + 1,
  name: `Person ${i + 1}`,
  email: `person${i + 1}@example.com`,
  age: 18 + (i % 50),
}));

const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

/** Offset-based loader (pagination + infinite). */
export async function fetchPage(skip: number, take: number, withTotal = true) {
  await delay(400);
  const rows = DATA.slice(skip, skip + take);
  return {
    rows,
    total: withTotal ? DATA.length : undefined,
    hasMore: skip + take < DATA.length,
  };
}

/** Cursor-based loader (compact) — token is the next offset, total omitted. */
export async function fetchCursor(cursor: number | undefined, take: number) {
  await delay(400);
  const skip = cursor ?? 0;
  const rows = DATA.slice(skip, skip + take);
  const nextSkip = skip + take;
  return { rows, hasMore: nextSkip < DATA.length, cursor: nextSkip };
}
```

- [ ] **Step 3: Write the three demo components**

`lazy-pagination.ts` — `[paginator]="true" [dataSource]="load"` where `load = (req) => fetchPage(req.pagination.slice.skip, req.pagination.slice.take)`.

`lazy-infinite-scroll.ts` — `[virtual]="true" [rowHeight]="44" [dataSource]="load"` (no paginator), same `fetchPage`, fixed height container.

`compact-cursor-pagination.ts` — `[paginator]="true" [dataSource]="load"` where `load = (req) => fetchCursor(req.cursor as number | undefined, req.pagination.slice.take)` (no `total` → table auto-selects compact paginator).

Each is a standalone component importing `NgnTable` + row/header directives, mirroring the existing demo file read in Step 1.

- [ ] **Step 4: Register + run docs**

Register the demos per the existing index pattern. Verify via the running dev server on :4200 (do not spawn a new server) + `pnpm docs:build`.

Run: `pnpm docs:build`
Expected: build succeeds.

- [ ] **Step 5: Format + commit**

```bash
pnpm format apps/docs/src/app/demos/table/*.ts
git add apps/docs/src/app/demos/table
git commit -m "docs(table): lazy pagination, infinite scroll, compact demos"
```

---

## Task 15: Docs API pages

**Files:**

- Modify: `apps/docs/src/app/docs/components/table/api.md`
- Modify: `apps/docs/src/app/docs/components/table/playground.ts`
- Modify: `apps/docs/src/app/docs/components/paginator/api.md`

**Interfaces:**

- Consumes: nothing at runtime — documentation.
- Produces: documented `dataSource`/`reload`/`selectAllMatching`/loading+error templates; paginator `mode`/`hasNext`.

- [ ] **Step 1: Document table lazy API**

In `table/api.md`, add rows for `dataSource`, `reload()`, `selectAllMatching`, and the `#loading`/`#error` template slots, plus a short "Lazy loading" prose section linking the three demos. Follow the existing table row/section format in the file.

- [ ] **Step 2: Document paginator compact mode**

In `paginator/api.md`, add `mode` and `hasNext` rows and a note that `totalItems` is optional in `compact` mode.

- [ ] **Step 3: Playground (optional toggle)**

If the table playground exposes feature toggles, add a `dataSource`/lazy toggle; otherwise leave a prose pointer to the demos. Keep it minimal (YAGNI).

- [ ] **Step 4: Build docs**

Run: `pnpm docs:build`
Expected: build succeeds; `/md` live pages render (per the 4200-stale-bundle caveat, verify markdown live, code via build).

- [ ] **Step 5: Format + commit**

```bash
pnpm format apps/docs/src/app/docs/components/table/api.md apps/docs/src/app/docs/components/paginator/api.md
git add apps/docs/src/app/docs/components/table apps/docs/src/app/docs/components/paginator
git commit -m "docs: document table lazy loading and paginator compact mode"
```

---

## Final verification

- [ ] `pnpm --filter @ngneers/controls exec vitest run src/table/table-lazy-model.spec.ts src/directives/scroll-amount.spec.ts` — all unit tests pass.
- [ ] `pnpm --filter @ngneers/controls-themes build` — themes build.
- [ ] `pnpm exec playwright test tests/components/table.test.ts tests/components/paginator.test.ts` — lazy + compact e2e pass.
- [ ] `pnpm docs:build` — docs build.
- [ ] `pnpm lint` (oxlint) over changed files — clean.
- [ ] Manual: `groupBy` + `dataSource` throws a clear `NgnError`; client-side (non-lazy) table behavior unchanged.

---

## Self-review notes

- **Spec coverage:** loader contract (T1), scroll-end primitive incl. `endThreshold`/`endReached` (T2–T3), compact paginator (T4–T5), engine incl. cache/epoch/abort/cursor/infinite (T6–T8), table wiring + gated client transforms + groupBy guard (T9), infinite scroll (T10), skeleton (T11), error/retry (T12), selection (T13), demos + docs (T14–T15). All spec sections mapped.
- **Deferred (v2, out of scope):** lazy grouping — T9 enforces the `groupBy`+lazy throw so the unsupported combo fails loud.
- **Known-ceiling shortcut:** the infinite-scroll effect uses a fixed threshold heuristic (`rowHeight * virtualPadding`). If a consumer needs a custom trigger distance, expose it via the scroller's `endThreshold` later — not built now (YAGNI).
- **Harness caveat:** e2e mount/inputs plumbing and scroll helpers must match the exact conventions already in `tests/components/table.test.ts` / `paginator.test.ts`; the test snippets here are shapes, adapt to the file's `loadComponent` signature. Headless geometry may read 0 (`document.hidden`) — fall back to `ng.getComponent` signal assertions for the infinite-scroll test.
