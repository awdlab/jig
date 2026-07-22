# Rating · Stepper · Badge · Color-picker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add four new controls to `@ngneers/controls` — `[ngnBadge]`, `ngn-rating`, `ngn-stepper`/`ngn-step`, and `ngn-color-picker` — each with the full control anatomy (source, theme trio, harness, tests, docs, demos).

**Architecture:** Value controls (`rating`, `color-picker`) extend `ValueControlBase<'scope', T>`; the structural stepper pair and each child extend `NgnBase`; badge is an attribute directive that imperatively injects an internal themed indicator component. Everything reuses existing primitives — `NgnDrag`, `ngn-defer`, `ngnRovingGroup`/`ngnRovingItem`, `popover`, `ngn-input`/`ngn-number-input`, `ngn-icon` — and the theme system (`createControlTemplate` + `createThemePart`), with a new `utils/color.ts` for color math.

**Tech Stack:** Angular 21 (zoneless, signals API), strict TypeScript, pnpm monorepo, Tailwind in templates, the `@ngneers/controls-themes` theme engine, Playwright + harnesses for tests, oxfmt/Prettier formatting.

## Global Constraints

- Angular signals API only: `input()`, `model()`, `computed()`, `signal()`, `output()`, `contentChildren()`, `viewChild()`. **Never** `@Input()`/`@Output()` decorators.
- Boolean inputs: `input(false, { transform: booleanAttribute })`.
- Icon inputs: `icon`-prefixed (`iconFull`, `iconEmpty`, `iconStep`, …), typed `input<IconType>()` from `@ngneers/controls-custom-types`.
- Directive inputs: public alias `ngn{Directive}{PascalCaseProp}`, exactly the selector or selector+PascalCase(property).
- Every `input()`/`model()`/`output()` gets a 1–2 sentence TSDoc; `@default <value>` **unquoted**.
- No component-level CSS/SCSS — all styling flows through the theme system via `injectThemeTemplate`. (`NgnDefer`'s tiny `:host.hidden` style block is the only sanctioned exception pattern, already in the repo.)
- Value controls map their theme `invalid` part (and `aria-invalid`) to `this.invalidState()`, **never** raw `invalid()`.
- Value controls call `markTouched()` on blur.
- Selector prefix `ngn`; folder name == kebab element selector.
- 2-space indent, single quotes. Run `pnpm format` over changed files after each task (oxfmt for `.ts`/`.json`/`.md`, Prettier for `.html`).
- Controls are **secondary entrypoints**: a new control folder needs `index.ts` + `ng-package.json` (`{ "$schema": "../../node_modules/ng-packagr/ng-package.schema.json", "lib": { "entryFile": "index.ts" } }`) + empty `package.json` (`{}`). There is no central controls barrel.
- New theme parts need empty `package.json` markers in each of `templates/`, `base/`, `nova/` and must be registered in the three theme barrels; run `pnpm --filter @ngneers/controls-themes build` before e2e (Node resolves themes from `dist`).
- Tests are **Playwright** (harness + `loadComponent`), not Vitest/TestBed — except pure-function utils, which use `*.spec.ts`.
- Do **not** commit automatically unless the executor's workflow says to; leave files staged/uncommitted per repo preference. (The commit steps below are written for completeness; follow the active execution skill's commit policy.)

---

## Shared Anatomy Checklist (applies to every control)

Each control touches these locations. Referenced by task blocks as "the anatomy checklist".

1. **Control source:** `packages/controls/src/{name}/` — `{name}.ts`, `{name}.html` (if not inline), `index.ts`, `ng-package.json`, `package.json`.
2. **Theme template:** `packages/themes/src/templates/{name}/index.ts` + `package.json` `{}`; register in `packages/themes/src/templates/index.ts` (add `{name}: Awaited<typeof import('./{name}')>['{name}ControlTemplate'];` to the `ThemeTemplate` map).
3. **Base theme:** `packages/themes/src/base/{name}/index.ts` + `package.json` `{}`; register in `packages/themes/src/base/index.ts` (import `{name}Styles`, add `{name}: {name}Styles,` to the map).
4. **Nova theme:** `packages/themes/src/nova/{name}/index.ts` + `package.json` `{}`; register in `packages/themes/src/nova/index.ts` (import `{name}Styles`, add `{name}Styles,` to the styles array).
   4b. **Shade theme:** `packages/themes/src/shade/{name}/index.ts` + `package.json` `{}`; register in `packages/themes/src/shade/index.ts` (import `{name}Styles`, add `{name}Styles,` to the `createTheme('Shade', [...])` array). The shade part mirrors the nova part's structure but imports from `@ngneers/controls-themes/shade/base` and uses shade's token vocabulary — model it on a sibling shade part (`packages/themes/src/shade/slider/index.ts` or `.../tag/index.ts`) for the exact token names: shade uses `color.muted.base`, `color.primary.base`, `color.destructive.base`, `color.background`, `color.ring`, `color.foreground`, `shadow.*` (NOT nova's `color.surface.N` / `color.primary.500` / `color.error.500`). None of these 4 controls expose `kind`/`color`, so no `KINDS`/`COLORS` map entries are needed.
5. **Harness:** `packages/playwright/src/components/{name}.ts`; export from `packages/playwright/src/components/index.ts`.
6. **Test-wrapper registration:** add to `apps/test-wrapper/src/app/imports.ts` map: `{name}: () => import('@ngneers/controls/{name}').then(m => m.NgnX),`.
7. **Tests:** `tests/components/{name}.test.ts`.
8. **Docs page:** `apps/docs/src/app/docs/components/{name}/` — `page.ts`, `index.md`, `api.md`, `a11y.md`, `playground.ts`; register in `apps/docs/src/app/docs/components/index.ts` (import `{X}Page`, add to the pages array).
9. **Demos:** `apps/docs/src/app/demos/{name}/*.ts`.

> Directives (badge) live under `packages/controls/src/directives/` and are exported from `directives/index.ts` — they do NOT get their own entrypoint folder. The badge's **indicator** is a normal control folder with theme parts.

---

# Phase 1 — Badge

`[ngnBadge]` attribute directive overlays an internal `NgnBadgeIndicator` component onto its host, following the `spinner-creator` injection pattern (`ViewContainerRef.createComponent` + `host.appendChild(ref.location.nativeElement)` + `setComponentInput` + `DestroyRef` cleanup). The indicator owns the theme; the directive owns placement and reactive inputs. Color is passed as a CSS custom property so any hex/rgb/`var()` value works.

**File structure:**

- `packages/controls/src/badge/badge-indicator.ts` — internal component (theme owner).
- `packages/controls/src/badge/badge-indicator.html` — indicator template.
- `packages/controls/src/badge/badge.ts` — the `[ngnBadge]` directive.
- `packages/controls/src/badge/index.ts` — exports `NgnBadge` only (indicator stays internal but must be importable by the directive; export it too so ng-packagr compiles it, but document it as internal).
- `packages/controls/src/badge/ng-package.json`, `package.json`.
- Register `NgnBadge` in `packages/controls/src/directives/index.ts` re-export? **No** — badge is its own entrypoint `@ngneers/controls/badge`. Follow the entrypoint pattern, not the directives folder.
- Theme trio for scope `badge`.

### Task B1: Badge theme trio + indicator component

**Files:**

- Create: `packages/themes/src/templates/badge/index.ts`, `packages/themes/src/templates/badge/package.json`
- Create: `packages/themes/src/base/badge/index.ts`, `packages/themes/src/base/badge/package.json`
- Create: `packages/themes/src/nova/badge/index.ts`, `packages/themes/src/nova/badge/package.json`
- Modify: `packages/themes/src/templates/index.ts`, `packages/themes/src/base/index.ts`, `packages/themes/src/nova/index.ts`
- Create: `packages/controls/src/badge/badge-indicator.ts`, `packages/controls/src/badge/badge-indicator.html`

**Interfaces:**

- Produces: `badgeControlTemplate` (scope `'badge'`, classNames `['root', 'dot', 'top-end', 'top-start', 'bottom-end', 'bottom-start']`); `NgnBadgeIndicator` component with inputs `text: string`, `dot: boolean`, `position: BadgePosition`, `color: string | undefined`.
- Consumed by: Task B2 (directive sets these inputs via `setComponentInput`).

- [ ] **Step 1: Theme template scope**

`packages/themes/src/templates/badge/index.ts`:

```ts
import { createControlTemplate } from '@ngneers/controls-themes/api';

export const badgeControlTemplate = createControlTemplate({
  scope: 'badge',
  classNames: ['root', 'dot', 'top-end', 'top-start', 'bottom-end', 'bottom-start'],
});
```

`packages/themes/src/templates/badge/package.json`: `{}`

- [ ] **Step 2: Base theme (structural)**

`packages/themes/src/base/badge/index.ts`:

```ts
import { createThemePart, css } from '@ngneers/controls-themes/api';
import { badgeControlTemplate } from '@ngneers/controls-themes/templates/badge';

export const badgeStyles = createThemePart({
  controlTemplate: badgeControlTemplate,
  dependencies: [],
  root: {
    css: ({ c }) => css`
      ${c('root')} {
        position: absolute;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        box-sizing: border-box;
        z-index: 1;
      }
      ${c('top-end')} {
        top: 0;
        inset-inline-end: 0;
        transform: translate(50%, -50%);
      }
      ${c('top-start')} {
        top: 0;
        inset-inline-start: 0;
        transform: translate(-50%, -50%);
      }
      ${c('bottom-end')} {
        bottom: 0;
        inset-inline-end: 0;
        transform: translate(50%, 50%);
      }
      ${c('bottom-start')} {
        bottom: 0;
        inset-inline-start: 0;
        transform: translate(-50%, 50%);
      }
    `,
  },
});
```

`packages/themes/src/base/badge/package.json`: `{}`

- [ ] **Step 3: Nova theme (full styling)**

`packages/themes/src/nova/badge/index.ts`:

```ts
import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { badgeControlTemplate } from '@ngneers/controls-themes/templates/badge';

export const badgeStyles = createThemePart({
  controlTemplate: badgeControlTemplate,
  base: baseStyles.badge,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    // --ngn-badge-color is set by the directive; falls back to the primary color.
    css: ({ v, c }) => css`
      ${c('root')} {
        min-width: 1.25rem;
        height: 1.25rem;
        padding: 0 0.375rem;
        border-radius: ${v('size.rounded.full')};
        background: var(--ngn-badge-color, ${v('color.primary.500')});
        color: var(--theme-color-on-primary, #fff);
        font-size: ${v('font.size.sm')};
        font-weight: ${v('font.weight.semibold')};
        line-height: 1;
      }
      ${c('dot')} {
        min-width: 0.625rem;
        width: 0.625rem;
        height: 0.625rem;
        padding: 0;
      }
    `,
  },
});
```

`packages/themes/src/nova/badge/package.json`: `{}`

> ponytail: `--theme-color-on-primary` may not exist as a token — if the nova build errors on it, replace the `color:` line with a plain `#fff` (badge text is always on a saturated fill). Verify against the nova color tokens during the theme build step and adjust; leave the custom-property fallback knob in place.

- [ ] **Step 4: Register in the three theme barrels**

In `packages/themes/src/templates/index.ts`, add to the `ThemeTemplate` type map (alphabetical, near `avatar`):

```ts
badge: Awaited < typeof import('./badge') > ['badgeControlTemplate'];
```

In `packages/themes/src/base/index.ts`, add import + map entry:

```ts
import { badgeStyles } from '@ngneers/controls-themes/base/badge';
```

```ts
  badge: badgeStyles,
```

In `packages/themes/src/nova/index.ts`, add import + array entry:

```ts
import { badgeStyles } from '@ngneers/controls-themes/nova/badge';
```

```ts
    badgeStyles,
```

- [ ] **Step 5: Indicator component**

`packages/controls/src/badge/badge-indicator.ts`:

```ts
import { Component, computed, input } from '@angular/core';
import { NgnBase, provideSelf } from '@ngneers/controls/base';
import { badgeControlTemplate } from '@ngneers/controls-themes/templates/badge';

/** One of the four corners the badge indicator can sit in. */
export type BadgePosition = 'top-end' | 'top-start' | 'bottom-end' | 'bottom-start';

/**
 * @internal
 * The overlay element rendered by the {@link NgnBadge} directive. Not intended
 * to be used directly in templates.
 * @category control
 */
@Component({
  selector: 'ngn-badge-indicator',
  templateUrl: './badge-indicator.html',
  providers: [provideSelf(NgnBadgeIndicator)],
  host: {
    'aria-hidden': 'true',
    '[style.--ngn-badge-color]': 'bgColor() || null',
  },
})
export class NgnBadgeIndicator extends NgnBase<'badge'> {
  protected readonly theme = this.injectThemeTemplate(badgeControlTemplate, {
    root: true,
    dot: () => this.dot(),
    'top-end': () => this.position() === 'top-end',
    'top-start': () => this.position() === 'top-start',
    'bottom-end': () => this.position() === 'bottom-end',
    'bottom-start': () => this.position() === 'bottom-start',
  });

  /** The rendered badge text (already max-clamped by the directive). */
  public readonly text = input<string>('');
  /** Whether to render as a dot (no text). @default false */
  public readonly dot = input<boolean>(false);
  /** Which corner the badge sits in. @default top-end */
  public readonly position = input<BadgePosition>('top-end');
  /** CSS color value or `var(...)` reference for the badge fill. Named `bgColor` (not `color`) to avoid colliding with `NgnBase`'s universal `color: CustomColor` input — same reason `avatar` uses `bgColor`. */
  public readonly bgColor = input<string>();

  protected readonly display = computed(() => (this.dot() ? '' : this.text()));
}
```

`packages/controls/src/badge/badge-indicator.html`:

```html
{{ display() }}
```

- [ ] **Step 6: Build themes, verify compile**

Run: `pnpm --filter @ngneers/controls-themes build`
Expected: build succeeds, no unknown-token errors (fix the `color:` fallback per the ponytail note if it fails).

- [ ] **Step 7: Format & commit**

Run: `pnpm format` over the changed files.

```bash
git add packages/themes/src/*/badge packages/themes/src/*/index.ts packages/controls/src/badge/badge-indicator.*
git commit -m "feat(badge): add badge theme trio and indicator component"
```

### Task B2: `[ngnBadge]` directive + harness + test

**Files:**

- Create: `packages/controls/src/badge/badge.ts`, `packages/controls/src/badge/index.ts`, `packages/controls/src/badge/ng-package.json`, `packages/controls/src/badge/package.json`
- Create: `packages/playwright/src/components/badge.ts`; Modify: `packages/playwright/src/components/index.ts`
- Modify: `apps/test-wrapper/src/app/imports.ts`
- Create: `tests/components/badge.test.ts`

**Interfaces:**

- Consumes: `NgnBadgeIndicator`, `BadgePosition` (Task B1); `setComponentInput` from `@ngneers/controls/api/ng`.
- Produces: `NgnBadge` directive, selector `[ngnBadge]`, inputs `value`(alias `ngnBadge`), `max`(`ngnBadgeMax`), `dot`(`ngnBadgeDot`), `showZero`(`ngnBadgeShowZero`), `position`(`ngnBadgePosition`), `color`(`ngnBadgeColor`), `hidden`(`ngnBadgeHidden`).

- [ ] **Step 1: Write the directive**

`packages/controls/src/badge/badge.ts`:

```ts
import {
  booleanAttribute,
  ComponentRef,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  ViewContainerRef,
} from '@angular/core';
import { setComponentInput } from '@ngneers/controls/api/ng';

import { NgnBadgeIndicator, type BadgePosition } from './badge-indicator';

/**
 * Overlays a small badge (count, text, or dot) onto its host element — an icon,
 * button, or avatar. The badge is injected as an absolutely-positioned overlay,
 * so the host is made `position: relative` when it is currently static.
 */
@Directive({
  selector: '[ngnBadge]',
})
export class NgnBadge {
  private readonly _vcr = inject(ViewContainerRef);
  private readonly _host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly _destroyRef = inject(DestroyRef);
  private _ref?: ComponentRef<NgnBadgeIndicator>;

  /** Badge content. A number is clamped by {@link max}; empty hides the badge unless {@link dot}. */
  public readonly value = input<number | string | undefined>(undefined, { alias: 'ngnBadge' });
  /** Clamp a numeric {@link value} to `"{max}+"` when it exceeds this. */
  public readonly max = input<number | undefined>(undefined, { alias: 'ngnBadgeMax' });
  /** Render a dot with no text, ignoring {@link value}. @default false */
  public readonly dot = input(false, { transform: booleanAttribute, alias: 'ngnBadgeDot' });
  /** Show the badge even when {@link value} is `0`. @default false */
  public readonly showZero = input(false, {
    transform: booleanAttribute,
    alias: 'ngnBadgeShowZero',
  });
  /** Which corner the badge sits in. @default top-end */
  public readonly position = input<BadgePosition>('top-end', { alias: 'ngnBadgePosition' });
  /** CSS color value (hex/rgb) or `var(...)` reference for the badge fill. */
  public readonly color = input<string | undefined>(undefined, { alias: 'ngnBadgeColor' });
  /** Hide the badge without removing the host. @default false */
  public readonly hidden = input(false, { transform: booleanAttribute, alias: 'ngnBadgeHidden' });

  constructor() {
    // Ensure the host can anchor an absolutely-positioned child.
    if (getComputedStyle(this._host).position === 'static') {
      this._host.style.position = 'relative';
    }

    effect(() => {
      const text = this.resolveText();
      const visible = !this.hidden() && (this.dot() || text !== null);

      if (!visible) {
        this.teardown();
        return;
      }
      if (!this._ref) {
        this._ref = this._vcr.createComponent(NgnBadgeIndicator);
        this._host.appendChild(this._ref.location.nativeElement);
      }
      setComponentInput(this._ref, 'text', text ?? '');
      setComponentInput(this._ref, 'dot', this.dot());
      setComponentInput(this._ref, 'position', this.position());
      setComponentInput(this._ref, 'bgColor', this.color());
    });

    this._destroyRef.onDestroy(() => this.teardown());
  }

  /** Returns the string to render, or `null` when the badge should not show. */
  private resolveText(): string | null {
    if (this.dot()) {
      return '';
    }
    const value = this.value();
    if (value === undefined || value === null || value === '') {
      return null;
    }
    if (typeof value === 'number') {
      if (value === 0 && !this.showZero()) {
        return null;
      }
      const max = this.max();
      if (max !== undefined && value > max) {
        return `${max}+`;
      }
      return String(value);
    }
    return value;
  }

  private teardown(): void {
    if (this._ref) {
      this._ref.destroy();
      this._ref = undefined;
    }
  }
}
```

- [ ] **Step 2: Barrel + entrypoint files**

`packages/controls/src/badge/index.ts`:

```ts
export * from './badge';
export * from './badge-indicator';
```

`packages/controls/src/badge/ng-package.json`:

```json
{
  "$schema": "../../node_modules/ng-packagr/ng-package.schema.json",
  "lib": {
    "entryFile": "index.ts"
  }
}
```

`packages/controls/src/badge/package.json`: `{}`

- [ ] **Step 3: Harness**

`packages/playwright/src/components/badge.ts`:

```ts
import { badgeControlTemplate } from '@ngneers/controls-themes/templates/badge';
import { themeClasses } from '../utils/theme';
import { expect, type Locator } from '@playwright/test';

export class NgnBadgeHarness {
  public readonly classes = themeClasses(badgeControlTemplate);
  public readonly locator: Locator;
  public readonly badge: Locator;

  constructor(hostLocator: Locator) {
    this.locator = hostLocator;
    this.badge = hostLocator.locator(this.classes.root);
  }

  public async expectVisible(visible: boolean) {
    if (visible) {
      await expect(this.badge).toBeVisible();
    } else {
      await expect(this.badge).toHaveCount(0);
    }
  }

  public async expectText(text: string) {
    await expect(this.badge).toHaveText(text);
  }
}
```

Add to `packages/playwright/src/components/index.ts`:

```ts
export * from './badge';
```

- [ ] **Step 4: Test-wrapper registration**

In `apps/test-wrapper/src/app/imports.ts`, add:

```ts
  badge: () => import('@ngneers/controls/badge').then(m => m.NgnBadge),
```

- [ ] **Step 5: Write the failing e2e test**

`tests/components/badge.test.ts`:

```ts
import test, { expect } from '@playwright/test';
import { NgnBadgeHarness } from '@ngneers/controls-playwright';
import { loadComponent } from '../helper/load-component';
import { expectScreenshot } from '../helper/screenshot';

test('renders count and clamps to max', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<button style="width:48px;height:48px" [ngnBadge]="inputs().value" [ngnBadgeMax]="inputs().max">A</button>`,
      imports: ['badge'],
    },
    { inputs: { value: 3, max: 99 } }
  );

  const badge = new NgnBadgeHarness(page.locator('button'));
  await badge.expectText('3');
  await expectScreenshot(page, testInfo, 'count-3');

  await handle.setInputs({ value: 150 });
  await badge.expectText('99+');
});

test('hides on zero unless showZero', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `<button [ngnBadge]="inputs().value" [ngnBadgeShowZero]="inputs().showZero">A</button>`,
      imports: ['badge'],
    },
    { inputs: { value: 0, showZero: false } }
  );

  const badge = new NgnBadgeHarness(page.locator('button'));
  await badge.expectVisible(false);

  await handle.setInputs({ showZero: true });
  await badge.expectVisible(true);
  await badge.expectText('0');
});

test('dot mode ignores value', async ({ page }, testInfo) => {
  await loadComponent(
    page,
    {
      template: `<button style="width:48px;height:48px" [ngnBadge]="5" ngnBadgeDot>A</button>`,
      imports: ['badge'],
    },
    { inputs: {} }
  );
  const badge = new NgnBadgeHarness(page.locator('button'));
  await badge.expectVisible(true);
  await badge.expectText('');
});

test('custom color applies as css variable', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `<button [ngnBadge]="1" ngnBadgeColor="rgb(10, 20, 30)">A</button>`,
      imports: ['badge'],
    },
    { inputs: {} }
  );
  const badge = new NgnBadgeHarness(page.locator('button'));
  await expect(badge.badge).toHaveCSS('background-color', 'rgb(10, 20, 30)');
});
```

- [ ] **Step 6: Build themes + run tests**

Run: `pnpm --filter @ngneers/controls-themes build`
Run: `pnpm test -- badge` (or the repo's e2e command scoped to `badge.test.ts`)
Expected: all four tests PASS.

- [ ] **Step 7: Format & commit**

```bash
git add packages/controls/src/badge packages/playwright/src/components/badge.ts packages/playwright/src/components/index.ts apps/test-wrapper/src/app/imports.ts tests/components/badge.test.ts
git commit -m "feat(badge): add ngnBadge directive with harness and tests"
```

### Task B3: Badge docs + demos

**Files:**

- Create: `apps/docs/src/app/docs/components/badge/{page.ts,index.md,api.md,a11y.md}`
- Create: `apps/docs/src/app/demos/badge/{base.ts,positions.ts,dot.ts,color.ts}`
- Modify: `apps/docs/src/app/docs/components/index.ts`

**Interfaces:**

- Consumes: `NgnBadge` from `@ngneers/controls/badge`.

- [ ] **Step 1: Demos**

`apps/docs/src/app/demos/badge/base.ts`:

```ts
import { Component } from '@angular/core';
import { NgnBadge } from '@ngneers/controls/badge';
import { NgnIcon } from '@ngneers/controls/icon';

@Component({
  selector: 'ngn-demo-badge-base',
  imports: [NgnBadge, NgnIcon],
  template: `<span [ngnBadge]="8"><ngn-icon defaultIcon="menu" /></span>`,
  host: { class: 'inline-flex p-4' },
})
export class Demo_Badge_Base {}
```

`apps/docs/src/app/demos/badge/positions.ts`:

```ts
import { Component } from '@angular/core';
import { NgnBadge } from '@ngneers/controls/badge';

@Component({
  selector: 'ngn-demo-badge-positions',
  imports: [NgnBadge],
  template: `
    <div class="flex gap-8 p-6">
      <button [ngnBadge]="1" ngnBadgePosition="top-start">A</button>
      <button [ngnBadge]="2" ngnBadgePosition="top-end">B</button>
      <button [ngnBadge]="3" ngnBadgePosition="bottom-start">C</button>
      <button [ngnBadge]="4" ngnBadgePosition="bottom-end">D</button>
    </div>
  `,
})
export class Demo_Badge_Positions {}
```

`apps/docs/src/app/demos/badge/dot.ts`:

```ts
import { Component } from '@angular/core';
import { NgnBadge } from '@ngneers/controls/badge';

@Component({
  selector: 'ngn-demo-badge-dot',
  imports: [NgnBadge],
  template: `<button [ngnBadge]="99" ngnBadgeDot class="m-4">Inbox</button>`,
})
export class Demo_Badge_Dot {}
```

`apps/docs/src/app/demos/badge/color.ts`:

```ts
import { Component } from '@angular/core';
import { NgnBadge } from '@ngneers/controls/badge';

@Component({
  selector: 'ngn-demo-badge-color',
  imports: [NgnBadge],
  template: `
    <div class="flex gap-8 p-6">
      <button [ngnBadge]="3" ngnBadgeColor="#e11d48">Alerts</button>
      <button [ngnBadge]="7" ngnBadgeColor="var(--theme-color-success-500)">Done</button>
    </div>
  `,
})
export class Demo_Badge_Color {}
```

- [ ] **Step 2: Docs page files**

`apps/docs/src/app/docs/components/badge/page.ts`:

```ts
import { Demo_Badge_Base } from '../../../demos/badge/base';
import { Demo_Badge_Positions } from '../../../demos/badge/positions';
import { Demo_Badge_Dot } from '../../../demos/badge/dot';
import { Demo_Badge_Color } from '../../../demos/badge/color';

import type { NgnDocsPage } from '../../../utils/page/types';

export const BadgePage: NgnDocsPage = {
  title: `Badge`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,
      title: 'Examples',
      mdFile: 'components/badge/index.md',
      components: [Demo_Badge_Base, Demo_Badge_Positions, Demo_Badge_Dot, Demo_Badge_Color],
    },
    { kind: 'single', title: 'API', mdFile: 'components/badge/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/badge/a11y.md' },
  ],
};
```

`apps/docs/src/app/docs/components/badge/index.md`:

```md
The Badge (`[ngnBadge]`) is an attribute directive that overlays a small count,
label, or status dot onto any host element — an icon, button, or avatar. The host
is made `position: relative` automatically so the badge can anchor to a corner.

### Basic Usage

Apply `[ngnBadge]` with a number or string. A numeric value can be capped with
`ngnBadgeMax`.

{{ demo: Demo_Badge_Base }}

### Positions

Use `ngnBadgePosition` to move the badge to any corner.

{{ demo: Demo_Badge_Positions }}

### Dot

Set `ngnBadgeDot` for a value-less status dot.

{{ demo: Demo_Badge_Dot }}

### Custom Color

`ngnBadgeColor` takes any CSS color or `var(...)` reference.

{{ demo: Demo_Badge_Color }}
```

`apps/docs/src/app/docs/components/badge/api.md`:

```md
{{ api: badge/badge NgnBadge }}
```

`apps/docs/src/app/docs/components/badge/a11y.md`:

```md
The badge overlay is decorative: the injected indicator is `aria-hidden="true"`,
so screen readers do not announce it.

## Developer responsibilities

- The badge count is **not** announced. If the count conveys meaning (e.g. unread
  messages), put it in the host's accessible name — for example
  `aria-label="Inbox, 8 unread"` on the button — and update it alongside the
  badge value.
- Do not rely on color alone (e.g. a red dot) to convey state; pair it with text
  elsewhere.
```

- [ ] **Step 3: Register the page**

In `apps/docs/src/app/docs/components/index.ts`, add the import and the array entry:

```ts
import { BadgePage } from './badge/page';
```

```ts
      BadgePage,
```

- [ ] **Step 4: Verify docs build**

Run: `pnpm docs:build`
Expected: build succeeds; the Badge page compiles with all four demos.

- [ ] **Step 5: Format & commit**

```bash
git add apps/docs/src/app/docs/components/badge apps/docs/src/app/demos/badge apps/docs/src/app/docs/components/index.ts
git commit -m "docs(badge): add badge docs page and demos"
```

---

# Phase 2 — Rating

`ngn-rating` extends `RatingTemplates extends ValueControlBase<'rating', number>`. Value is `0..count`. Slider-family interaction (arrow keys, Home/End, hover preview, click commit, arbitrary `step`). Each symbol renders a fractional fill via a width-clipped `iconFull` over `iconEmpty`, OR a custom `indicatorTemplate` given the fill ratio.

**File structure:**

- `packages/controls/src/rating/rating.ts` — component + geometry/keyboard logic.
- `packages/controls/src/rating/rating-templates.ts` — templates base (projection input).
- `packages/controls/src/rating/rating.html` — template.
- `packages/controls/src/rating/index.ts`, `ng-package.json`, `package.json`.
- Theme trio for scope `rating`.

### Task R1: Rating theme trio

**Files:**

- Create theme trio for `rating` (templates/base/nova) + register in 3 barrels, per the anatomy checklist.

**Interfaces:**

- Produces: `ratingControlTemplate` scope `'rating'`, classNames `['root', 'symbol', 'full', 'empty', 'invalid', 'readonly', 'disabled']`.

- [ ] **Step 1: Template scope**

`packages/themes/src/templates/rating/index.ts`:

```ts
import { createControlTemplate } from '@ngneers/controls-themes/api';

export const ratingControlTemplate = createControlTemplate({
  scope: 'rating',
  classNames: ['root', 'symbol', 'full', 'empty', 'invalid', 'readonly', 'disabled'],
});
```

`package.json`: `{}`

- [ ] **Step 2: Base theme**

`packages/themes/src/base/rating/index.ts`:

```ts
import { createThemePart, css } from '@ngneers/controls-themes/api';
import { ratingControlTemplate } from '@ngneers/controls-themes/templates/rating';

export const ratingStyles = createThemePart({
  controlTemplate: ratingControlTemplate,
  dependencies: [],
  root: {
    css: ({ c }) => css`
      ${c('root')} {
        display: inline-flex;
        align-items: center;
        gap: 0.125rem;
      }
      ${c('symbol')} {
        position: relative;
        display: inline-block;
        line-height: 1;
      }
      ${c('empty')} {
        display: block;
      }
      ${c('full')} {
        position: absolute;
        top: 0;
        inset-inline-start: 0;
        overflow: hidden;
        white-space: nowrap;
        /* --fillRatio is set per symbol in the template, 0..1 */
        width: calc(var(--fillRatio) * 100%);
      }
    `,
  },
});
```

`package.json`: `{}`

- [ ] **Step 3: Nova theme**

`packages/themes/src/nova/rating/index.ts`:

```ts
import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { ratingControlTemplate } from '@ngneers/controls-themes/templates/rating';

export const ratingStyles = createThemePart({
  controlTemplate: ratingControlTemplate,
  base: baseStyles.rating,
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('root')} {
        --icon-size: 1.5rem;
        font-size: var(--icon-size);
        color: ${v('color.surface.300')};
        cursor: pointer;
      }
      ${c('full')} {
        color: ${v('color.primary.500')};
      }
      ${c('root')}:focus-visible {
        outline: none;
        ${c('symbol')} {
          outline: 2px solid ${v('color.surface.900')};
          outline-offset: 2px;
          border-radius: ${v('size.rounded.sm')};
        }
      }
      ${c('invalid')} {
        color: ${v('color.error.200')};
        ${c('full')} {
          color: ${v('color.error.500')};
        }
      }
      ${c('readonly')}, ${c('disabled')} {
        cursor: default;
      }
      ${c('disabled')} {
        opacity: 0.6;
      }
    `,
  },
});
```

`package.json`: `{}`

- [ ] **Step 3b: Shade theme** — create `packages/themes/src/shade/rating/index.ts` (+ `package.json` `{}`) mirroring the nova part but importing from `@ngneers/controls-themes/shade/base` and using shade tokens (anatomy checklist 4b; model on `packages/themes/src/shade/slider/index.ts`). Export `ratingStyles`.

- [ ] **Step 4: Register in all 4 barrels** (templates/base/nova/shade `index.ts`; key `rating`, `ratingStyles`, `ratingControlTemplate`). In `shade/index.ts` add the import and the entry in the `createTheme('Shade', [...])` array.

- [ ] **Step 5: Build + commit**

Run: `pnpm --filter @ngneers/controls-themes build` → succeeds.

```bash
git add packages/themes/src/*/rating packages/themes/src/*/index.ts
git commit -m "feat(rating): add rating theme trio"
```

### Task R2: Rating component + harness + tests

**Files:**

- Create: `packages/controls/src/rating/rating-templates.ts`, `rating.ts`, `rating.html`, `index.ts`, `ng-package.json`, `package.json`
- Create: `packages/playwright/src/components/rating.ts`; Modify: `packages/playwright/src/components/index.ts`
- Modify: `apps/test-wrapper/src/app/imports.ts`
- Create: `tests/components/rating.test.ts`

**Interfaces:**

- Consumes: `ValueControlBase`, `NgnPt`, `provideSelf` (`@ngneers/controls/base`); `NgnIcon` (`@ngneers/controls/icon`); `ratingControlTemplate`.
- Produces: `NgnRating` with inputs `count`(number,5), `step`(number,1), `iconFull`/`iconEmpty`(IconType), `indicatorTemplate`(TemplateRef), `clearable`(boolean,true), plus inherited `value`/`disabled`/`readonly`/`invalid`/`label`/`labelledBy`; interface `RatingIndicatorContext { $implicit: number; index: number }`.

- [ ] **Step 1: Templates base**

`packages/controls/src/rating/rating-templates.ts`:

```ts
import { computed, contentChild, Directive, input, TemplateRef } from '@angular/core';
import { ValueControlBase } from '@ngneers/controls/base';

/** Context for a custom {@link NgnRating} symbol template. */
export interface RatingIndicatorContext {
  /** Fill ratio for this symbol, 0..1. */
  $implicit: number;
  /** Zero-based symbol index. */
  index: number;
}

@Directive()
export abstract class RatingTemplates extends ValueControlBase<'rating', number> {
  private readonly _userIndicatorTemplate =
    contentChild<TemplateRef<RatingIndicatorContext>>('indicator');
  /**
   * Custom template for a single symbol. Receives the fill ratio (`$implicit`,
   * 0..1) and `index`. Can also be set with an `<ng-template #indicator>`.
   * When set, it replaces the default full/empty icon rendering per symbol.
   */
  public readonly indicatorTemplate = input<TemplateRef<RatingIndicatorContext> | null>(null);
  protected readonly resolvedIndicatorTemplate = computed(
    () => this._userIndicatorTemplate() ?? this.indicatorTemplate()
  );
}
```

- [ ] **Step 2: Component**

`packages/controls/src/rating/rating.ts`:

```ts
import { Component, computed, ElementRef, input, viewChild } from '@angular/core';
import { NgnPt, provideSelf } from '@ngneers/controls/base';
import { NgnIcon } from '@ngneers/controls/icon';
import { ratingControlTemplate } from '@ngneers/controls-themes/templates/rating';

import { RatingTemplates } from './rating-templates';

import type { IconType } from '@ngneers/controls-custom-types';

/**
 * @category control
 */
@Component({
  selector: 'ngn-rating',
  templateUrl: './rating.html',
  imports: [NgnPt, NgnIcon],
  providers: [provideSelf(NgnRating)],
  host: {
    role: 'slider',
    'aria-valuemin': '0',
    '[attr.aria-valuemax]': 'count()',
    '[attr.aria-valuenow]': 'value()',
    '[attr.aria-readonly]': 'readonly() ? "true" : null',
    '[attr.disabled]': 'disabled() ? "" : null',
    '[attr.aria-labelledby]': 'labelledBy()',
    '[attr.aria-label]': 'label()',
    '[attr.aria-valuetext]': 'valueTextValue()',
    '[tabindex]': 'disabled() ? -1 : 0',
    '(keydown)': 'onKeyDown($event)',
    '(pointerleave)': 'clearHover()',
    '(blur)': 'markTouched()',
  },
})
export class NgnRating extends RatingTemplates {
  protected readonly theme = this.injectThemeTemplate(ratingControlTemplate, {
    root: true,
    invalid: () => this.invalidState(),
    readonly: () => this.readonly(),
    disabled: () => this.disabled(),
  });

  private readonly _root = viewChild.required<ElementRef<HTMLElement>>('root');

  /** Number of symbols. @default 5 */
  public readonly count = input<number>(5);
  /** The value increment; supports fractions (e.g. 0.5). @default 1 */
  public readonly step = input<number>(1);
  /** The filled symbol icon. */
  public readonly iconFull = input<IconType>('rating-full');
  /** The empty symbol icon. */
  public readonly iconEmpty = input<IconType>('rating-empty');
  /** Clicking the current value resets it to 0. @default true */
  public readonly clearable = input<boolean>(true);
  /** Accessible value text; overrides the numeric readout. */
  public readonly valueText = input<string>();
  /** Function producing accessible value text from the value. */
  public readonly valueTextFn = input<(value: number) => string>();

  /** Value under the cursor while hovering, or null. */
  private readonly _hoverValue = computed<number | null>(() => this._hover());
  private readonly _hover = /* signal */ (() => {
    // separate signal declared below to keep effect-free; see field _hoverSig
    return this._hoverSig();
  })();

  protected onKeyDown(event: KeyboardEvent) {
    if (this.readonly() || this.disabled()) {
      return;
    }
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        this.value.update(v => this.clamp((v ?? 0) - this.step()));
        event.preventDefault();
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        this.value.update(v => this.clamp((v ?? 0) + this.step()));
        event.preventDefault();
        break;
      case 'Home':
        this.value.set(0);
        event.preventDefault();
        break;
      case 'End':
        this.value.set(this.count());
        event.preventDefault();
        break;
    }
  }
}
```

> The `_hover` scaffolding above is a placeholder for a signal — replace the two `_hover*` lines with a proper `signal`. Use the corrected version in Step 3.

- [ ] **Step 3: Replace the component body with the finalized version**

Overwrite `packages/controls/src/rating/rating.ts` with this complete, correct version:

```ts
import { Component, computed, ElementRef, input, signal, viewChild } from '@angular/core';
import { NgnPt, provideSelf } from '@ngneers/controls/base';
import { NgnIcon } from '@ngneers/controls/icon';
import { ratingControlTemplate } from '@ngneers/controls-themes/templates/rating';

import { RatingTemplates } from './rating-templates';

import type { IconType } from '@ngneers/controls-custom-types';

/**
 * @category control
 */
@Component({
  selector: 'ngn-rating',
  templateUrl: './rating.html',
  imports: [NgnPt, NgnIcon],
  providers: [provideSelf(NgnRating)],
  host: {
    role: 'slider',
    'aria-valuemin': '0',
    '[attr.aria-valuemax]': 'count()',
    '[attr.aria-valuenow]': 'value()',
    '[attr.aria-readonly]': 'readonly() ? "true" : null',
    '[attr.disabled]': 'disabled() ? "" : null',
    '[attr.aria-labelledby]': 'labelledBy()',
    '[attr.aria-label]': 'label()',
    '[attr.aria-valuetext]': 'valueTextValue()',
    '[tabindex]': 'disabled() ? -1 : 0',
    '(keydown)': 'onKeyDown($event)',
    '(pointerleave)': 'clearHover()',
    '(blur)': 'markTouched()',
  },
})
export class NgnRating extends RatingTemplates {
  protected readonly theme = this.injectThemeTemplate(ratingControlTemplate, {
    root: true,
    invalid: () => this.invalidState(),
    readonly: () => this.readonly(),
    disabled: () => this.disabled(),
  });

  private readonly _root = viewChild.required<ElementRef<HTMLElement>>('root');
  private readonly _hover = signal<number | null>(null);

  /** Number of symbols. @default 5 */
  public readonly count = input<number>(5);
  /** The value increment; supports fractions (e.g. 0.5). @default 1 */
  public readonly step = input<number>(1);
  /** The filled symbol icon. */
  public readonly iconFull = input<IconType>('rating-full');
  /** The empty symbol icon. */
  public readonly iconEmpty = input<IconType>('rating-empty');
  /** Clicking the current value resets it to 0. @default true */
  public readonly clearable = input<boolean>(true);
  /** Accessible value text; overrides the numeric readout. */
  public readonly valueText = input<string>();
  /** Function producing accessible value text from the value. */
  public readonly valueTextFn = input<(value: number) => string>();

  /** The value the UI should paint: hover preview when hovering, else the model value. */
  protected readonly displayValue = computed(() => this._hover() ?? this.value() ?? 0);

  /** Zero-based indices for the symbols. */
  protected readonly symbols = computed(() => Array.from({ length: this.count() }, (_, i) => i));

  protected readonly valueTextValue = computed(() => {
    const valueText = this.valueText();
    if (valueText) {
      return valueText;
    }
    const fn = this.valueTextFn();
    if (fn) {
      return fn(this.value() ?? 0);
    }
    return null;
  });

  /** Fill ratio 0..1 for symbol `index` given the current display value. */
  protected fillRatio(index: number): number {
    const filled = this.displayValue() - index;
    return Math.min(1, Math.max(0, filled));
  }

  protected onKeyDown(event: KeyboardEvent) {
    if (this.readonly() || this.disabled()) {
      return;
    }
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        this.value.update(v => this.clamp((v ?? 0) - this.step()));
        event.preventDefault();
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        this.value.update(v => this.clamp((v ?? 0) + this.step()));
        event.preventDefault();
        break;
      case 'Home':
        this.value.set(0);
        event.preventDefault();
        break;
      case 'End':
        this.value.set(this.count());
        event.preventDefault();
        break;
    }
  }

  /** Pointer moved over symbol `index` at fractional `offset` (0..1 within the symbol). */
  protected onPointerMove(event: PointerEvent, index: number) {
    if (this.readonly() || this.disabled()) {
      return;
    }
    this._hover.set(this.valueAt(event, index));
  }

  protected clearHover() {
    this._hover.set(null);
  }

  protected onClick(event: PointerEvent, index: number) {
    if (this.readonly() || this.disabled()) {
      return;
    }
    const next = this.valueAt(event, index);
    if (this.clearable() && next === this.value()) {
      this.value.set(0);
    } else {
      this.value.set(next);
    }
  }

  /** Resolve the stepped value for a pointer position within symbol `index`. */
  private valueAt(event: PointerEvent, index: number): number {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const ratio = rect.width ? (event.clientX - rect.left) / rect.width : 1;
    const raw = index + Math.min(1, Math.max(0, ratio));
    const stepped = Math.round(raw / this.step()) * this.step();
    return this.clamp(stepped);
  }

  private clamp(value: number): number {
    return Math.min(this.count(), Math.max(0, value));
  }
}
```

- [ ] **Step 4: Template**

`packages/controls/src/rating/rating.html`:

```html
<!-- eslint-disable @angular-eslint/template/interactive-supports-focus -->
<!-- eslint-disable @angular-eslint/template/click-events-have-key-events -->
<div #root [ptInt]="this" [ptClass]="'root-inner'" class="contents">
  @for (index of symbols(); track index) {
  <span
    [ptInt]="this"
    [ptClass]="'symbol'"
    [style.--fillRatio]="fillRatio(index)"
    (pointermove)="onPointerMove($event, index)"
    (click)="onClick($event, index)"
  >
    @if (resolvedIndicatorTemplate(); as tpl) {
    <ng-container
      [ngTemplateOutlet]="tpl"
      [ngTemplateOutletContext]="{ $implicit: fillRatio(index), index: index }"
    />
    } @else {
    <span [ptInt]="this" [ptClass]="'empty'">
      <ngn-icon [icon]="iconEmpty()" defaultIcon="rating-empty" />
    </span>
    <span [ptInt]="this" [ptClass]="'full'">
      <ngn-icon [icon]="iconFull()" defaultIcon="rating-full" />
    </span>
    }
  </span>
  }
</div>
```

> The `#root` wrapper carries `class="contents"` so it does not affect layout; the theme's `root` class is on the host. If `ptClass='root-inner'` is not a declared class, drop the `[ptInt]/[ptClass]` from this wrapper and keep only `#root`. The `ngTemplateOutlet` needs `NgTemplateOutlet` imported — add it to the component `imports` array: `import { NgTemplateOutlet } from '@angular/common';` and `imports: [NgTemplateOutlet, NgnPt, NgnIcon]`.

- [ ] **Step 5: Fix imports for NgTemplateOutlet**

Edit `rating.ts` `imports` to `[NgTemplateOutlet, NgnPt, NgnIcon]` and add the import line `import { NgTemplateOutlet } from '@angular/common';`.

- [ ] **Step 6: Default icons**

Check `packages/controls/src/default-icons/` for a `rating-full`/`rating-empty` registration. If absent, register star icons there following the existing default-icon entries (e.g. how `menu` or `tabs-scroll-left` are registered). If the default-icon system requires an entry, add `rating-full` (filled star) and `rating-empty` (outline star). If it does not resolve unknown default icons gracefully, this step is required for the icons to render.

Run: `grep -rn "tabs-scroll-left\|defaultIcon" packages/controls/src/default-icons/` to find the registration file and mirror it.

- [ ] **Step 7: Barrel + entrypoint**

`packages/controls/src/rating/index.ts`:

```ts
export * from './rating';
export * from './rating-templates';
```

`ng-package.json` (standard) + `package.json` `{}`.

- [ ] **Step 8: Harness**

`packages/playwright/src/components/rating.ts`:

```ts
import { ratingControlTemplate } from '@ngneers/controls-themes/templates/rating';
import { themeClasses } from '../utils/theme';
import { expect, type Locator } from '@playwright/test';

export class NgnRatingHarness {
  public readonly classes = themeClasses(ratingControlTemplate);
  public readonly locator: Locator;
  public readonly symbols: Locator;

  constructor(locator: Locator) {
    this.locator = locator;
    this.symbols = locator.locator(this.classes.symbol);
  }

  public async expectValue(value: number) {
    await expect(this.locator).toHaveAttribute('aria-valuenow', value.toString());
  }

  public async expectMax(max: number) {
    await expect(this.locator).toHaveAttribute('aria-valuemax', max.toString());
  }

  public async clickSymbol(index: number, position: 'left' | 'center' | 'right' = 'center') {
    const symbol = this.symbols.nth(index);
    const box = await symbol.boundingBox();
    if (!box) {
      throw new Error(`Symbol ${index} not found`);
    }
    const x = position === 'left' ? 2 : position === 'right' ? box.width - 2 : box.width / 2;
    await symbol.click({ position: { x, y: box.height / 2 } });
  }

  public async focus() {
    await this.locator.focus();
  }

  public async pressKey(key: string) {
    await this.locator.press(key);
  }
}
```

Add `export * from './rating';` to `packages/playwright/src/components/index.ts`.

- [ ] **Step 9: Test-wrapper registration**

Add to `apps/test-wrapper/src/app/imports.ts`:

```ts
  rating: () => import('@ngneers/controls/rating').then(m => m.NgnRating),
```

- [ ] **Step 10: Write the e2e test**

`tests/components/rating.test.ts`:

```ts
import test, { expect } from '@playwright/test';
import { NgnRatingHarness } from '@ngneers/controls-playwright';
import { loadComponent } from '../helper/load-component';
import { expectScreenshot } from '../helper/screenshot';
import { expectNoA11yViolations } from '../helper/axe';

test('base: click to set, clear on repeat', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<ngn-rating [value]="inputs().value" (valueChange)="output('value', $event)" />`,
      imports: ['rating'],
    },
    { inputs: { value: 0 } }
  );

  const rating = new NgnRatingHarness(page.locator('ngn-rating'));
  await rating.expectMax(5);
  await rating.expectValue(0);

  await rating.clickSymbol(2, 'right'); // third symbol → value 3
  await rating.expectValue(3);
  await expectScreenshot(page, testInfo, 'value-3');

  // clearable: click the current value resets to 0
  await rating.clickSymbol(2, 'right');
  await rating.expectValue(0);
});

test('keyboard navigation with step', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `<ngn-rating [value]="inputs().value" [step]="inputs().step" (valueChange)="output('value', $event)" />`,
      imports: ['rating'],
    },
    { inputs: { value: 2, step: 0.5 } }
  );

  const rating = new NgnRatingHarness(page.locator('ngn-rating'));
  await rating.focus();
  await rating.pressKey('ArrowRight');
  await rating.expectValue(2.5);
  await rating.pressKey('ArrowLeft');
  await rating.expectValue(2);
  await rating.pressKey('End');
  await rating.expectValue(5);
  await rating.pressKey('Home');
  await rating.expectValue(0);
});

test('readonly does not change value', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `<ngn-rating [value]="inputs().value" [readonly]="true" (valueChange)="output('value', $event)" />`,
      imports: ['rating'],
    },
    { inputs: { value: 3 } }
  );
  const rating = new NgnRatingHarness(page.locator('ngn-rating'));
  await rating.clickSymbol(0, 'center');
  await rating.expectValue(3);
  expect(await handle.getOutputLog()).toEqual({});
});

test('accessibility (axe)', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `<ngn-rating [value]="3" [label]="'Rating'" />`,
      imports: ['rating'],
    },
    { inputs: {} }
  );
  await expectNoA11yViolations(page);
});
```

- [ ] **Step 11: Build themes + run tests**

Run: `pnpm --filter @ngneers/controls-themes build`
Run: `pnpm test -- rating`
Expected: all tests PASS. If the fractional click math is off by a symbol, verify `valueAt` uses `event.currentTarget` (the symbol span), not the host.

- [ ] **Step 12: Format & commit**

```bash
git add packages/controls/src/rating packages/playwright/src/components/rating.ts packages/playwright/src/components/index.ts apps/test-wrapper/src/app/imports.ts tests/components/rating.test.ts packages/controls/src/default-icons
git commit -m "feat(rating): add ngn-rating control with harness and tests"
```

### Task R3: Rating docs + demos

**Files:**

- Create: `apps/docs/src/app/docs/components/rating/{page.ts,index.md,api.md,a11y.md,playground.ts}`
- Create: `apps/docs/src/app/demos/rating/{base.ts,half.ts,custom-template.ts,states.ts}`
- Modify: `apps/docs/src/app/docs/components/index.ts`

- [ ] **Step 1: Demos**

`apps/docs/src/app/demos/rating/base.ts`:

```ts
import { Component, signal } from '@angular/core';
import { NgnRating } from '@ngneers/controls/rating';

@Component({
  selector: 'ngn-demo-rating-base',
  imports: [NgnRating],
  template: `
    <ngn-rating [value]="value()" (valueChange)="value.set($event)" />
    <br />
    {{ value() }}
  `,
})
export class Demo_Rating_Base {
  protected readonly value = signal(3);
}
```

`apps/docs/src/app/demos/rating/half.ts`:

```ts
import { Component, signal } from '@angular/core';
import { NgnRating } from '@ngneers/controls/rating';

@Component({
  selector: 'ngn-demo-rating-half',
  imports: [NgnRating],
  template: `<ngn-rating [step]="0.5" [value]="value()" (valueChange)="value.set($event)" />`,
})
export class Demo_Rating_Half {
  protected readonly value = signal(2.5);
}
```

`apps/docs/src/app/demos/rating/custom-template.ts`:

```ts
import { Component, signal } from '@angular/core';
import { NgnRating } from '@ngneers/controls/rating';

@Component({
  selector: 'ngn-demo-rating-custom-template',
  imports: [NgnRating],
  template: `
    <ngn-rating [value]="value()" (valueChange)="value.set($event)">
      <ng-template #indicator let-ratio let-index="index">
        <span
          [style.color]="ratio > 0.5 ? '#f59e0b' : '#d1d5db'"
          [style.opacity]="ratio > 0 && ratio <= 0.5 ? 0.5 : 1"
          >&#9733;</span
        >
      </ng-template>
    </ngn-rating>
  `,
})
export class Demo_Rating_CustomTemplate {
  protected readonly value = signal(3);
}
```

> The custom-template demo intentionally uses `ratio` as a coarse threshold to keep it readable. It proves the `$implicit` ratio + `index` context reach the template.

`apps/docs/src/app/demos/rating/states.ts`:

```ts
import { Component, signal } from '@angular/core';
import { NgnRating } from '@ngneers/controls/rating';

@Component({
  selector: 'ngn-demo-rating-states',
  imports: [NgnRating],
  template: `
    <div class="flex flex-col gap-3">
      <ngn-rating [value]="3" [readonly]="true" />
      <ngn-rating [value]="3" [disabled]="true" />
      <ngn-rating
        [value]="value()"
        [invalid]="value() < 3"
        [invalidOn]="'immediate'"
        (valueChange)="value.set($event)"
      />
    </div>
  `,
})
export class Demo_Rating_States {
  protected readonly value = signal(2);
}
```

- [ ] **Step 2: page.ts, index.md, api.md, a11y.md, playground.ts** (mirror the badge/slider page structure)

`apps/docs/src/app/docs/components/rating/page.ts`:

```ts
import { NgnDocsRatingPlayground } from './playground';
import { Demo_Rating_Base } from '../../../demos/rating/base';
import { Demo_Rating_Half } from '../../../demos/rating/half';
import { Demo_Rating_CustomTemplate } from '../../../demos/rating/custom-template';
import { Demo_Rating_States } from '../../../demos/rating/states';

import type { NgnDocsPage } from '../../../utils/page/types';

export const RatingPage: NgnDocsPage = {
  title: `Rating`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,
      title: 'Examples',
      mdFile: 'components/rating/index.md',
      components: [
        Demo_Rating_Base,
        Demo_Rating_Half,
        Demo_Rating_CustomTemplate,
        Demo_Rating_States,
      ],
    },
    { kind: 'component', title: 'Playground', component: NgnDocsRatingPlayground },
    { kind: 'single', title: 'API', mdFile: 'components/rating/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/rating/a11y.md' },
  ],
};
```

`apps/docs/src/app/docs/components/rating/index.md`:

```md
The Rating (`ngn-rating`) is a form control for picking a numeric score by
clicking a row of symbols, dragging across them, or using the keyboard. Bind
`value` and set `count` for the number of symbols and `step` for the granularity
(use `0.5` for half symbols). It exposes the `slider` role.

### Basic Usage

{{ demo: Demo_Rating_Base }}

### Fractional Steps

Set `step` to allow fractional values such as half symbols.

{{ demo: Demo_Rating_Half }}

### Custom Symbol Template

Provide an `<ng-template #indicator>` to render each symbol yourself. It receives
the fill ratio (`$implicit`, 0..1) and the symbol `index`.

{{ demo: Demo_Rating_CustomTemplate }}

### States

`readonly`, `disabled`, and `invalid` states.

{{ demo: Demo_Rating_States }}
```

`apps/docs/src/app/docs/components/rating/api.md`:

```md
{{ api: rating/rating NgnRating }}
```

`apps/docs/src/app/docs/components/rating/a11y.md`:

```md
Rating is a `role="slider"` widget: the host is focusable and carries the value
ARIA.

## Keyboard

| Key                       | Action                  |
| ------------------------- | ----------------------- |
| `ArrowRight` / `ArrowUp`  | Increase by one `step`. |
| `ArrowLeft` / `ArrowDown` | Decrease by one `step`. |
| `Home`                    | Set to 0.               |
| `End`                     | Set to `count`.         |

## ARIA

The host is `role="slider"` with `aria-valuemin="0"`, `aria-valuemax="count"`,
and `aria-valuenow`. Provide a name via `label`/`labelledBy`, and `valueText`/
`valueTextFn` when a bare number is not meaningful (e.g. "3 of 5 stars").
```

`apps/docs/src/app/docs/components/rating/playground.ts`:

```ts
import { Component, signal, viewChild } from '@angular/core';
import { NgnRating } from '@ngneers/controls/rating';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'ngn-docs-rating-playground',
  imports: [NgnRating, NgnDocsPlayground],
  template: `
    <ngn-docs-playground [controls]="[{ componentName: 'NgnRating', component: component() }]">
      <ngn-rating #ref [value]="value()" (valueChange)="value.set($event)" />
    </ngn-docs-playground>
  `,
})
export class NgnDocsRatingPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnRating });
  protected readonly value = signal(3);
}
```

- [ ] **Step 3: Register the page** in `apps/docs/src/app/docs/components/index.ts` (import `RatingPage`, add to array).

- [ ] **Step 4: `pnpm docs:build`** → succeeds.

- [ ] **Step 5: Format & commit**

```bash
git add apps/docs/src/app/docs/components/rating apps/docs/src/app/demos/rating apps/docs/src/app/docs/components/index.ts
git commit -m "docs(rating): add rating docs page and demos"
```

---

# Phase 3 — Stepper

`ngn-stepper` (extends `NgnBase<'stepper'>`) tracks `active = model<number>(0)` and reads `ngn-step` children via `contentChildren`. Each step is a bare component exposing header metadata + a content `contentChild<TemplateRef>`. The header is a `ngnRovingGroup` of `<button ngnRovingItem>` markers; content is rendered through `ngn-defer`. Horizontal only.

**File structure:**

- `packages/controls/src/stepper/step.ts` — child (`ngn-step`).
- `packages/controls/src/stepper/stepper.ts` — parent (`ngn-stepper`).
- `packages/controls/src/stepper/stepper.html` — parent template.
- `packages/controls/src/stepper/index.ts`, `ng-package.json`, `package.json`.
- Theme trio scope `stepper`.

### Task S1: Stepper theme trio

**Interfaces:**

- Produces: `stepperControlTemplate` scope `'stepper'`, classNames `['root', 'header', 'marker', 'marker-index', 'marker-icon', 'connector', 'label', 'optional', 'content', 'active', 'completed', 'error', 'disabled']`.

- [ ] **Step 1: Template scope**

`packages/themes/src/templates/stepper/index.ts`:

```ts
import { createControlTemplate } from '@ngneers/controls-themes/api';

export const stepperControlTemplate = createControlTemplate({
  scope: 'stepper',
  classNames: [
    'root',
    'header',
    'step',
    'marker',
    'marker-index',
    'marker-icon',
    'connector',
    'label',
    'optional',
    'content',
    'active',
    'completed',
    'error',
    'disabled',
  ],
});
```

`package.json`: `{}`

- [ ] **Step 2: Base theme**

`packages/themes/src/base/stepper/index.ts`:

```ts
import { createThemePart, css } from '@ngneers/controls-themes/api';
import { stepperControlTemplate } from '@ngneers/controls-themes/templates/stepper';

export const stepperStyles = createThemePart({
  controlTemplate: stepperControlTemplate,
  dependencies: [],
  root: {
    css: ({ c }) => css`
      ${c('root')} {
        display: flex;
        flex-direction: column;
      }
      ${c('header')} {
        display: flex;
        align-items: center;
      }
      ${c('step')} {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: none;
        border: none;
        cursor: pointer;
      }
      ${c('step')}[disabled] {
        cursor: default;
      }
      ${c('connector')} {
        flex: 1 1 auto;
        height: 1px;
      }
      ${c('marker')} {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
    `,
  },
});
```

`package.json`: `{}`

- [ ] **Step 3: Nova theme**

`packages/themes/src/nova/stepper/index.ts`:

```ts
import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { stepperControlTemplate } from '@ngneers/controls-themes/templates/stepper';

export const stepperStyles = createThemePart({
  controlTemplate: stepperControlTemplate,
  base: baseStyles.stepper,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('header')} {
        gap: 0.5rem;
        padding: ${v('size.padding.md')} 0;
      }
      ${c('marker')} {
        width: 1.75rem;
        height: 1.75rem;
        border-radius: ${v('size.rounded.full')};
        background: ${v('color.surface.200')};
        color: ${v('color.surface.600')};
        font-weight: ${v('font.weight.semibold')};
        font-size: ${v('font.size.sm')};
      }
      ${c('label')} {
        font-weight: ${v('font.weight.medium')};
        color: ${v('color.surface.600')};
      }
      ${c('optional')} {
        font-size: ${v('font.size.sm')};
        color: ${v('color.surface.400')};
      }
      ${c('connector')} {
        background: ${v('color.surface.300')};
      }
      ${c('content')} {
        padding: ${v('size.padding.lg')} 0;
      }
      ${c('active')} {
        ${c('marker')} {
          background: ${v('color.primary.500')};
          color: #fff;
        }
        ${c('label')} {
          color: ${v('color.surface.900')};
        }
      }
      ${c('completed')} {
        ${c('marker')} {
          background: ${v('color.primary.500')};
          color: #fff;
        }
      }
      ${c('error')} {
        ${c('marker')} {
          background: ${v('color.error.500')};
          color: #fff;
        }
        ${c('label')} {
          color: ${v('color.error.500')};
        }
      }
      ${c('disabled')} {
        opacity: 0.5;
      }
    `,
  },
});
```

`package.json`: `{}`

- [ ] **Step 3b: Shade theme** — create `packages/themes/src/shade/stepper/index.ts` (+ `package.json` `{}`) mirroring the nova part but importing from `@ngneers/controls-themes/shade/base` and using shade tokens (anatomy checklist 4b; model on `packages/themes/src/shade/tabs/index.ts`). Export `stepperStyles`.

- [ ] **Step 4: Register in all 4 barrels** (templates/base/nova/shade `index.ts`; `stepper` / `stepperStyles` / `stepperControlTemplate`). In `shade/index.ts` add the import and the entry in the `createTheme('Shade', [...])` array.

- [ ] **Step 5: Build + commit**

Run: `pnpm --filter @ngneers/controls-themes build` → succeeds.

```bash
git add packages/themes/src/*/stepper packages/themes/src/*/index.ts
git commit -m "feat(stepper): add stepper theme trio"
```

### Task S2: Stepper + step components, harness, tests

**Files:**

- Create: `packages/controls/src/stepper/step.ts`, `stepper.ts`, `stepper.html`, `index.ts`, `ng-package.json`, `package.json`
- Create harness + register test-wrapper + tests (anatomy checklist 5–7).

**Interfaces:**

- `NgnStep` (`ngn-step`): inputs `label`(string), `iconStep`(IconType), `optional`(boolean,false), `disabled`(boolean,false), `error`(boolean,false), `completed`(model<boolean>,false); `content = contentChild<TemplateRef>('content')`.
- `NgnStepper` (`ngn-stepper`): `active = model<number>(0)`, inputs `linear`(boolean,false), `lazy`(boolean,true), `cache`(boolean,true); methods `next()`, `previous()`, `goTo(index)`.

- [ ] **Step 1: Step child**

`packages/controls/src/stepper/step.ts`:

```ts
import {
  booleanAttribute,
  Component,
  contentChild,
  input,
  model,
  TemplateRef,
} from '@angular/core';
import { NgnBase, provideSelf } from '@ngneers/controls/base';

import type { IconType } from '@ngneers/controls-custom-types';

/**
 * A single step within an `ngn-stepper`. Declares the step's header metadata and
 * projects its content via `<ng-template #content>`.
 * @category control
 */
@Component({
  selector: 'ngn-step',
  template: '',
  providers: [provideSelf(NgnStep)],
})
export class NgnStep extends NgnBase<'stepper'> {
  protected readonly theme = null;

  /** The step's header label. */
  public readonly label = input<string>('');
  /** Custom marker icon; when unset the 1-based step number is shown. */
  public readonly iconStep = input<IconType>();
  /** Marks the step optional (shown as a hint; skippable in linear mode). @default false */
  public readonly optional = input(false, { transform: booleanAttribute });
  /** Disables navigation to this step. @default false */
  public readonly disabled = input(false, { transform: booleanAttribute });
  /** Renders the step's marker in an error state. @default false */
  public readonly error = input(false, { transform: booleanAttribute });
  /**
   * Whether the step is complete. The app sets this; in linear mode it gates
   * forward navigation past this step. @default false
   */
  public readonly completed = model(false);

  public readonly content = contentChild<TemplateRef<unknown>>('content');
}
```

- [ ] **Step 2: Stepper parent**

`packages/controls/src/stepper/stepper.ts`:

```ts
import {
  booleanAttribute,
  Component,
  computed,
  contentChildren,
  effect,
  input,
  model,
} from '@angular/core';
import { NgnPt, provideSelf } from '@ngneers/controls/base';
import { NgnDefer } from '@ngneers/controls/defer';
import { NgnIcon } from '@ngneers/controls/icon';
import { NgnRovingGroup, NgnRovingItem } from '@ngneers/controls/roving-focus';
import { stepperControlTemplate } from '@ngneers/controls-themes/templates/stepper';

import { NgnStep } from './step';

/**
 * @category control
 */
@Component({
  selector: 'ngn-stepper',
  templateUrl: './stepper.html',
  imports: [NgnPt, NgnDefer, NgnIcon, NgnRovingGroup, NgnRovingItem],
  providers: [provideSelf(NgnStepper)],
})
export class NgnStepper
  extends /* NgnBase via mixin */ class
    extends // eslint-disable-next-line typescript/no-explicit-any
    (Object as any) {} {
  // NOTE: replaced below — see Step 3 for the correct class declaration.
}
```

> The class-expression scaffold above is deliberately wrong; Step 3 replaces the whole file with the correct declaration. (This avoids a half-written extends clause.)

- [ ] **Step 3: Write the correct stepper component**

Overwrite `packages/controls/src/stepper/stepper.ts`:

```ts
import {
  booleanAttribute,
  Component,
  computed,
  contentChildren,
  effect,
  input,
  model,
} from '@angular/core';
import { NgnBase, NgnPt, provideSelf } from '@ngneers/controls/base';
import { NgnDefer } from '@ngneers/controls/defer';
import { NgnIcon } from '@ngneers/controls/icon';
import { NgnRovingGroup, NgnRovingItem } from '@ngneers/controls/roving-focus';
import { stepperControlTemplate } from '@ngneers/controls-themes/templates/stepper';

import { NgnStep } from './step';

/**
 * @category control
 */
@Component({
  selector: 'ngn-stepper',
  templateUrl: './stepper.html',
  imports: [NgnPt, NgnDefer, NgnIcon, NgnRovingGroup, NgnRovingItem],
  providers: [provideSelf(NgnStepper)],
})
export class NgnStepper extends NgnBase<'stepper'> {
  protected readonly theme = this.injectThemeTemplate(stepperControlTemplate, 'root');

  protected readonly steps = contentChildren(NgnStep);

  /** The active step index (zero-based). @default 0 */
  public readonly active = model<number>(0);
  /** Gate forward navigation on prior steps being `completed`. @default false */
  public readonly linear = input(false, { transform: booleanAttribute });
  /** Lazily render step content (forwarded to `ngn-defer`). @default true */
  public readonly lazy = input(true, { transform: booleanAttribute });
  /** Keep opened step content in the DOM to preserve state (forwarded to `ngn-defer`). @default true */
  public readonly cache = input(true, { transform: booleanAttribute });

  /** Index of the first step that is not yet completed (the furthest reachable in linear mode). */
  private readonly _firstIncomplete = computed(() => {
    const steps = this.steps();
    const idx = steps.findIndex(s => !s.completed());
    return idx === -1 ? steps.length - 1 : idx;
  });

  constructor() {
    super();
    // Clamp active into range when steps change.
    effect(() => {
      const n = this.steps().length;
      if (n === 0) {
        return;
      }
      const a = this.active();
      if (a > n - 1) {
        this.active.set(n - 1);
      } else if (a < 0) {
        this.active.set(0);
      }
    });
  }

  /** Whether navigation to `index` is currently permitted. */
  public canGoTo(index: number): boolean {
    const steps = this.steps();
    const step = steps[index];
    if (!step || step.disabled()) {
      return false;
    }
    if (!this.linear()) {
      return true;
    }
    // Linear: can go backward freely, or forward up to the first incomplete step.
    return index <= Math.max(this.active(), this._firstIncomplete());
  }

  public goTo(index: number): void {
    if (this.canGoTo(index)) {
      this.active.set(index);
    }
  }

  public next(): void {
    this.goTo(this.active() + 1);
  }

  public previous(): void {
    this.goTo(this.active() - 1);
  }

  protected onHeaderActivate(index: number): void {
    this.goTo(index);
  }

  protected stateClasses(index: number) {
    const step = this.steps()[index];
    return {
      active: index === this.active(),
      completed: !!step?.completed(),
      error: !!step?.error(),
      disabled: !!step?.disabled(),
    };
  }
}
```

- [ ] **Step 4: Template**

`packages/controls/src/stepper/stepper.html`:

```html
<div ngnRovingGroup [ptInt]="this" [ptClass]="'header'" role="tablist">
  @for (step of steps(); track $index; let i = $index; let last = $last) {
  <button
    type="button"
    ngnRovingItem
    role="tab"
    [attr.aria-selected]="i === active()"
    [attr.aria-disabled]="!canGoTo(i) ? 'true' : null"
    [disabled]="step.disabled()"
    [ptInt]="this"
    [ptClass]="{ step: true, ...stateClasses(i) }"
    (click)="onHeaderActivate(i)"
  >
    <span [ptInt]="this" [ptClass]="'marker'">
      @if (step.iconStep(); as icon) {
      <ngn-icon [ptInt]="this" [ptClass]="'marker-icon'" [icon]="icon" />
      } @else {
      <span [ptInt]="this" [ptClass]="'marker-index'">{{ i + 1 }}</span>
      }
    </span>
    <span [ptInt]="this" [ptClass]="'label'">
      {{ step.label() }} @if (step.optional()) {
      <span [ptInt]="this" [ptClass]="'optional'">(optional)</span>
      }
    </span>
  </button>
  @if (!last) {
  <span [ptInt]="this" [ptClass]="'connector'"></span>
  } }
</div>

@for (step of steps(); track $index; let i = $index) {
<div
  role="tabpanel"
  [ptInt]="this"
  [ptClass]="{ content: i === active() }"
  [hidden]="i !== active()"
>
  <ngn-defer
    [lazyContent]="step.content()"
    [open]="i === active()"
    [lazy]="lazy()"
    [cache]="cache()"
  />
</div>
}
```

> `stateClasses(i)` returns an object spread into `ptClass`. If `NgnPt`'s `ptClass` does not accept object spread with a boolean map plus a literal key, split into `[ptClass]="'step'"` + `[class...]` bindings, or precompute the full class map in the component. Verify against how `tabs.html` builds its `ptClass` object (it uses `{ header: true, 'header-active': ... }`) — the same shape works, so build the object inline: `[ptClass]="{ step: true, active: i === active(), completed: !!step.completed(), error: !!step.error(), disabled: !!step.disabled() }"` instead of the spread, to be safe.

- [ ] **Step 5: Use the inline class map (avoid spread)**

Edit `stepper.html` to replace `[ptClass]="{ step: true, ...stateClasses(i) }"` with:

```html
[ptClass]="{ step: true, active: i === active(), completed: !!step.completed(), error:
!!step.error(), disabled: !!step.disabled(), }"
```

And remove the now-unused `stateClasses` method from `stepper.ts`.

- [ ] **Step 6: Barrel + entrypoint**

`packages/controls/src/stepper/index.ts`:

```ts
export * from './stepper';
export * from './step';
```

`ng-package.json` (standard) + `package.json` `{}`.

- [ ] **Step 7: Harness**

`packages/playwright/src/components/stepper.ts`:

```ts
import { stepperControlTemplate } from '@ngneers/controls-themes/templates/stepper';
import { themeClasses } from '../utils/theme';
import { expect, type Locator } from '@playwright/test';

export class NgnStepperHarness {
  public readonly classes = themeClasses(stepperControlTemplate);
  public readonly locator: Locator;
  public readonly steps: Locator;

  constructor(locator: Locator) {
    this.locator = locator;
    this.steps = locator.locator(this.classes.step);
  }

  public async expectActive(index: number) {
    await expect(this.steps.nth(index)).toHaveAttribute('aria-selected', 'true');
  }

  public async selectStep(index: number) {
    await this.steps.nth(index).click();
  }

  public async expectStepDisabled(index: number, disabled: boolean) {
    if (disabled) {
      await expect(this.steps.nth(index)).toBeDisabled();
    } else {
      await expect(this.steps.nth(index)).toBeEnabled();
    }
  }
}
```

Add `export * from './stepper';` to the harness barrel.

- [ ] **Step 8: Test-wrapper registration**

Add both to `apps/test-wrapper/src/app/imports.ts`:

```ts
  stepper: () => import('@ngneers/controls/stepper').then(m => m.NgnStepper),
  step: () => import('@ngneers/controls/stepper').then(m => m.NgnStep),
```

- [ ] **Step 9: e2e test**

`tests/components/stepper.test.ts`:

```ts
import test, { expect } from '@playwright/test';
import { NgnStepperHarness } from '@ngneers/controls-playwright';
import { loadComponent } from '../helper/load-component';
import { expectNoA11yViolations } from '../helper/axe';

const TEMPLATE = `
  <ngn-stepper [active]="inputs().active" [linear]="inputs().linear"
    (activeChange)="output('active', $event)">
    <ngn-step [label]="'One'" [completed]="inputs().c0">
      <ng-template #content>Step one content</ng-template>
    </ngn-step>
    <ngn-step [label]="'Two'">
      <ng-template #content>Step two content</ng-template>
    </ngn-step>
    <ngn-step [label]="'Three'">
      <ng-template #content>Step three content</ng-template>
    </ngn-step>
  </ngn-stepper>
`;

test('non-linear: any step selectable', async ({ page }) => {
  const handle = await loadComponent(
    page,
    { template: TEMPLATE, imports: ['stepper', 'step'] },
    { inputs: { active: 0, linear: false, c0: false } }
  );

  const stepper = new NgnStepperHarness(page.locator('ngn-stepper'));
  await stepper.expectActive(0);
  await expect(page.getByText('Step one content')).toBeVisible();

  await stepper.selectStep(2);
  await stepper.expectActive(2);
  await expect(page.getByText('Step three content')).toBeVisible();
});

test('linear: forward gated until completed', async ({ page }) => {
  const handle = await loadComponent(
    page,
    { template: TEMPLATE, imports: ['stepper', 'step'] },
    { inputs: { active: 0, linear: true, c0: false } }
  );

  const stepper = new NgnStepperHarness(page.locator('ngn-stepper'));
  await stepper.expectActive(0);

  // Step 2 is not reachable while step 0 is incomplete.
  await stepper.selectStep(2);
  await stepper.expectActive(0);

  // Complete step 0 → step 1 becomes reachable.
  await handle.setInputs({ c0: true });
  await stepper.selectStep(1);
  await stepper.expectActive(1);
});

test('disabled step not selectable', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `
        <ngn-stepper>
          <ngn-step [label]="'A'"><ng-template #content>A</ng-template></ngn-step>
          <ngn-step [label]="'B'" [disabled]="true"><ng-template #content>B</ng-template></ngn-step>
        </ngn-stepper>`,
      imports: ['stepper', 'step'],
    },
    { inputs: {} }
  );
  const stepper = new NgnStepperHarness(page.locator('ngn-stepper'));
  await stepper.expectStepDisabled(1, true);
});

test('accessibility (axe)', async ({ page }) => {
  await loadComponent(
    page,
    { template: TEMPLATE, imports: ['stepper', 'step'] },
    { inputs: { active: 0 } }
  );
  await expectNoA11yViolations(page);
});
```

- [ ] **Step 10: Build + run**

Run: `pnpm --filter @ngneers/controls-themes build`
Run: `pnpm test -- stepper`
Expected: all PASS. If roving-focus throws "no NgnRovingGroup found", confirm `ngnRovingGroup` is on the header container and `ngnRovingItem` on each button (both imported in the component).

- [ ] **Step 11: Format & commit**

```bash
git add packages/controls/src/stepper packages/playwright/src/components/stepper.ts packages/playwright/src/components/index.ts apps/test-wrapper/src/app/imports.ts tests/components/stepper.test.ts
git commit -m "feat(stepper): add ngn-stepper and ngn-step with harness and tests"
```

### Task S3: Stepper docs + demos

**Files:**

- Create: `apps/docs/src/app/docs/components/stepper/{page.ts,index.md,api.md,a11y.md}`
- Create: `apps/docs/src/app/demos/stepper/{base.ts,linear.ts}`
- Modify: `apps/docs/src/app/docs/components/index.ts`

- [ ] **Step 1: Demos**

`apps/docs/src/app/demos/stepper/base.ts`:

```ts
import { Component, signal } from '@angular/core';
import { NgnStepper, NgnStep } from '@ngneers/controls/stepper';

@Component({
  selector: 'ngn-demo-stepper-base',
  imports: [NgnStepper, NgnStep],
  template: `
    <ngn-stepper [active]="active()" (activeChange)="active.set($event)">
      <ngn-step [label]="'Account'">
        <ng-template #content>Create your account.</ng-template>
      </ngn-step>
      <ngn-step [label]="'Profile'">
        <ng-template #content>Fill in your profile.</ng-template>
      </ngn-step>
      <ngn-step [label]="'Done'">
        <ng-template #content>All set!</ng-template>
      </ngn-step>
    </ngn-stepper>
    <div class="flex gap-2">
      <button (click)="active.set(active() - 1)" [disabled]="active() === 0">Back</button>
      <button (click)="active.set(active() + 1)" [disabled]="active() === 2">Next</button>
    </div>
  `,
})
export class Demo_Stepper_Base {
  protected readonly active = signal(0);
}
```

`apps/docs/src/app/demos/stepper/linear.ts`:

```ts
import { Component, signal } from '@angular/core';
import { NgnStepper, NgnStep } from '@ngneers/controls/stepper';

@Component({
  selector: 'ngn-demo-stepper-linear',
  imports: [NgnStepper, NgnStep],
  template: `
    <ngn-stepper [linear]="true" [active]="active()" (activeChange)="active.set($event)">
      <ngn-step [label]="'Step 1'" [completed]="done0()">
        <ng-template #content>
          <button (click)="done0.set(true)">Complete step 1</button>
        </ng-template>
      </ngn-step>
      <ngn-step [label]="'Step 2'">
        <ng-template #content>You unlocked step 2.</ng-template>
      </ngn-step>
    </ngn-stepper>
  `,
})
export class Demo_Stepper_Linear {
  protected readonly active = signal(0);
  protected readonly done0 = signal(false);
}
```

- [ ] **Step 2: page.ts / index.md / api.md / a11y.md**

`apps/docs/src/app/docs/components/stepper/page.ts`:

```ts
import { Demo_Stepper_Base } from '../../../demos/stepper/base';
import { Demo_Stepper_Linear } from '../../../demos/stepper/linear';

import type { NgnDocsPage } from '../../../utils/page/types';

export const StepperPage: NgnDocsPage = {
  title: `Stepper`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,
      title: 'Examples',
      mdFile: 'components/stepper/index.md',
      components: [Demo_Stepper_Base, Demo_Stepper_Linear],
    },
    { kind: 'single', title: 'API', mdFile: 'components/stepper/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/stepper/a11y.md' },
  ],
};
```

`apps/docs/src/app/docs/components/stepper/index.md`:

```md
The Stepper (`ngn-stepper`) guides the user through an ordered sequence of steps,
showing one step's content at a time under a clickable header. Declare each step
with `ngn-step` and project its body via `<ng-template #content>`. Bind `active`
for the current index; the app drives navigation (e.g. Back/Next buttons or
header clicks).

### Basic Usage

{{ demo: Demo_Stepper_Base }}

### Linear

Set `linear` to require earlier steps be `completed` before later ones can be
reached. The app sets each step's `completed`.

{{ demo: Demo_Stepper_Linear }}
```

`apps/docs/src/app/docs/components/stepper/api.md`:

```md
{{ api: stepper/stepper NgnStepper }}

{{ api: stepper/step NgnStep }}
```

`apps/docs/src/app/docs/components/stepper/a11y.md`:

```md
The header is a `role="tablist"` of `role="tab"` buttons with roving focus
(arrow keys move between headers, Home/End jump to first/last). The active header
has `aria-selected="true"`; gated or disabled steps expose `aria-disabled`. Each
step body is a `role="tabpanel"`.

## Developer responsibilities

- Give each step a meaningful `label` — it is the header's accessible name.
- Content of inactive steps is hidden; with `cache` on (default) it stays in the
  DOM so form state persists across navigation.
```

- [ ] **Step 3: Register the page** in `docs/components/index.ts`.

- [ ] **Step 4: `pnpm docs:build`** → succeeds.

- [ ] **Step 5: Format & commit**

```bash
git add apps/docs/src/app/docs/components/stepper apps/docs/src/app/demos/stepper apps/docs/src/app/docs/components/index.ts
git commit -m "docs(stepper): add stepper docs page and demos"
```

---

# Phase 4 — Color-picker

`ngn-color-picker` extends `ColorPickerTemplates extends ValueControlBase<'color-picker', string>`. A new `utils/color.ts` handles all conversion. The panel has an SV area, hue track, optional alpha track (each driven by `NgnDrag`), a format toggle with hex/numeric fields (`ngn-input`/`ngn-number-input`), swatches, and a preview. Default presentation is a `popover` trigger; `inline` renders the panel directly.

**File structure:**

- `packages/controls/src/utils/color.ts` — pure conversion functions + `color.spec.ts`.
- `packages/controls/src/color-picker/color-picker-templates.ts` — templates base (if any projection; here none needed → may skip and extend `ValueControlBase` directly). **Decision:** color-picker has no template-projection inputs, so it stays flat (extends `ValueControlBase` directly), per the CLAUDE.md rule.
- `packages/controls/src/color-picker/color-picker.ts` + `.html`.
- `packages/controls/src/color-picker/index.ts`, `ng-package.json`, `package.json`.
- Theme trio scope `color-picker`.

### Task C1: Color utility + self-check

**Files:**

- Create: `packages/controls/src/utils/color.ts`; Modify: `packages/controls/src/utils/index.ts` (add `export * from './color';`)
- Create: `packages/controls/src/utils/color.spec.ts`

**Interfaces:**

- Produces:
  - `type RGBA = { r: number; g: number; b: number; a: number }` (r/g/b 0–255, a 0–1)
  - `type HSVA = { h: number; s: number; v: number; a: number }` (h 0–360, s/v 0–1, a 0–1)
  - `type ColorFormat = 'hex' | 'rgb' | 'hsl'`
  - `parseColor(input: string): RGBA | null`
  - `rgbaToHsva(c: RGBA): HSVA`
  - `hsvaToRgba(c: HSVA): RGBA`
  - `formatColor(c: RGBA, format: ColorFormat, withAlpha: boolean): string`

- [ ] **Step 1: Write the failing spec**

`packages/controls/src/utils/color.spec.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { parseColor, rgbaToHsva, hsvaToRgba, formatColor } from './color';

describe('color utils', () => {
  it('parses hex', () => {
    expect(parseColor('#ff0000')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    expect(parseColor('#f00')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    expect(parseColor('#ff000080')?.a).toBeCloseTo(0.5, 1);
  });

  it('parses rgb/rgba', () => {
    expect(parseColor('rgb(10, 20, 30)')).toEqual({ r: 10, g: 20, b: 30, a: 1 });
    expect(parseColor('rgba(10, 20, 30, 0.5)')).toEqual({ r: 10, g: 20, b: 30, a: 0.5 });
  });

  it('parses hsl', () => {
    const red = parseColor('hsl(0, 100%, 50%)');
    expect(red?.r).toBe(255);
    expect(red?.g).toBe(0);
    expect(red?.b).toBe(0);
  });

  it('returns null for garbage', () => {
    expect(parseColor('not-a-color')).toBeNull();
  });

  it('round-trips rgb <-> hsv', () => {
    const original = { r: 123, g: 45, b: 200, a: 1 };
    const back = hsvaToRgba(rgbaToHsva(original));
    expect(back.r).toBeCloseTo(123, 0);
    expect(back.g).toBeCloseTo(45, 0);
    expect(back.b).toBeCloseTo(200, 0);
  });

  it('formats', () => {
    const c = { r: 255, g: 0, b: 0, a: 0.5 };
    expect(formatColor(c, 'hex', false)).toBe('#ff0000');
    expect(formatColor(c, 'hex', true)).toBe('#ff000080');
    expect(formatColor(c, 'rgb', true)).toBe('rgba(255, 0, 0, 0.5)');
    expect(formatColor({ r: 255, g: 0, b: 0, a: 1 }, 'hsl', false)).toBe('hsl(0, 100%, 50%)');
  });
});
```

- [ ] **Step 2: Run it, verify it fails**

Run: `pnpm vitest run packages/controls/src/utils/color.spec.ts`
Expected: FAIL (module not found / functions undefined).

- [ ] **Step 3: Implement `color.ts`**

`packages/controls/src/utils/color.ts`:

```ts
/** RGBA color. r/g/b are 0–255, a is 0–1. */
export type RGBA = { r: number; g: number; b: number; a: number };
/** HSVA color. h is 0–360, s/v/a are 0–1. */
export type HSVA = { h: number; s: number; v: number; a: number };
/** Supported serialization formats. */
export type ColorFormat = 'hex' | 'rgb' | 'hsl';

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
const round = (n: number) => Math.round(n);

/** Parse a hex / rgb(a) / hsl(a) string into RGBA, or null if unrecognized. */
export function parseColor(input: string): RGBA | null {
  const s = input.trim().toLowerCase();

  // hex
  const hex = s.match(/^#([0-9a-f]{3,8})$/);
  if (hex) {
    const h = hex[1]!;
    if (h.length === 3 || h.length === 4) {
      const r = parseInt(h[0]! + h[0]!, 16);
      const g = parseInt(h[1]! + h[1]!, 16);
      const b = parseInt(h[2]! + h[2]!, 16);
      const a = h.length === 4 ? parseInt(h[3]! + h[3]!, 16) / 255 : 1;
      return { r, g, b, a };
    }
    if (h.length === 6 || h.length === 8) {
      const r = parseInt(h.slice(0, 2), 16);
      const g = parseInt(h.slice(2, 4), 16);
      const b = parseInt(h.slice(4, 6), 16);
      const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
      return { r, g, b, a };
    }
    return null;
  }

  // rgb / rgba
  const rgb = s.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+))?\s*\)$/);
  if (rgb) {
    return {
      r: clamp(round(parseFloat(rgb[1]!)), 0, 255),
      g: clamp(round(parseFloat(rgb[2]!)), 0, 255),
      b: clamp(round(parseFloat(rgb[3]!)), 0, 255),
      a: rgb[4] !== undefined ? clamp(parseFloat(rgb[4]), 0, 1) : 1,
    };
  }

  // hsl / hsla
  const hsl = s.match(
    /^hsla?\(\s*([\d.]+)[,\s]+([\d.]+)%[,\s]+([\d.]+)%(?:[,\s/]+([\d.]+))?\s*\)$/
  );
  if (hsl) {
    const h = parseFloat(hsl[1]!);
    const sl = parseFloat(hsl[2]!) / 100;
    const l = parseFloat(hsl[3]!) / 100;
    const a = hsl[4] !== undefined ? clamp(parseFloat(hsl[4]), 0, 1) : 1;
    return { ...hslToRgb(h, sl, l), a };
  }

  return null;
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return { r: round((r + m) * 255), g: round((g + m) * 255), b: round((b + m) * 255) };
}

/** RGBA → HSVA. */
export function rgbaToHsva({ r, g, b, a }: RGBA): HSVA {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : d / max;
  return { h, s, v: max, a };
}

/** HSVA → RGBA. */
export function hsvaToRgba({ h, s, v, a }: HSVA): RGBA {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return { r: round((r + m) * 255), g: round((g + m) * 255), b: round((b + m) * 255), a };
}

const toHex2 = (n: number) => clamp(round(n), 0, 255).toString(16).padStart(2, '0');

/** Serialize RGBA to the given format. `withAlpha` includes the alpha channel. */
export function formatColor(c: RGBA, format: ColorFormat, withAlpha: boolean): string {
  const a = clamp(c.a, 0, 1);
  if (format === 'hex') {
    const base = `#${toHex2(c.r)}${toHex2(c.g)}${toHex2(c.b)}`;
    return withAlpha ? `${base}${toHex2(a * 255)}` : base;
  }
  if (format === 'rgb') {
    return withAlpha
      ? `rgba(${round(c.r)}, ${round(c.g)}, ${round(c.b)}, ${+a.toFixed(2)})`
      : `rgb(${round(c.r)}, ${round(c.g)}, ${round(c.b)})`;
  }
  // hsl
  const { h, s, v } = rgbaToHsva(c);
  const l = v - (v * s) / 2;
  const sl = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);
  const H = round(h);
  const S = round(sl * 100);
  const L = round(l * 100);
  return withAlpha ? `hsla(${H}, ${S}%, ${L}%, ${+a.toFixed(2)})` : `hsl(${H}, ${S}%, ${L}%)`;
}
```

Add `export * from './color';` to `packages/controls/src/utils/index.ts`.

- [ ] **Step 4: Run the spec, verify it passes**

Run: `pnpm vitest run packages/controls/src/utils/color.spec.ts`
Expected: PASS (all cases).

- [ ] **Step 5: Format & commit**

```bash
git add packages/controls/src/utils/color.ts packages/controls/src/utils/color.spec.ts packages/controls/src/utils/index.ts
git commit -m "feat(color): add color conversion utilities"
```

### Task C2: Color-picker theme trio

**Interfaces:**

- Produces: `colorPickerControlTemplate` scope `'color-picker'`, classNames `['root', 'trigger', 'preview', 'panel', 'sv-area', 'sv-thumb', 'hue-track', 'hue-thumb', 'alpha-track', 'alpha-thumb', 'swatches', 'swatch', 'fields', 'invalid', 'disabled']`.

- [ ] **Step 1: Template scope**

`packages/themes/src/templates/color-picker/index.ts`:

```ts
import { createControlTemplate } from '@ngneers/controls-themes/api';

export const colorPickerControlTemplate = createControlTemplate({
  scope: 'color-picker',
  classNames: [
    'root',
    'trigger',
    'preview',
    'panel',
    'sv-area',
    'sv-thumb',
    'hue-track',
    'hue-thumb',
    'alpha-track',
    'alpha-thumb',
    'swatches',
    'swatch',
    'fields',
    'invalid',
    'disabled',
  ],
});
```

`package.json`: `{}`

- [ ] **Step 2: Base theme (structural geometry)**

`packages/themes/src/base/color-picker/index.ts`:

```ts
import { createThemePart, css } from '@ngneers/controls-themes/api';
import { colorPickerControlTemplate } from '@ngneers/controls-themes/templates/color-picker';

export const colorPickerStyles = createThemePart({
  controlTemplate: colorPickerControlTemplate,
  dependencies: [],
  root: {
    css: ({ c }) => css`
      ${c('root')} {
        display: inline-block;
      }
      ${c('panel')} {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        width: 16rem;
      }
      ${c('sv-area')} {
        position: relative;
        width: 100%;
        height: 10rem;
        touch-action: none;
        cursor: crosshair;
        /* --hue is set by the component (0..360) */
        background:
          linear-gradient(to top, #000, transparent),
          linear-gradient(to right, #fff, hsl(var(--hue), 100%, 50%));
      }
      ${c('sv-thumb')}, ${c('hue-thumb')}, ${c('alpha-thumb')} {
        position: absolute;
        pointer-events: none;
        transform: translate(-50%, -50%);
      }
      ${c('hue-track')} {
        position: relative;
        height: 0.75rem;
        touch-action: none;
        cursor: pointer;
        background: linear-gradient(
          to right,
          #f00 0%,
          #ff0 17%,
          #0f0 33%,
          #0ff 50%,
          #00f 67%,
          #f0f 83%,
          #f00 100%
        );
      }
      ${c('alpha-track')} {
        position: relative;
        height: 0.75rem;
        touch-action: none;
        cursor: pointer;
      }
      ${c('hue-thumb')}, ${c('alpha-thumb')} {
        top: 50%;
      }
      ${c('swatches')} {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem;
      }
    `,
  },
});
```

`package.json`: `{}`

- [ ] **Step 3: Nova theme (surfaces, thumbs, trigger)**

`packages/themes/src/nova/color-picker/index.ts`:

```ts
import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { colorPickerControlTemplate } from '@ngneers/controls-themes/templates/color-picker';

export const colorPickerStyles = createThemePart({
  controlTemplate: colorPickerControlTemplate,
  base: baseStyles['color-picker'],
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('trigger')} {
        width: 2.25rem;
        height: 2.25rem;
        border-radius: ${v('size.rounded.md')};
        border: 1px solid ${v('color.surface.300')};
        cursor: pointer;
        padding: 0.25rem;
      }
      ${c('preview')} {
        width: 100%;
        height: 100%;
        border-radius: ${v('size.rounded.sm')};
      }
      ${c('panel')} {
        padding: ${v('size.padding.md')};
        background: ${v('color.background')};
        border: 1px solid ${v('color.surface.300')};
        border-radius: ${v('size.rounded.md')};
      }
      ${c('sv-area')}, ${c('hue-track')}, ${c('alpha-track')} {
        border-radius: ${v('size.rounded.sm')};
      }
      ${c('sv-thumb')} {
        width: 0.75rem;
        height: 0.75rem;
        border-radius: ${v('size.rounded.full')};
        border: 2px solid #fff;
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3);
      }
      ${c('hue-thumb')}, ${c('alpha-thumb')} {
        width: 1rem;
        height: 1rem;
        border-radius: ${v('size.rounded.full')};
        background: #fff;
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3);
      }
      ${c('swatch')} {
        width: 1.25rem;
        height: 1.25rem;
        border-radius: ${v('size.rounded.sm')};
        border: 1px solid ${v('color.surface.300')};
        cursor: pointer;
        padding: 0;
      }
      ${c('disabled')} {
        opacity: 0.5;
        pointer-events: none;
      }
      ${c('invalid')} {
        ${c('trigger')} {
          border-color: ${v('color.error.500')};
        }
      }
    `,
  },
});
```

`package.json`: `{}`

> ponytail: this CSS is functional starter — the SV/hue/alpha gradients and thumb placements are correct, but visual polish (sizing, shadows, dark mode) needs a real pass in the browser. Leave it tunable.

- [ ] **Step 3b: Shade theme** — create `packages/themes/src/shade/color-picker/index.ts` (+ `package.json` `{}`) mirroring the nova part but importing from `@ngneers/controls-themes/shade/base` and using shade tokens (anatomy checklist 4b; model on `packages/themes/src/shade/slider/index.ts`). Export `colorPickerStyles`.

- [ ] **Step 4: Register in all 4 barrels** (templates/base/nova/shade `index.ts`; key `'color-picker'`, `colorPickerStyles`, `colorPickerControlTemplate`). Note the quoted key `'color-picker'` in the maps (hyphen). In `shade/index.ts` add the import and the array entry.

- [ ] **Step 5: Build + commit**

Run: `pnpm --filter @ngneers/controls-themes build` → succeeds.

```bash
git add packages/themes/src/*/color-picker packages/themes/src/*/index.ts
git commit -m "feat(color-picker): add color-picker theme trio"
```

### Task C3: Color-picker component (value I/O + inline panel) + harness + tests

**Files:**

- Create: `packages/controls/src/color-picker/color-picker.ts`, `color-picker.html`, `index.ts`, `ng-package.json`, `package.json`
- Harness + test-wrapper registration + test (anatomy checklist).

**Interfaces:**

- Consumes: `ValueControlBase`, `NgnPt`, `provideSelf`; `NgnDrag`, `NgnDragInfo`; color utils; `NgnPopover` (verify selector/API) for the trigger.
- Produces: `NgnColorPicker` with inputs `format`(ColorFormat,'hex'), `alpha`(boolean,true), `swatches`(string[]), `inline`(boolean,false) + inherited value control inputs.

- [ ] **Step 1: Component (state + I/O)**

`packages/controls/src/color-picker/color-picker.ts`:

```ts
import { Component, computed, effect, ElementRef, input, signal, viewChild } from '@angular/core';
import { NgnPt, provideSelf, ValueControlBase } from '@ngneers/controls/base';
import { NgnDrag, type NgnDragInfo } from '@ngneers/controls/directives';
import {
  type ColorFormat,
  formatColor,
  hsvaToRgba,
  type HSVA,
  parseColor,
  rgbaToHsva,
} from '@ngneers/controls/utils';
import { colorPickerControlTemplate } from '@ngneers/controls-themes/templates/color-picker';

const DEFAULT_HSVA: HSVA = { h: 0, s: 0, v: 0, a: 1 };

/**
 * @category control
 */
@Component({
  selector: 'ngn-color-picker',
  templateUrl: './color-picker.html',
  imports: [NgnPt, NgnDrag],
  providers: [provideSelf(NgnColorPicker)],
  host: {
    '[style.--hue]': 'hsva().h',
  },
})
export class NgnColorPicker extends ValueControlBase<'color-picker', string> {
  protected readonly theme = this.injectThemeTemplate(colorPickerControlTemplate, {
    root: true,
    invalid: () => this.invalidState(),
    disabled: () => this.disabled(),
  });

  private readonly _svArea = viewChild<ElementRef<HTMLElement>>('svArea');
  private readonly _hueTrack = viewChild<ElementRef<HTMLElement>>('hueTrack');
  private readonly _alphaTrack = viewChild<ElementRef<HTMLElement>>('alphaTrack');

  /** Output/display format. @default hex */
  public readonly format = input<ColorFormat>('hex');
  /** Show the alpha channel. @default true */
  public readonly alpha = input<boolean>(true);
  /** Preset swatch colors. */
  public readonly swatches = input<string[]>();
  /** Render the panel inline instead of behind a trigger. @default false */
  public readonly inline = input<boolean>(false);

  /** Internal HSVA source of truth. */
  protected readonly hsva = signal<HSVA>(DEFAULT_HSVA);
  /** Popover open state (non-inline). */
  protected readonly open = signal(false);

  /** Current color as a CSS string for previews. */
  protected readonly cssColor = computed(() => {
    const rgba = hsvaToRgba(this.hsva());
    return formatColor(rgba, 'rgb', true);
  });

  constructor() {
    super();
    // Sync incoming value → hsva (skip while the user is dragging to avoid feedback loops).
    effect(() => {
      const v = this.value();
      if (v == null) {
        return;
      }
      const rgba = parseColor(v);
      if (rgba) {
        this.hsva.set(rgbaToHsva(rgba));
      }
    });
  }

  /** Commit the current HSVA to the model value in the active format. */
  private commit(): void {
    const rgba = hsvaToRgba(this.hsva());
    this.value.set(formatColor(rgba, this.format(), this.alpha() && rgba.a < 1));
  }

  protected onSvDrag(info: NgnDragInfo): void {
    const el = this._svArea()?.nativeElement;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const s = clamp01((info.absoluteX - rect.left) / rect.width);
    const v = clamp01(1 - (info.absoluteY - rect.top) / rect.height);
    this.hsva.update(c => ({ ...c, s, v }));
    this.commit();
  }

  protected onHueDrag(info: NgnDragInfo): void {
    const el = this._hueTrack()?.nativeElement;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const h = clamp01((info.absoluteX - rect.left) / rect.width) * 360;
    this.hsva.update(c => ({ ...c, h }));
    this.commit();
  }

  protected onAlphaDrag(info: NgnDragInfo): void {
    const el = this._alphaTrack()?.nativeElement;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const a = clamp01((info.absoluteX - rect.left) / rect.width);
    this.hsva.update(c => ({ ...c, a }));
    this.commit();
  }

  protected selectSwatch(color: string): void {
    const rgba = parseColor(color);
    if (rgba) {
      this.hsva.set(rgbaToHsva(rgba));
      this.commit();
    }
  }

  protected toggleOpen(): void {
    if (this.disabled() || this.readonly()) return;
    this.open.update(o => !o);
  }

  // Thumb positions (0..100%) for the template.
  protected readonly svThumbLeft = computed(() => this.hsva().s * 100);
  protected readonly svThumbTop = computed(() => (1 - this.hsva().v) * 100);
  protected readonly hueThumbLeft = computed(() => (this.hsva().h / 360) * 100);
  protected readonly alphaThumbLeft = computed(() => this.hsva().a * 100);
}

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}
```

> ponytail: `commit()` is called on every drag frame — fine at this scale. If value churn matters later, debounce or commit on `dragEnd`; leave that knob for measured need.

- [ ] **Step 2: Template (inline panel first; trigger added in C5)**

`packages/controls/src/color-picker/color-picker.html`:

```html
<!-- eslint-disable @angular-eslint/template/click-events-have-key-events -->
<!-- eslint-disable @angular-eslint/template/interactive-supports-focus -->
@if (inline()) {
<ng-container [ngTemplateOutlet]="panel" />
} @else {
<button type="button" [ptInt]="this" [ptClass]="'trigger'" (click)="toggleOpen()">
  <span [ptInt]="this" [ptClass]="'preview'" [style.background]="cssColor()"></span>
</button>
@if (open()) {
<ng-container [ngTemplateOutlet]="panel" />
} }

<ng-template #panel>
  <div [ptInt]="this" [ptClass]="'panel'">
    <div
      #svArea
      [ptInt]="this"
      [ptClass]="'sv-area'"
      ngnDrag
      (dragged)="onSvDrag($event)"
      (click)="onSvDrag({ absoluteX: $event.clientX, absoluteY: $event.clientY, deltaX: 0, deltaY: 0 })"
    >
      <span
        [ptInt]="this"
        [ptClass]="'sv-thumb'"
        [style.left.%]="svThumbLeft()"
        [style.top.%]="svThumbTop()"
      ></span>
    </div>

    <div
      #hueTrack
      [ptInt]="this"
      [ptClass]="'hue-track'"
      ngnDrag
      (dragged)="onHueDrag($event)"
      (click)="onHueDrag({ absoluteX: $event.clientX, absoluteY: $event.clientY, deltaX: 0, deltaY: 0 })"
    >
      <span [ptInt]="this" [ptClass]="'hue-thumb'" [style.left.%]="hueThumbLeft()"></span>
    </div>

    @if (alpha()) {
    <div
      #alphaTrack
      [ptInt]="this"
      [ptClass]="'alpha-track'"
      [style.background]="'linear-gradient(to right, transparent, ' + cssColor() + ')'"
      ngnDrag
      (dragged)="onAlphaDrag($event)"
      (click)="onAlphaDrag({ absoluteX: $event.clientX, absoluteY: $event.clientY, deltaX: 0, deltaY: 0 })"
    >
      <span [ptInt]="this" [ptClass]="'alpha-thumb'" [style.left.%]="alphaThumbLeft()"></span>
    </div>
    } @if (swatches(); as sw) {
    <div [ptInt]="this" [ptClass]="'swatches'">
      @for (color of sw; track color) {
      <button
        type="button"
        [ptInt]="this"
        [ptClass]="'swatch'"
        [style.background]="color"
        (click)="selectSwatch(color)"
      ></button>
      }
    </div>
    }
  </div>
</ng-template>
```

- [ ] **Step 3: Add NgTemplateOutlet import**

Edit `color-picker.ts` imports to include `NgTemplateOutlet` from `@angular/common`: `imports: [NgTemplateOutlet, NgnPt, NgnDrag]`.

- [ ] **Step 4: Barrel + entrypoint**

`packages/controls/src/color-picker/index.ts`:

```ts
export * from './color-picker';
```

`ng-package.json` (standard) + `package.json` `{}`.

- [ ] **Step 5: Harness**

`packages/playwright/src/components/color-picker.ts`:

```ts
import { colorPickerControlTemplate } from '@ngneers/controls-themes/templates/color-picker';
import { themeClasses } from '../utils/theme';
import { expect, type Locator } from '@playwright/test';

export class NgnColorPickerHarness {
  public readonly classes = themeClasses(colorPickerControlTemplate);
  public readonly locator: Locator;
  public readonly trigger: Locator;
  public readonly panel: Locator;
  public readonly svArea: Locator;
  public readonly hueTrack: Locator;
  public readonly swatches: Locator;

  constructor(locator: Locator) {
    this.locator = locator;
    this.trigger = locator.locator(this.classes.trigger);
    this.panel = locator.locator(this.classes.panel);
    this.svArea = locator.locator(this.classes['sv-area']);
    this.hueTrack = locator.locator(this.classes['hue-track']);
    this.swatches = locator.locator(this.classes.swatch);
  }

  public async open() {
    await this.trigger.click();
    await expect(this.panel).toBeVisible();
  }

  public async clickSv(xRatio: number, yRatio: number) {
    const box = await this.svArea.boundingBox();
    if (!box) throw new Error('sv-area not found');
    await this.svArea.click({ position: { x: box.width * xRatio, y: box.height * yRatio } });
  }

  public async clickHue(xRatio: number) {
    const box = await this.hueTrack.boundingBox();
    if (!box) throw new Error('hue-track not found');
    await this.hueTrack.click({ position: { x: box.width * xRatio, y: box.height / 2 } });
  }
}
```

Add `export * from './color-picker';` to the harness barrel.

- [ ] **Step 6: Test-wrapper registration**

```ts
  'color-picker': () => import('@ngneers/controls/color-picker').then(m => m.NgnColorPicker),
```

- [ ] **Step 7: e2e test**

`tests/components/color-picker.test.ts`:

```ts
import test, { expect } from '@playwright/test';
import { NgnColorPickerHarness } from '@ngneers/controls-playwright';
import { loadComponent } from '../helper/load-component';
import { expectScreenshot } from '../helper/screenshot';

test('inline: reflects bound value', async ({ page }, testInfo) => {
  await loadComponent(
    page,
    {
      template: `<ngn-color-picker [inline]="true" [value]="inputs().value" (valueChange)="output('value', $event)" />`,
      imports: ['color-picker'],
    },
    { inputs: { value: '#ff0000' } }
  );

  const cp = new NgnColorPickerHarness(page.locator('ngn-color-picker'));
  await expect(cp.panel).toBeVisible();
  await expectScreenshot(page, testInfo, 'inline-red');
});

test('clicking hue + sv updates value', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `<ngn-color-picker [inline]="true" [alpha]="false" [value]="inputs().value" (valueChange)="output('value', $event)" />`,
      imports: ['color-picker'],
    },
    { inputs: { value: '#ff0000' } }
  );

  const cp = new NgnColorPickerHarness(page.locator('ngn-color-picker'));
  await cp.clickSv(1, 0); // full saturation, full value
  await cp.clickHue(0.33); // ~green

  const log = await handle.getOutputLog();
  const values = log['value'] as string[];
  expect(values.length).toBeGreaterThan(0);
  // last emitted value should be a valid hex
  expect(values[values.length - 1]).toMatch(/^#[0-9a-f]{6}$/i);
});

test('swatch selection sets value', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `<ngn-color-picker [inline]="true" [alpha]="false" [swatches]="inputs().swatches" (valueChange)="output('value', $event)" />`,
      imports: ['color-picker'],
    },
    { inputs: { swatches: ['#123456', '#abcdef'] } }
  );

  const cp = new NgnColorPickerHarness(page.locator('ngn-color-picker'));
  await cp.swatches.nth(0).click();
  const log = await handle.getOutputLog();
  expect((log['value'] as string[]).at(-1)?.toLowerCase()).toBe('#123456');
});

test('trigger opens panel (non-inline)', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `<ngn-color-picker [value]="'#00ff00'" />`,
      imports: ['color-picker'],
    },
    { inputs: {} }
  );
  const cp = new NgnColorPickerHarness(page.locator('ngn-color-picker'));
  await expect(cp.panel).toHaveCount(0);
  await cp.open();
});
```

- [ ] **Step 8: Build + run**

Run: `pnpm --filter @ngneers/controls-themes build`
Run: `pnpm test -- color-picker`
Expected: all PASS. If SV/hue clicks don't emit, confirm the `(click)` handlers build the `NgnDragInfo`-shaped object and the `viewChild` refs resolve (they only exist when the panel is rendered).

- [ ] **Step 9: Format & commit**

```bash
git add packages/controls/src/color-picker packages/playwright/src/components/color-picker.ts packages/playwright/src/components/index.ts apps/test-wrapper/src/app/imports.ts tests/components/color-picker.test.ts
git commit -m "feat(color-picker): add ngn-color-picker with sv/hue/alpha and swatches"
```

### Task C4: Popover trigger polish + format toggle + text fields

**Files:**

- Modify: `packages/controls/src/color-picker/color-picker.ts`, `color-picker.html`

**Interfaces:**

- Consumes: `NgnPopover` (or the repo's popover directive/control — verify exact selector via `packages/controls/src/popover/index.ts`), `NgnInput`, `NgnNumberInput`.

- [ ] **Step 1: Inspect popover API**

Run: `sed -n '1,60p' packages/controls/src/popover/*.ts` and note the trigger/anchor API (how `dialog`/`tooltip`/`select` open a floating panel). Choose the same mechanism the `select` control uses for its dropdown, since color-picker's trigger→panel is the same shape.

- [ ] **Step 2: Replace the hand-rolled `@if (open())` panel with the repo's popover**

Wire the trigger button as the popover anchor and the `#panel` template as its content, mirroring `select`. Keep `inline()` rendering the panel directly (no popover). Update `toggleOpen`/`open` to whatever the popover exposes (it may own its own open state — if so, drop the local `open` signal). Call `markTouched()` when the popover closes (blur contract), mirroring how `select` calls `markTouched()` from its popover-aware blur.

> This step has no verbatim code because it must match the exact popover API in the repo, which the executor inspects in Step 1. The acceptance check is Step 4.

- [ ] **Step 3: Add a format toggle + hex field**

Add a `<button>` cycling `format` through `hex → rgb → hsl` (local signal mirroring the input, since `format` is an input; expose a `model` instead if two-way is wanted — **decision:** keep `format` an input and add an internal `activeFormat = signal<ColorFormat>(this.format())` seeded by an effect, toggled by the button). Add an `ngn-input` bound to a computed hex string that parses on change via `parseColor` → `hsva` → `commit()`. Reuse `formatColor`/`parseColor`.

Add to component:

```ts
protected readonly activeFormat = signal<ColorFormat>('hex');
// in constructor: effect(() => this.activeFormat.set(this.format()));
protected cycleFormat(): void {
  const order: ColorFormat[] = ['hex', 'rgb', 'hsl'];
  const i = order.indexOf(this.activeFormat());
  this.activeFormat.set(order[(i + 1) % order.length]!);
}
protected readonly textValue = computed(() =>
  formatColor(hsvaToRgba(this.hsva()), this.activeFormat(), this.alpha() && this.hsva().a < 1)
);
protected applyText(text: string): void {
  const rgba = parseColor(text);
  if (rgba) {
    this.hsva.set(rgbaToHsva(rgba));
    this.commit();
  }
}
```

Add a `fields` row to the panel template with the toggle button and an `ngn-input` (`[value]="textValue()"` `(valueChange)`/blur → `applyText($event)`). Add `NgnInput` to imports.

- [ ] **Step 4: Verify in the running app**

Follow the preview verification workflow (dev server on 4200, or `pnpm docs:build`): open the color-picker docs page (built in C6), confirm the trigger opens the popover, dragging the SV/hue/alpha updates the preview, the format toggle cycles, and typing a hex updates the swatch. Re-run `pnpm test -- color-picker`.

- [ ] **Step 5: Format & commit**

```bash
git add packages/controls/src/color-picker
git commit -m "feat(color-picker): popover trigger, format toggle, hex/text field"
```

### Task C5: Color-picker docs + demos

**Files:**

- Create: `apps/docs/src/app/docs/components/color-picker/{page.ts,index.md,api.md,a11y.md,playground.ts}`
- Create: `apps/docs/src/app/demos/color-picker/{base.ts,inline.ts,swatches.ts}`
- Modify: `apps/docs/src/app/docs/components/index.ts`

- [ ] **Step 1: Demos**

`apps/docs/src/app/demos/color-picker/base.ts`:

```ts
import { Component, signal } from '@angular/core';
import { NgnColorPicker } from '@ngneers/controls/color-picker';

@Component({
  selector: 'ngn-demo-color-picker-base',
  imports: [NgnColorPicker],
  template: `
    <ngn-color-picker [value]="value()" (valueChange)="value.set($event)" />
    <span class="ml-3">{{ value() }}</span>
  `,
  host: { class: 'flex items-center' },
})
export class Demo_ColorPicker_Base {
  protected readonly value = signal('#3b82f6');
}
```

`apps/docs/src/app/demos/color-picker/inline.ts`:

```ts
import { Component, signal } from '@angular/core';
import { NgnColorPicker } from '@ngneers/controls/color-picker';

@Component({
  selector: 'ngn-demo-color-picker-inline',
  imports: [NgnColorPicker],
  template: `<ngn-color-picker
    [inline]="true"
    [value]="value()"
    (valueChange)="value.set($event)"
  />`,
})
export class Demo_ColorPicker_Inline {
  protected readonly value = signal('#10b981');
}
```

`apps/docs/src/app/demos/color-picker/swatches.ts`:

```ts
import { Component, signal } from '@angular/core';
import { NgnColorPicker } from '@ngneers/controls/color-picker';

@Component({
  selector: 'ngn-demo-color-picker-swatches',
  imports: [NgnColorPicker],
  template: `
    <ngn-color-picker
      [inline]="true"
      [swatches]="['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6']"
      [value]="value()"
      (valueChange)="value.set($event)"
    />
  `,
})
export class Demo_ColorPicker_Swatches {
  protected readonly value = signal('#3b82f6');
}
```

- [ ] **Step 2: page.ts / index.md / api.md / a11y.md / playground.ts** (mirror the rating structure; scope name `color-picker`, `{{ api: color-picker/color-picker NgnColorPicker }}`, demos `Demo_ColorPicker_Base/Inline/Swatches`).

- [ ] **Step 3: Register the page** in `docs/components/index.ts`.

- [ ] **Step 4: `pnpm docs:build`** → succeeds.

- [ ] **Step 5: Format & commit**

```bash
git add apps/docs/src/app/docs/components/color-picker apps/docs/src/app/demos/color-picker apps/docs/src/app/docs/components/index.ts
git commit -m "docs(color-picker): add color-picker docs page and demos"
```

---

## Final verification

- [ ] Run the full e2e suite for the four controls: `pnpm test -- badge rating stepper color-picker`.
- [ ] `pnpm --filter @ngneers/controls-themes build` clean.
- [ ] `pnpm docs:build` clean; all four pages appear in the sidebar (remember to click "Get Started" first when previewing).
- [ ] `pnpm format` over all changed files (oxfmt `.ts`/`.json`/`.md`, Prettier `.html`).
- [ ] Lint clean: run the repo's oxlint command over changed files.

## Self-review notes (author)

- **Spec coverage:** every spec section maps to a task — badge (B1–B3), rating incl. `indicatorTemplate` (R1–R3), stepper incl. linear gating + `ngn-defer` (S1–S3), color-picker incl. `utils/color.ts` + SV/hue/alpha + swatches + inline/popover + format toggle (C1–C5). ✅
- **Deliberately deferred (YAGNI, matches spec non-goals):** rating drag-to-set, vertical stepper, color EyeDropper/gradient stops, badge non-corner positions.
- **Known ceilings flagged with `ponytail:`** — badge `--theme-color-on-primary` fallback, color-picker per-frame `commit()`, starter theme CSS needing a browser polish pass.
- **Riskiest steps needing live verification:** default-icon registration for rating (R2 Step 6), the exact popover API for color-picker (C4 Steps 1–2), and whether `NgnPt` `ptClass` accepts the object map shape (handled by the tabs-proven inline object in S2 Step 5).
