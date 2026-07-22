# Design: rating · stepper · badge · color-picker

**Date:** 2026-07-22
**Status:** Approved (brainstorm)
**Scope:** Four new controls for `@ngneers/controls`, one combined spec, split into
separate implementation plans so each ships independently.

## Goal

Add four commonly-requested controls that currently have no substitute in the
library: an interactive **rating**, a **stepper/wizard**, a **badge** overlay,
and a full-custom **color-picker**. Each ships the complete 7-part control
anatomy.

## Shared conventions

Every control adheres to the repo conventions (see `CLAUDE.md`):

- Full 7-part anatomy each: control source (`packages/controls/src/{name}/`),
  theme template (`packages/themes/src/templates/{name}/`), base theme
  (`packages/themes/src/base/{name}/`), nova theme
  (`packages/themes/src/nova/{name}/`), tests (`tests/components/{name}.test.ts`),
  docs page (`apps/docs/src/app/docs/components/{name}/`), demos
  (`apps/docs/src/app/demos/{name}/`).
- Value controls extend `ValueControlBase<'scope', T>` with `provideSelf`;
  structural/presentational controls extend `NgnBase`.
- Controls that expose template/`contentChild` projection inputs extract a
  `{Name}Templates` base class; the component `extends {Name}Templates`. Controls
  without projection inputs stay flat and call `injectThemeTemplate` inline.
- Icon inputs use the `icon` prefix; boolean inputs use
  `input(false, { transform: booleanAttribute })`; directive inputs expose a
  `ngn`-prefixed alias.
- TSDoc on every `input()`/`model()`/`output()`. `@default` unquoted.
- No component-level CSS — all styling flows through the theme system via
  `injectThemeTemplate`.
- New theme parts need empty `package.json` markers and a
  `pnpm --filter @ngneers/controls-themes build` before e2e (Node resolves themes
  from `dist`).

### Reused primitives (do not reinvent)

- `NgnDrag` (`directives/drag`) — pointer/drag math for rating drag, color-picker
  SV area + hue + alpha tracks.
- `popover` — color-picker trigger panel.
- `ngn-defer` — stepper per-step content (lazy/cache/hidden-when-closed).
- `roving-focus` — stepper header arrow-key navigation.
- `ngn-input` / `ngn-number-input` — color-picker hex/numeric fields.
- `ngn-icon` — all icon rendering.

### New shared code

- `packages/controls/src/utils/color.ts` — color parse/convert
  (hex ↔ rgb ↔ hsl ↔ hsv, with alpha). Consumed by color-picker. Ships one
  runnable self-check (`color.spec.ts`).
- Internal `NgnBadgeIndicator` component — the themed overlay the `ngnBadge`
  directive injects. **Not** publicly exported; lives in the `badge` folder.

---

## 1. `ngn-rating`

`export class NgnRating extends RatingTemplates` where
`RatingTemplates extends ValueControlBase<'rating', number>` (has a template
projection input, so a templates base class is extracted).

Value is a `number` in `0..count`. Interaction follows the slider family
(arbitrary step, arrow keys, hover preview).

### Inputs / model

| Member                      | Type                                         | Default      | Notes                                                                       |
| --------------------------- | -------------------------------------------- | ------------ | --------------------------------------------------------------------------- |
| `value`                     | `model<number>`                              | `0`          | inherited via base; range `0..count`                                        |
| `count`                     | `input<number>`                              | `5`          | number of symbols                                                           |
| `step`                      | `input<number>`                              | `1`          | arbitrary granularity; snaps value; partial fill via width-clip             |
| `iconFull`                  | `input<IconType>`                            | star         | filled symbol                                                               |
| `iconEmpty`                 | `input<IconType>`                            | star-outline | empty symbol                                                                |
| `indicatorTemplate`         | `input<TemplateRef<RatingIndicatorContext>>` | —            | custom per-symbol template; when set, replaces default full/empty rendering |
| `clearable`                 | `input(boolean)`                             | `true`       | click current value → resets to `0`                                         |
| `readonly`                  | `input(boolean)`                             | `false`      | display only                                                                |
| `disabled`                  | `input(boolean)`                             | `false`      |                                                                             |
| `label` / `labelledBy`      | `input<string>`                              | —            | a11y                                                                        |
| `valueText` / `valueTextFn` |                                              | —            | a11y value text, same contract as slider                                    |

```ts
interface RatingIndicatorContext {
  /** Fill ratio for this symbol, 0..1. */
  $implicit: number;
  /** Zero-based symbol index. */
  index: number;
}
```

### Behavior

- **Host:** `role="slider"`, `aria-valuemin=0`, `aria-valuemax=count`,
  `aria-valuenow=value`, `aria-valuetext`, `aria-readonly`, `tabindex`
  (`-1` when disabled). `blur` → `markTouched()`.
- **Keyboard:** ←/→ adjust by `step`, Home → `0`, End → `count`.
- **Pointer:** hover previews the value under the cursor (resolved to nearest
  `step`); click commits. `clearable` → clicking the current value resets to `0`.
- **Partial fill:** each symbol computes a ratio `0..1`. Default rendering layers
  `iconFull` clipped by `ratio * 100%` width over `iconEmpty`. When
  `indicatorTemplate` is set, it is rendered per symbol with the ratio + index
  context instead.
- **ponytail:** ship click + hover first; drag-to-set via `NgnDrag` is a small
  follow-up if desired (not in the first plan).

### Theme parts

`root`, `symbol`, `full` (clip layer), `empty`, plus `invalid`, `readonly`,
`disabled` state classes.

---

## 2. `ngn-stepper` + `ngn-step`

Structural pair, both `extends NgnBase`. Horizontal orientation only.

- `NgnStepper extends NgnBase<'stepper'>` — owns `active = model<number>(0)`,
  reads `NgnStep` children via `contentChildren`.
- `NgnStep extends NgnBase<'step'>` — declares one step's header metadata and
  projects its content.

### Stepper inputs / model / methods

| Member        | Type             | Default | Notes                                                                         |
| ------------- | ---------------- | ------- | ----------------------------------------------------------------------------- |
| `active`      | `model<number>`  | `0`     | active step index                                                             |
| `linear`      | `input(boolean)` | `false` | gate forward nav on prior steps' `completed`                                  |
| `lazy`        | `input(boolean)` | `true`  | forwarded to each step's `ngn-defer`                                          |
| `cache`       | `input(boolean)` | `true`  | forwarded to `ngn-defer`; `true` preserves step content/form state across nav |
| `next()`      | method           |         | advance if allowed                                                            |
| `previous()`  | method           |         | go back                                                                       |
| `goTo(index)` | method           |         | jump if allowed (respects `linear` + `completed`)                             |

### Step inputs

| Member      | Type              | Default | Notes                                                |
| ----------- | ----------------- | ------- | ---------------------------------------------------- |
| `label`     | `input<string>`   | —       | header label                                         |
| `iconStep`  | `input<IconType>` | —       | custom header marker icon (else index number)        |
| `optional`  | `input(boolean)`  | `false` | renders an "optional" hint; skippable in linear mode |
| `completed` | `model<boolean>`  | `false` | app sets when the step is done; gates linear nav     |
| `disabled`  | `input(boolean)`  | `false` |                                                      |
| `error`     | `input(boolean)`  | `false` | error state on the marker                            |

### Behavior

- **Layout:** header row (clickable markers + connector lines) above a single
  content panel that shows the active step.
- **Content:** each step's projected content is wrapped in
  `ngn-defer [open]="i === active()" [lazy]="lazy()" [cache]="cache()"`. With
  `cache=true`, once a step is opened its content stays in the DOM (hidden when
  inactive) so form state and scroll survive navigation.
- **Gating:** `goTo`/header-click/`next` are allowed when not `linear`, or when
  the target is `<= ` the first non-completed step (can't skip ahead past an
  incomplete required step). `optional` steps don't block progression.
- **a11y:** header markers are `<button>`s with `aria-current="step"` on the
  active one and `aria-disabled` when gated. `roving-focus` handles arrow-key
  movement across the header.
- **States:** active / completed / error / disabled / optional.

### Theme parts

`root`, `header`, `marker`, `marker-number`, `marker-icon`, `connector`,
`label`, `optional`, `content`, plus state classes
`active` / `completed` / `error` / `disabled`.

---

## 3. `[ngnBadge]` directive + internal `NgnBadgeIndicator`

Attribute directive applied to any host element (icon, button, avatar…). Injects
a themed `NgnBadgeIndicator` component via `ViewContainerRef` so all styling stays
in the theme system. Sets the host to `position: relative` when it is currently
`static`.

### Directive inputs (all `ngn`-aliased)

| Property → alias                | Type                                                         | Default     | Notes                                                                                  |
| ------------------------------- | ------------------------------------------------------------ | ----------- | -------------------------------------------------------------------------------------- |
| `value` → `ngnBadge`            | `number \| string \| undefined`                              | —           | badge content (primary input)                                                          |
| `max` → `ngnBadgeMax`           | `number`                                                     | —           | clamp numeric value → `"{max}+"`                                                       |
| `dot` → `ngnBadgeDot`           | `boolean`                                                    | `false`     | dot mode, ignores `value`                                                              |
| `showZero` → `ngnBadgeShowZero` | `boolean`                                                    | `false`     | render badge when value is `0`                                                         |
| `position` → `ngnBadgePosition` | `'top-end' \| 'top-start' \| 'bottom-end' \| 'bottom-start'` | `'top-end'` | corner                                                                                 |
| `color` → `ngnBadgeColor`       | `string`                                                     | —           | raw hex/rgb **or** `var(--x)`; sets `--ngn-badge-color` custom prop the theme consumes |
| `hidden` → `ngnBadgeHidden`     | `boolean`                                                    | `false`     | hide without removing the anchor                                                       |

### Behavior

- The directive creates/updates/destroys the indicator component reactively from
  its inputs. When `dot` is false and (`value` is empty and not `showZero`) or
  `hidden`, no indicator is shown.
- Numeric `value` above `max` renders `"{max}+"`.
- `color` is written as a CSS custom property `--ngn-badge-color` on the
  indicator; the theme's default background falls back to a themed color when the
  property is unset. Accepts any CSS color token, including `var(...)` references.

### Theme parts

`root` (indicator), `dot`, position classes
(`top-end` / `top-start` / `bottom-end` / `bottom-start`).

---

## 4. `ngn-color-picker`

`export class NgnColorPicker extends ColorPickerTemplates` where
`ColorPickerTemplates extends ValueControlBase<'color-picker', string>`.

Value is a color **string**. Full-custom panel. Two presentations: default
popover trigger, and `inline`.

### Inputs / model

| Member                 | Type                             | Default | Notes                                                       |
| ---------------------- | -------------------------------- | ------- | ----------------------------------------------------------- |
| `value`                | `model<string>`                  | —       | color string in the active `format`; `hex8`/`rgba` when α<1 |
| `format`               | `input<'hex' \| 'rgb' \| 'hsl'>` | `'hex'` | output + display format; cycled by in-panel toggle          |
| `alpha`                | `input(boolean)`                 | `true`  | show alpha slider; drop alpha channel when `false`          |
| `swatches`             | `input<string[]>`                | —       | preset palette row                                          |
| `inline`               | `input(boolean)`                 | `false` | render panel in place vs popover trigger                    |
| `readonly`             | `input(boolean)`                 | `false` |                                                             |
| `disabled`             | `input(boolean)`                 | `false` |                                                             |
| `label` / `labelledBy` | `input<string>`                  | —       | a11y                                                        |

### Panel anatomy

- **Saturation/Value area** — 2D drag surface (`NgnDrag`): x = saturation,
  y = value. Thumb positioned from HSVA state.
- **Hue track** — horizontal `NgnDrag` track over a hue gradient, `0..360`.
- **Alpha track** (when `alpha`) — `NgnDrag` track over a checkerboard +
  color→transparent gradient.
- **Format toggle + fields** — cycles `hex/rgb/hsl`; hex field uses `ngn-input`,
  channel fields use `ngn-number-input`.
- **Swatches** — clickable preset row from `swatches`.
- **Preview** — current color chip.

### Behavior

- **Internal model:** HSVA held in signals as the source of truth; converts
  to/from the `value` string via `utils/color.ts` on I/O and on format change.
- **Trigger (non-inline):** a themed swatch button shows the current color and
  opens the panel in a `popover`. Inline mode renders the panel directly with no
  trigger.
- **a11y:** SV area and tracks expose `role="slider"` semantics with
  keyboard adjustment; trigger has `aria-haspopup`/`aria-expanded`.
- **ponytail:** skip the EyeDropper API and multi-stop gradients; add later if
  requested.

### Theme parts

`trigger`, `panel`, `sv-area`, `sv-thumb`, `hue-track`, `hue-thumb`,
`alpha-track`, `alpha-thumb`, `swatches`, `swatch`, `preview`, `fields`, plus
`invalid` / `readonly` / `disabled` states.

---

## Implementation order

Four independent plans, simplest → most complex:

1. **badge** — smallest; directive + internal indicator + theme.
2. **rating** — value control, slider-like, template projection.
3. **stepper** — structural pair, reuses `ngn-defer` + `roving-focus`.
4. **color-picker** — largest; new `utils/color.ts` + multi-surface panel.

## Testing

- Vitest + Angular TestBed per control in `tests/components/`.
- `utils/color.ts` gets a focused `color.spec.ts` round-trip assertion set
  (parse → convert → format is stable across hex/rgb/hsl/hsv, with and without
  alpha).
- Playwright e2e for interaction (rating hover/keyboard, stepper gating,
  color-picker drag) after theme build.

## Non-goals (YAGNI)

- Rating drag-to-set (follow-up), vertical stepper, color-picker EyeDropper /
  gradient stops, badge non-corner positioning and shape-aware overlap.
