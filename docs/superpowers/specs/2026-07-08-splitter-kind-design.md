# Splitter kinds — default / thin / invisible

_Design spec — 2026-07-08_

## Goal

Add three divider appearances to `NgnSplitter` via the library's existing **kind**
theme pattern (`NgnBase.kind`), styled in both full themes (`nova`, `shade`) with shared
structure in `base`:

- **`default`** — current styling, unchanged.
- **`thin`** — a 1px always-visible line that expands visually on hover/focus/drag.
- **`invisible`** — a 0px line at rest (no splitter-drawn seam); expands the same way
  on hover/focus/drag. The consumer styles their own seam between panels.

Hard requirement for `thin` and `invisible`: the grab/hover area is larger than the
visible line, and the visual expansion must **not** shift surrounding content — the
divider grid track stays 1px (thin) / 0px (invisible) even while the handle appears
wider.

## Approach: theme kinds, not a new input

This is a pure styling variant, so it rides the existing kind system — no new control
API and no calculator changes. Confirmed mechanics:

- Every control already exposes `kind` (`NgnBase.kind`, `packages/controls/src/base/base.ts:97`).
- `appliedKind = kindOverride ?? kind ?? defaultKind`, where `defaultKind` is the first
  kind the active theme declares (`base.ts:100`, `base.ts:309`).
- `initializeAutoThemeClasses('kind', appliedKind)` auto-toggles a `kind-<value>` class
  on the host element (`base.ts:345`).
- Templates opt in with a `kind-*` wildcard className (see `templates/button/index.ts`).
- `CustomKind<'splitter'>` is derived from each theme's exported `KINDS` const via the
  `theme-types.d.ts` module augmentation (`packages/themes/src/shade/theme-types.d.ts`).

Aligns with CLAUDE.md ("all styling flows through the theme system") and matches
button / tag / message / hint.

## The no-shift mechanic (crux)

The splitter sizes each divider grid track from the divider root element's measured
`offsetWidth` / `offsetHeight` (`DefaultSplitterCalculator.dividerSizes`,
`packages/controls/src/splitter/splitter-calculator.ts:177`), feeding those measured
sizes back into `grid-template-columns` / `grid-template-rows`.

Consequence: **any visual expansion must not change the divider root's offset size**, or
the track grows and content shifts. Expressible entirely in CSS:

- **`kind-default`** — unchanged. Handle in normal flow at `0.25rem`; divider root wraps
  it → track `0.25rem`. Stable.
- **`kind-thin`** — divider root gets an explicit fixed cross-size of `1px` (the visible
  line). The handle button is taken **out of flow** (`position: absolute`, centered, root
  `overflow: visible`), forming the ~8px grab zone and the hover visual. Because it is
  absolute it never affects the root's offset size → track stays `1px`. No content shift.
- **`kind-invisible`** — identical to `kind-thin` but root cross-size `0px` and no line
  background at rest.

No changes to `NgnSplitter`, the calculator, or resize logic are required.

## Control template — `packages/themes/src/templates/splitter/index.ts`

Add `'kind-*'` to the `classNames` array (the only source change outside themes/docs).
Existing entries stay: `root, horizontal, vertical, panel, divider, divider-handle,
dragging, divider-dragging`.

## Theme meta — declare the kinds (drives type + default + enumeration)

Add a `splitter` entry to each full theme's `KINDS` const. `default` must be **first**
so it becomes the applied default for splitters that set no `kind`.

- `packages/themes/src/nova/index.ts` (`KINDS`, ~line 58)
- `packages/themes/src/shade/index.ts` (`KINDS`)

```ts
splitter: ['default', 'thin', 'invisible'] as const,
```

This simultaneously: (a) types `CustomKind<'splitter'>`, (b) sets the default kind, and
(c) lists kinds in `meta.kinds` for enumeration (e.g. docs playground). `base` has no
`KINDS` meta and needs none — it only supplies structural CSS.

## base theme (structural) — `packages/themes/src/base/splitter/index.ts`

Add structural rules shared by the full themes, scoped by kind + layout:

- `kind-thin` / `kind-invisible`: divider root explicit cross-size (`1px` / `0px`) for the
  active layout; `overflow: visible`; handle `position: absolute`, centered on the root,
  spanning an ~8px grab zone (≈ 3.5px each side of the line) along the cross axis and full
  length along the main axis.
- The centered visual bar (the growing part) is out of flow and animates its cross-size
  `1px`/`0px` → `0.25rem` on hover/focus/active — track untouched.
- Keep the existing coarse-pointer `::before` grab expansion for all kinds.
- `kind-default` reproduces today's structure (handle in flow at `0.25rem`). Preferably
  leave the current root sizing as-is and let `kind-thin`/`kind-invisible` override, so
  existing splitters that now resolve to `kind-default` render identically — verify no
  visual regression.

## nova + shade themes (colors)

- `packages/themes/src/nova/splitter/index.ts`
- `packages/themes/src/shade/splitter/index.ts`

Each adds, for `kind-thin` / `kind-invisible`:

- Resting 1px line color (thin only) from the theme palette (nova: surface shade; shade:
  `color.border`).
- Expanded-bar color for hover / focus / active reusing each theme's existing handle
  palette (nova: surface.200/300/400; shade: accent/ring).
- `transition: ~0.15s ease` on the expanding visual (matches shade's existing handle
  transition).

`kind-default` keeps the current per-theme handle colors.

## invisible seam

Docs-only. The splitter draws nothing at rest in `invisible` mode; consumers add their
own border/shadow to panel content or via `ptClass`. No new CSS variable or API.

## Motion

Expansion animates (~0.15s ease). Applies to hover, focus, and active/drag; the bar stays
expanded for the duration of focus and drag, not only hover.

## Rest of anatomy (per CLAUDE.md)

- **Tests** — `tests/components/splitter.test.ts` (+ snapshot dir): the three kinds
  render (assert `kind-*` class), and the grid track size is unaffected by hover
  expansion for `thin`/`invisible`.
- **Docs** — `apps/docs/src/app/docs/components/splitter/`: document `kind` in `api.md`;
  add a `kind` control to `playground.ts` (enumerated from `meta.kinds`).
- **Demos** — `apps/docs/src/app/demos/splitter/`: a scenario showcasing the three kinds,
  including an `invisible` example with a consumer-drawn seam.
- Run `pnpm prettier --write` over changed files after edits.

## Out of scope

- Per-divider kind selection (kind is splitter-wide, as with all controls).
- A CSS variable API for the invisible seam.
- Any change to `NgnSplitter`, the calculator, resize logic, or state persistence
  (expected: none).

## Migration note

Introducing splitter kinds means `appliedKind` resolves to `default` for every existing
splitter, so each now carries a `kind-default` class. `kind-default` must reproduce the
current look exactly — no consumer action required.
