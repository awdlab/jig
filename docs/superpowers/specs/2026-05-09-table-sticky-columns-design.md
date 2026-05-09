# Table Sticky Columns — Design Spec

## Overview

Add sticky (frozen) column support to `NgnTable`. Columns pinned to the left or right edge stay visible during horizontal scroll. CSS-first approach using `position: sticky` with minimal JS for offset computation and scroll detection.

## API

### Directive: `NgnTableStickyColumn`

**Selector:** `[ngnTableStickyColumn]`
**Input:** `ngnTableStickyColumn: 'start' | 'end'` (required, via `input.required<'start' | 'end'>()`)

```html
<th [ngnTableTh]="table.column('id')" [ngnTableStickyColumn]="'start'">ID</th>
<th [ngnTableTh]="table.column('name')" [ngnTableStickyColumn]="'start'">Name</th>
<!-- scrollable columns -->
<th [ngnTableTh]="table.column('actions')" [ngnTableStickyColumn]="'end'">Actions</th>
```

Directive injects `NgnTableTh` to get column ID. Registers/unregisters with parent `NgnTable` via `registerStickyColumn(columnId, side)` / `unregisterStickyColumn(columnId)`.

### Contiguity Constraint

Only edge columns can be sticky. Columns must be contiguous from the edge inward. If column 1 and 3 are `start` but column 2 isn't, only column 1 is treated as sticky. The computed filters to the contiguous set and warns in dev mode.

### Selection Column

Always sticky unconditionally. No directive needed — handled in CSS with `position: sticky; left: 0`. When sticky-start columns exist, their offsets shift by the selection column width. Selection column width queried via `querySelector` + `getBoundingClientRect().width` (same pattern used in the resize engine constructor).

## Architecture

### Row Layout Change (prerequisite)

**Problem:** The current layout uses `display: contents` on `<tr>`, making cells direct grid items of `<thead>`/`<tbody>` subgrids. A cell's containing block is its grid area (one column track). CSS `position: sticky` constrains the element to its containing block — so sticky cells can't escape their column track.

**Fix:** Change rows from `display: contents` to `display: grid; grid-template-columns: subgrid; grid-column: 1 / -1`.

This makes each `<tr>` a grid container spanning all columns via subgrid. Cells become grid items of the row. The cell's containing block is now the row, which spans the full scrollable width — wide enough for `position: sticky` to work.

**Changes:**

CSS (base theme `packages/themes/src/base/table/index.ts`):
- `${c('row')}`, `${c('group-header-row')}`: change from `display: contents` to `display: grid; grid-template-columns: subgrid; grid-column: 1 / -1`
- Add `grid-row-start` computation to the row rules: `--row-index: calc(var(--ngn-table-row-index) - var(--ngn-table-item-start-index)); grid-row-start: var(--row-index)`
- `${c('head')} ${c('row')}` (header row inside thead): add `grid-row-start: 1` via CSS rule (not a TS host binding)
- **Remove** `> ${d('scroller', 'item')} { display: contents }` rule (lines 47-51) — the scroller item class and the row class are on the **same** `<tr>` element, and this child-combinator rule has higher specificity, which would override the row's new `display: grid`. Simply remove it; the row rule handles layout.
- **Remove** `grid-row-start: var(--row-index)` and `--row-index` from `${c('cell')}` rule — cells no longer set row position
- **Remove** `grid-row-start: var(--row-index)` and `--row-index` from `${c('group-header-cell')}` rule — the `<tr>` handles row placement now

TypeScript:
- `NgnTableBodyTr` already sets `[style.--ngn-table-row-index]` on its host — no change needed
- `NgnTableGroupHeaderTr` already sets `[style.--ngn-table-row-index]` on its host — no change needed
- `NgnTableHeadTr` — no TS change needed, `grid-row-start: 1` is a CSS rule

This change is backwards-compatible — subgrid rows behave identically to `display: contents` for non-sticky usage, just with an extra box in the tree.

### Sticky Column Registry

Table tracks sticky columns via a reactive signal:

```typescript
private readonly _stickyColumns = signal<ReadonlyMap<string, 'start' | 'end'>>(new Map());
```

Methods:
- `registerStickyColumn(columnId: string, side: 'start' | 'end')`: updates the map signal
- `unregisterStickyColumn(columnId: string)`: removes from map signal

Derived computeds:
- `_stickyStartColumns: computed<string[]>` — column IDs pinned to left, filtered to contiguous set from left edge, ordered by `_effectiveColumnOrder`
- `_stickyEndColumns: computed<string[]>` — column IDs pinned to right, filtered to contiguous set from right edge, ordered by `_effectiveColumnOrder`
- `_hasStickyColumns: computed<boolean>` — gate for the offset effect

### CSS Positioning

With the row layout change, `<table>` has `overflow: auto` and cells are grid items of rows that span the full width. `position: sticky; left/right: Xpx` works on individual cells within the table's scroll port.

Header cells only need `position: sticky` with a `left`/`right` offset. Vertical pinning of the header row is already achieved by `<thead>` being `position: sticky; top: 0` — do **not** add `top: 0` to individual header cells.

### Offset Computation

One `afterRenderEffect` in the table, **gated on `_hasStickyColumns`**:

1. Reads `_stickyStartColumns()` and `_stickyEndColumns()` (reactive dependencies)
2. Reads `_tableElementSize()` (triggers on container resize)
3. Reads `_resizeEngine.isDragging()` — if `true`, **skip** (avoids forced reflows during resize drag)
4. Measures sticky header cell widths via `getBoundingClientRect().width`
5. If selection column present, measures its width via `querySelector` + `getBoundingClientRect().width`
6. Sets CSS custom properties on `<table>` element:
   - `--ngn-sticky-start-offset-0: 0px` (or selection column width if present)
   - `--ngn-sticky-start-offset-1: 120px` (cumulative)
   - `--ngn-sticky-end-offset-0: 0px`
   - `--ngn-sticky-end-offset-1: 90px` (cumulative from right edge)

Effect triggers: `_stickyStartColumns` / `_stickyEndColumns` change, `_tableElementSize` change, or `_resizeEngine.isDragging()` transitions from `true` → `false` (drag ends).

### Cell Application

- `NgnTableTh` (header cell): when registered as sticky, applies theme classes `sticky-start`/`sticky-end` and `sticky-start-edge`/`sticky-end-edge` (for the last start / first end column). Sets `style.left` or `style.right` to the matching CSS var `var(--ngn-sticky-start-offset-N)` / `var(--ngn-sticky-end-offset-N)`.
- `NgnTableTd` (body cell): reads sticky info from table's `_stickyColumns` registry for its column ID, applies matching sticky class + offset var.
- Sticky index determined by position in the sorted sticky column list (derived from `_effectiveColumnOrder`).

### z-index Layering

| Element | z-index |
|---------|---------|
| Regular cells | auto |
| Sticky body cells | 1 |
| Header row | 2 (existing) |
| Sticky header cells | 3 |

## Visual Treatment

### Border (always visible)

- Last sticky-start cell per row: `border-right: 2px solid surface.200`
- First sticky-end cell per row: `border-left: 2px solid surface.200`
- Applied via theme classes `sticky-start-edge` and `sticky-end-edge`

### Shadow (scroll-driven)

- One `scroll` event listener on `<table>` element (cleanup via `abortSignalOnDestroy` from `@ngneers/controls/api/ng`)
- `scrollLeft > 0` → toggle class `sticky-scrolled-start` on table
- `scrollLeft < maxScroll - 1` → toggle class `sticky-scrolled-end` on table (1px tolerance for sub-pixel rounding on HiDPI)
- `maxScroll = scrollWidth - clientWidth`
- Edge cells get `box-shadow` for sticky shadow only when the corresponding scrolled class is present

### box-shadow conflict with focus indicator

The nova theme's existing focused-row indicator uses `box-shadow: inset 3px 0 0` on the first cell. Sticky-edge cells also use `box-shadow` for the scroll shadow. When both apply to the same cell, use comma-separated `box-shadow` to combine them:

```css
box-shadow: inset 3px 0 0 primary.500, 4px 0 8px rgba(0,0,0,0.1);
```

Implementation: the sticky scroll shadow is applied via a separate selector that uses CSS comma-separation to include both shadows when the focused-row condition is also met.

### Background

Sticky cells need explicit background so scrolling content doesn't show through:

- Body cells: `var(--ngn-cell-bg)` with fallback to `color.background`
- Header cells: already have `background: color.background` from nova theme

## Reorder Constraints

Sticky columns are reorderable only within their group. Bounds computed against the live `_effectiveColumnOrder` signal (visual order):

- Dragging a `start` column: drop target clamped to positions `0..N` (N = start sticky count)
- Dragging an `end` column: drop target clamped to positions `(total - M)..total` (M = end sticky count)
- Dragging a non-sticky column: drop target clamped to the middle range between sticky groups

Table exposes `getReorderBounds(columnId): { min: number, max: number }` as a method that reads from `_effectiveColumnOrder` reactively. `dragColumnReorder` clamps `targetIndex` to these bounds **before** setting `_reorderTargetIndex` and positioning the drop indicator, ensuring `endColumnReorder` can never insert outside the allowed range.

## File Changes

### New Files

| File | Purpose |
|------|---------|
| `packages/controls/src/table/table-sticky-column.ts` | `NgnTableStickyColumn` directive |
| `apps/docs/src/app/demos/table/sticky-columns.ts` | Demo component |
| `tests/components/table-sticky.test.ts` | Playwright e2e tests |

### Modified Files

| File | Change |
|------|--------|
| `packages/controls/src/table/table.ts` | `_stickyColumns` signal, register/unregister methods, `_stickyStartColumns`/`_stickyEndColumns` computeds, offset `afterRenderEffect`, scroll listener, `getReorderBounds`, reorder clamping in `dragColumnReorder` |
| `packages/controls/src/table/table-cell.ts` | Apply sticky class + offset var; remove `grid-row-start` from cell |
| `packages/controls/src/table/table-header-cell.ts` | Apply sticky class + offset var when registered as sticky |
| `packages/controls/src/table/module.ts` | Add `NgnTableStickyColumn` to imports/exports |
| `packages/controls/src/table/index.ts` | Export new directive |
| `packages/themes/src/templates/table/index.ts` | Add sticky class names |
| `packages/themes/src/base/table/index.ts` | Row layout change: rows to `display: grid; subgrid`, remove scroller-item `display: contents`, move `grid-row-start` from cells to rows, add `grid-row-start: 1` for head row, remove `grid-row-start` from group-header-cell. Sticky: position, z-index, selection column sticky |
| `packages/themes/src/nova/table/index.ts` | Border, shadow (with focus indicator combo), background for sticky cells |
| `apps/docs/src/app/docs/components/table/` | Docs page updates |

### Unmodified

- Resize engine — widths already tracked
- Reorder directive — bounds enforced by table, not by directive
- Sort/filter/grouping — orthogonal features
- `table-row.ts`, `table-header-row.ts`, `table-group-header-row.ts` — already set `--ngn-table-row-index` on host; no TS changes needed, row layout handled in CSS

## Theme Template Additions

New class names in `tableControlTemplate`:

- `sticky-start`
- `sticky-end`
- `sticky-start-edge`
- `sticky-end-edge`
- `sticky-scrolled-start`
- `sticky-scrolled-end`

## Test Plan

1. **Existing features regression** — all current tests pass with row layout change (subgrid rows)
2. Sticky columns stay in place during horizontal scroll (start and end)
3. Selection column always sticky
4. Shadow appears only when content scrolled behind
5. Shadow disappears when scrolled back to edge (with HiDPI tolerance)
6. Border always visible on sticky edge
7. Reorder within sticky group works
8. Reorder across sticky/non-sticky boundary prevented
9. Non-sticky columns cannot be dropped into sticky zone
10. Resize works with sticky columns (offsets update after drag ends)
11. Sorting/filtering/grouping unaffected by sticky
12. Correct z-index layering (sticky header > sticky body > regular)
13. Contiguity validation — non-contiguous sticky ignored
14. Works with virtual scrolling (cells apply sticky on mount)
15. Sticky + selection column offsets correct
16. Striped/selected row backgrounds render correctly on sticky cells
17. Focus indicator + sticky shadow combine correctly (comma-separated box-shadow)
