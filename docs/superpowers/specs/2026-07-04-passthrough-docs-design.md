# Passthrough Concept Docs — Design

**Date:** 2026-07-04
**Scope:** Fill the scaffolded `concepts/pt` docs page with content covering all four passthrough mechanics, using the inline `ngn-calendar` as the single running example.

## Goal

Teach a library consumer how to use the `pt` (passthrough) input to reach into a control's
internal theme scopes and apply `$styles`, `$attributes`, `$classes`, and `$listeners` —
without `::ng-deep`, global CSS, or forking the theme. Every scope is fully typed.

## Why the inline calendar

- Inline mode (`[inline]="true"`) renders the full grid immediately — no popover interaction
  needed before an effect is visible.
- The calendar composes several nested `ngn` controls (nav `ngnButton`, month/year
  `ngn-select` inside `ngn-input-field`, `ngn-input-mask`, trigger icon), so it demonstrates
  the "reach into nested controls" story on a single control.
- Rich own-scope surface: `root`, `inline`, `header`, `navigation`, `days`, `week-day`,
  `day`, `day-selected`, `day-today`, `day-other-month`, `previous`, `next`,
  `current-month`, `current-year`, `time`, `trigger-icon`, `input`.

## How passthrough actually works (verified against source)

- `NgnBase.pt` is `input<NgnPassthrough<T>>()`. `NgnPtEngine` (created per `[ptInt]`/host)
  resolves **flat, top-level scope-class keys** against the control's applied classes
  (`getAppliedClasses` → `getPropertyIfExists(pt, className)`), then applies the
  `PassthroughValue` to that element.
- `PassthroughValue = { $styles?, $attributes?, $classes?, $listeners? }`.
  - `$styles`: `Partial<CSSStyleDeclaration>` — set inline; cleared to `''` on removal.
  - `$attributes`: `Record<string, string>` — static strings; `setAttribute` / `removeAttribute`.
  - `$classes`: `string | string[]` — space-split, `classList.add` / `.remove`.
  - `$listeners`: `Partial<EventListenerMap>` — raw `addEventListener` /
    `removeEventListener`. (Newly added; see uncommitted change to `pt-engine.ts` + `types.ts`.)
- Values are applied and **cleared reactively** when the `pt` object changes
  (`effectWithPrevious`): the previous value's styles/attrs/classes/listeners are removed
  before the new ones are applied.

### Nested controls — the real mechanism

The calendar exposes its nested `ngn` controls through its **own curated scope classes**,
wired internally with `[ptInt]="this"`:

| Nested ngn control                         | Reach via calendar scope class |
| ------------------------------------------ | ------------------------------ |
| prev / next nav `ngnButton`                | `previous`, `next`             |
| month `ngn-select` (in `ngn-input-field`)  | `current-month`                |
| year `ngn-select` (in `ngn-input-field`)   | `current-year`                 |
| trigger icon / popup input                 | `trigger-icon`, `input`        |

**`$deps` is intentionally omitted from the docs.** The `NgnPassthrough` type exposes a
`$deps` key (recursive, keyed by dependency scope), but it has **no runtime consumer**
anywhere in the codebase — the engine only reads flat keys. Documenting the working
mechanism (named scope classes) avoids teaching a no-op.

## Page structure — one page, 6 sections

`kind: 'single'`, `mdFile: 'concepts/pt/index.md'`. Prose + `{{ demo: X }}` blocks
(each renders a live inline calendar and shows its source). Running scenario: a
booking/scheduling app branding the inline calendar.

1. **Introduction** (prose only) — what passthrough is; the `PassthroughValue` shape;
   typed scope-class targeting; when to use `pt` vs `templated` / custom theme / `unstyled`;
   the add/remove-on-change lifecycle.
2. **Styles** → `Demo_Pt_Styles` — brand `day-selected` (pill shape, primary bg/fg) and
   enlarge `day` cells for a touch booking UI.
3. **Attributes** → `Demo_Pt_Attributes` — `data-testid` on `root` for e2e; `data-*` hook on
   `day-today`. Static strings only.
4. **Classes** → `Demo_Pt_Classes` — Tailwind utilities on `header` (rounded top, surface bg,
   shadow) and a `ring` on `root`; no theme edit.
5. **Listeners** → `Demo_Pt_Listeners` — click listeners on `next` / `previous` feeding a live
   counter shown in the demo. Caveat noted: raw `addEventListener`, stable handler refs for
   clean removal on `pt` change.
6. **Reaching nested controls** → `Demo_Pt_Nested` — restyle the prev/next nav **buttons**
   (`previous` / `next`) and the month/year **select** triggers (`current-month` /
   `current-year`); explain the flatten-to-scope-classes model. Two levels (button + select).

## Files

**Create** — `apps/docs/src/app/demos/pt/`:
`styles.ts`, `attributes.ts`, `classes.ts`, `listeners.ts`, `nested.ts` (standalone
components `Demo_Pt_Styles`, `Demo_Pt_Attributes`, `Demo_Pt_Classes`, `Demo_Pt_Listeners`,
`Demo_Pt_Nested`), each a self-contained inline `ngn-calendar` with a typed
`pt: NgnPassthrough<'calendar'>`. Follow the existing `demos/calendar/*` component style.

**Modify:**
- `apps/docs/src/app/docs/concepts/pt/index.md` — replace `{{ component: NgnPt1 }}` with the
  6 sections (prose + `{{ demo: }}` blocks).
- `apps/docs/src/app/docs/concepts/pt/page.ts` — import the 5 demo components, list them in
  `components: [...]`, drop `NgnPt1`.

**Remove/repurpose:** `apps/docs/src/app/page-components/pt1.ts` (`NgnPt1`) — the empty
skeleton is superseded by the demo components. Delete its import from `page.ts`. Confirm no
other references before deleting the file.

## Conventions

- Angular signals API, `ngn` selectors, `NgnPassthrough<'calendar'>` typing for every `pt`.
- No component CSS; styling flows through `pt` values (that's the point) or Tailwind utilities.
- `pnpm prettier --write` over changed files.
- Verify with `pnpm docs:build` + browser tools (dev server already on 4200); do not spawn/kill servers.

## Out of scope

- Wiring `$deps` at runtime (separate feature).
- Changes to the passthrough engine beyond what's already staged.
- Docs for other controls' passthrough surfaces.
