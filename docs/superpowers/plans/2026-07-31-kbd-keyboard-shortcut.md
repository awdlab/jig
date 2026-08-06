# kbd Component + keyboard-shortcut Directive Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship an `ngn-kbd` control that renders a shortcut string as glyphs, a `[ngnKeyboardShortcut]` directive that runs callbacks for those strings scoped to focus within its host, and a `shortcut` field on `NgnActionButtonConfig` that registers itself with the nearest ancestor scope — with the dialog root acting as one.

**Architecture:** A pure, Angular-free `shortcut.ts` (parse / match / format) is the shared core. `NgnKbd` is a display-only control built on it. `NgnKeyboardShortcut` is an attribute directive with a single host `keydown` listener — scoping and inner-wins fall out of DOM bubbling plus `stopPropagation()`, so there is no registry service and no document listener. `NgnActionButton` injects the ancestor directive optionally and registers a getter-based binding.

**Tech Stack:** Angular 21 (signals, zoneless), strict TypeScript, pnpm workspace, Vitest via `@angular/build:unit-test` for unit specs, Playwright for e2e, the repo's theme-template system (`createControlTemplate` / `createThemePart`).

**Spec:** `docs/superpowers/specs/2026-07-31-kbd-keyboard-shortcut-design.md`

## Global Constraints

- **Do not commit.** The user commits their own work. Every task ends at a green verification command; leave changes in the working tree. Do not create branches either — work on the current branch.
- pnpm only, never npm or yarn.
- Modern signals API only: `input()`, `model()`, `computed()`, `signal()`, `output()`. No `@Input()` / `@Output()` decorators.
- Boolean inputs use `input(false, { transform: booleanAttribute })`.
- Icon inputs use an `icon` prefix. Directive inputs are aliased `ngn{Directive}{PascalCase(propertyName)}`.
- Every `input()` / `model()` / `output()` gets a 1–2 sentence TSDoc; `@default <value>` unquoted for non-obvious defaults; `{@link other}` for cross-references.
- No component-level CSS or SCSS. All styling flows through the theme system. Tailwind utility classes are allowed in docs demos only.
- 2-space indent, single quotes. Imports use `@ngneers/*` path aliases, never relative cross-package paths.
- Comments are short one-liners describing what the code does now. No decision logs, no references to earlier states or task numbers.
- After edits in a task, format the touched files: `pnpm exec oxfmt <files>` for `.ts` / `.json` / `.md` and `pnpm prettier --write <files>` for `.html`. Never run bare `pnpm format` — it reformats the whole repo.
- Unit spec command (verified working, ~15s): `pnpm --filter @ngneers/controls exec ng test --watch=false --include="src/kbd/**/*.spec.ts"`
- Theme folders need an empty `package.json` (`{}`) marker beside `index.ts`, or the dist subpath export is never generated.
- `tests/components/*.test.ts` are **Playwright** e2e. Colocated `src/**/*.spec.ts` are **Vitest** unit tests. Do not mix them up.

---

## File Structure

**Created**

| File                                                                                    | Responsibility                                                      |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `packages/controls/src/kbd/shortcut.ts`                                                 | Pure parse / match / format / platform helpers. No Angular imports. |
| `packages/controls/src/kbd/shortcut.spec.ts`                                            | Vitest table tests for the helpers.                                 |
| `packages/controls/src/kbd/kbd.ts`                                                      | `NgnKbd` display control.                                           |
| `packages/controls/src/kbd/kbd.html`                                                    | Single inner `<kbd>` element.                                       |
| `packages/controls/src/kbd/keyboard-shortcut.ts`                                        | `NgnKeyboardShortcut` directive + `NgnShortcutBinding` type.        |
| `packages/controls/src/kbd/keyboard-shortcut.spec.ts`                                   | Vitest TestBed tests for scoping, guards, registration.             |
| `packages/controls/src/kbd/index.ts`                                                    | Barrel.                                                             |
| `packages/controls/src/kbd/ng-package.json`                                             | Secondary entry point.                                              |
| `packages/controls/src/kbd/package.json`                                                | `{}` marker.                                                        |
| `packages/themes/src/templates/kbd/{index.ts,package.json}`                             | Control template: scope `kbd`, classNames `root`, `key`.            |
| `packages/themes/src/base/kbd/{index.ts,package.json}`                                  | Structural styling.                                                 |
| `packages/themes/src/nova/kbd/{index.ts,package.json}`                                  | Nova keycap styling.                                                |
| `packages/themes/src/shade/kbd/{index.ts,package.json}`                                 | Shade keycap styling.                                               |
| `packages/themes/src/material/kbd/{index.ts,package.json}`                              | Material keycap styling.                                            |
| `packages/playwright/src/components/kbd.ts`                                             | `NgnKbdHarness`.                                                    |
| `tests/components/kbd.test.ts`                                                          | Playwright e2e.                                                     |
| `apps/docs/src/app/docs/components/kbd/{page.ts,index.md,api.md,a11y.md,playground.ts}` | Docs page.                                                          |
| `apps/docs/src/app/demos/kbd/{base.ts,shortcut-scope.ts,dialog-buttons.ts}`             | Demos.                                                              |

**Modified**

| File                                                 | Change                                                                                                    |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `packages/themes/src/templates/index.ts`             | `kbd` entry in `ThemeTemplate`.                                                                           |
| `packages/themes/src/base/index.ts`                  | Import + `kbd:` entry in `baseStyles`.                                                                    |
| `packages/themes/src/{nova,shade,material}/index.ts` | Import + entry in the `createTheme(...)` parts array.                                                     |
| `packages/controls/src/api/ngn-button.ts`            | `shortcut?: string`; `action?: (event?: PointerEvent) => void`.                                           |
| `packages/controls/src/button/action-button.ts`      | Optional scope injection, registration, `tooltip()` / `shortcutHint()` computeds, optional-event `click`. |
| `packages/controls/src/button/action-button.html`    | `aria-keyshortcuts`, `ngn-kbd`, `tooltip()` binding.                                                      |
| `packages/controls/src/dialog/dialog.ts`             | Import `NgnKeyboardShortcut`.                                                                             |
| `packages/controls/src/dialog/dialog.html`           | `[ngnKeyboardShortcut]="[]"` on `<dialog>`.                                                               |
| `packages/controls/src/snackbar/snackbar.ts`         | `ponytail:` comment noting `shortcut` is inert without a scope host.                                      |
| `packages/playwright/src/components/index.ts`        | Export `./kbd`.                                                                                           |
| `apps/test-wrapper/src/app/imports.ts`               | `kbd`, `keyboardShortcut`, `actionButton` entries.                                                        |
| `apps/docs/src/app/docs/components/index.ts`         | Import + `KbdPage` in the `Data Display` group.                                                           |

---

## Task 1: Pure shortcut helpers

**Files:**

- Create: `packages/controls/src/kbd/shortcut.ts`
- Create: `packages/controls/src/kbd/shortcut.spec.ts`

**Interfaces:**

- Consumes: nothing.
- Produces: `type ParsedShortcut = { ctrl: boolean; meta: boolean; alt: boolean; shift: boolean; key: string }`, `parseShortcut(shortcut: string): ParsedShortcut`, `matchesShortcut(event: KeyboardEvent, parsed: ParsedShortcut): boolean`, `formatShortcut(shortcut: string): string`, `isMacPlatform(): boolean`.

- [ ] **Step 1: Write the failing spec**

Create `packages/controls/src/kbd/shortcut.spec.ts`:

```ts
import { afterEach, describe, expect, it } from 'vitest';

import { formatShortcut, matchesShortcut, parseShortcut } from './shortcut';

/** jsdom's navigator.platform is a configurable getter, so it can be swapped per test. */
function setPlatform(platform: string): void {
  Object.defineProperty(navigator, 'platform', { value: platform, configurable: true });
}

const originalPlatform = navigator.platform;

afterEach(() => setPlatform(originalPlatform));

function keyEvent(key: string, modifiers: Partial<KeyboardEventInit> = {}): KeyboardEvent {
  return new KeyboardEvent('keydown', { key, ...modifiers });
}

describe('parseShortcut', () => {
  it('resolves mod to ctrl off mac', () => {
    setPlatform('Win32');
    expect(parseShortcut('mod+a')).toEqual({
      ctrl: true,
      meta: false,
      alt: false,
      shift: false,
      key: 'a',
    });
  });

  it('resolves mod to meta on mac', () => {
    setPlatform('MacIntel');
    expect(parseShortcut('mod+a')).toEqual({
      ctrl: false,
      meta: true,
      alt: false,
      shift: false,
      key: 'a',
    });
  });

  it('keeps ctrl literal on mac', () => {
    setPlatform('MacIntel');
    expect(parseShortcut('ctrl+a').ctrl).toBe(true);
    expect(parseShortcut('ctrl+a').meta).toBe(false);
  });

  it('is order-insensitive and case-insensitive', () => {
    setPlatform('Win32');
    expect(parseShortcut('A+Shift+Alt')).toEqual(parseShortcut('alt+shift+a'));
  });

  it('maps the space and plus aliases', () => {
    expect(parseShortcut('space').key).toBe(' ');
    expect(parseShortcut('mod+plus').key).toBe('+');
  });

  it('yields no key for a modifier-only string', () => {
    expect(parseShortcut('mod+shift').key).toBe('');
  });
});

describe('matchesShortcut', () => {
  it('matches a shifted letter case-insensitively', () => {
    setPlatform('Win32');
    const parsed = parseShortcut('shift+a');
    expect(matchesShortcut(keyEvent('A', { shiftKey: true }), parsed)).toBe(true);
  });

  it('rejects extra modifiers', () => {
    setPlatform('Win32');
    expect(matchesShortcut(keyEvent('a', { ctrlKey: true }), parseShortcut('a'))).toBe(false);
  });

  it('rejects missing modifiers', () => {
    setPlatform('Win32');
    expect(matchesShortcut(keyEvent('s'), parseShortcut('mod+s'))).toBe(false);
  });

  it('matches mod against ctrl off mac', () => {
    setPlatform('Win32');
    expect(matchesShortcut(keyEvent('s', { ctrlKey: true }), parseShortcut('mod+s'))).toBe(true);
  });

  it('matches mod against meta on mac', () => {
    setPlatform('MacIntel');
    expect(matchesShortcut(keyEvent('s', { metaKey: true }), parseShortcut('mod+s'))).toBe(true);
  });

  it('ignores the shift state for punctuation keys', () => {
    expect(matchesShortcut(keyEvent('?', { shiftKey: true }), parseShortcut('?'))).toBe(true);
  });

  it('never matches a modifier-only string', () => {
    expect(matchesShortcut(keyEvent('Control', { ctrlKey: true }), parseShortcut('mod'))).toBe(
      false
    );
  });
});

describe('formatShortcut', () => {
  it('emits glyphs in canonical order regardless of platform', () => {
    setPlatform('Win32');
    expect(formatShortcut('mod+shift+a')).toBe('⇧⌘A');
    setPlatform('MacIntel');
    expect(formatShortcut('mod+shift+a')).toBe('⇧⌘A');
  });

  it('distinguishes ctrl from mod', () => {
    expect(formatShortcut('ctrl+a')).toBe('⌃A');
  });

  it('orders ctrl, alt, shift, then mod', () => {
    expect(formatShortcut('shift+mod+alt+ctrl+k')).toBe('⌃⌥⇧⌘K');
  });

  it('collapses mod and meta to one glyph', () => {
    expect(formatShortcut('mod+meta+a')).toBe('⌘A');
  });

  it('uses glyphs for named keys', () => {
    expect(formatShortcut('enter')).toBe('↵');
    expect(formatShortcut('mod+arrowup')).toBe('⌘↑');
    expect(formatShortcut('escape')).toBe('⎋');
  });

  it('title-cases an unknown key name', () => {
    expect(formatShortcut('f2')).toBe('F2');
  });

  it('resolves aliases to their glyph', () => {
    expect(formatShortcut('esc')).toBe('⎋');
    expect(formatShortcut('space')).toBe('␣');
    expect(formatShortcut('mod+plus')).toBe('⌘+');
  });

  it('returns an empty string for an empty shortcut', () => {
    expect(formatShortcut('')).toBe('');
  });
});
```

- [ ] **Step 2: Run the spec to verify it fails**

```bash
pnpm --filter @ngneers/controls exec ng test --watch=false --include="src/kbd/**/*.spec.ts"
```

Expected: FAIL — the build cannot resolve `./shortcut`.

- [ ] **Step 3: Implement the helpers**

Create `packages/controls/src/kbd/shortcut.ts`:

```ts
/** A shortcut with `mod` already resolved to the platform's primary modifier. */
export type ParsedShortcut = {
  ctrl: boolean;
  meta: boolean;
  alt: boolean;
  shift: boolean;
  key: string;
};

/** Glyph shown for each token. `mod` and `meta` share ⌘ on every platform. */
const GLYPHS: Record<string, string> = {
  mod: '⌘',
  meta: '⌘',
  ctrl: '⌃',
  alt: '⌥',
  shift: '⇧',
  enter: '↵',
  escape: '⎋',
  tab: '⇥',
  space: '␣',
  backspace: '⌫',
  delete: '⌦',
  arrowup: '↑',
  arrowdown: '↓',
  arrowleft: '←',
  arrowright: '→',
  pageup: '⇞',
  pagedown: '⇟',
  home: '↖',
  end: '↘',
};

/** Display order of the modifier glyphs. */
const MODIFIER_ORDER = ['ctrl', 'alt', 'shift', 'mod', 'meta'];

/** Tokens whose `event.key` differs from the token itself. */
const KEY_ALIASES: Record<string, string> = {
  space: ' ',
  plus: '+',
  esc: 'escape',
};

function tokenize(shortcut: string): string[] {
  return shortcut
    .split('+')
    .map(token => token.trim().toLowerCase())
    .filter(Boolean);
}

/** Whether the current platform is macOS. Non-browser environments report `false`. */
export function isMacPlatform(): boolean {
  if (typeof navigator === 'undefined') {
    return false;
  }
  const platform =
    (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ??
    navigator.platform ??
    '';
  return /mac/i.test(platform);
}

/** Parses a shortcut string into a form directly comparable to a `KeyboardEvent`. */
export function parseShortcut(shortcut: string): ParsedShortcut {
  const parsed: ParsedShortcut = { ctrl: false, meta: false, alt: false, shift: false, key: '' };
  const mac = isMacPlatform();

  for (const token of tokenize(shortcut)) {
    switch (token) {
      case 'mod':
        if (mac) {
          parsed.meta = true;
        } else {
          parsed.ctrl = true;
        }
        break;
      case 'ctrl':
        parsed.ctrl = true;
        break;
      case 'meta':
        parsed.meta = true;
        break;
      case 'alt':
        parsed.alt = true;
        break;
      case 'shift':
        parsed.shift = true;
        break;
      default:
        parsed.key = KEY_ALIASES[token] ?? token;
    }
  }
  return parsed;
}

/** Whether a keydown event satisfies a parsed shortcut. Modifiers must match exactly. */
export function matchesShortcut(event: KeyboardEvent, parsed: ParsedShortcut): boolean {
  if (!parsed.key || event.key.toLowerCase() !== parsed.key.toLowerCase()) {
    return false;
  }
  if (
    event.ctrlKey !== parsed.ctrl ||
    event.metaKey !== parsed.meta ||
    event.altKey !== parsed.alt
  ) {
    return false;
  }
  // Punctuation often requires Shift to type at all, so its state is only compared
  // when the shortcut names shift explicitly.
  const punctuation = parsed.key.length === 1 && !/[a-z0-9]/i.test(parsed.key);
  if (punctuation && !parsed.shift) {
    return true;
  }
  return event.shiftKey === parsed.shift;
}

/** Renders a shortcut as glyphs, e.g. `mod+shift+a` → `⇧⌘A`. Platform-independent. */
export function formatShortcut(shortcut: string): string {
  const tokens = tokenize(shortcut);
  const modifiers = MODIFIER_ORDER.filter(token => tokens.includes(token)).map(
    token => GLYPHS[token]!
  );
  const key = tokens.find(token => !MODIFIER_ORDER.includes(token)) ?? '';
  return [...new Set(modifiers), formatKey(key)].join('');
}

function formatKey(key: string): string {
  if (!key) {
    return '';
  }
  const alias = KEY_ALIASES[key] ?? key;
  return (
    GLYPHS[key] ??
    GLYPHS[alias] ??
    (alias.length === 1 ? alias.toUpperCase() : key[0]!.toUpperCase() + key.slice(1))
  );
}
```

- [ ] **Step 4: Run the spec to verify it passes**

```bash
pnpm --filter @ngneers/controls exec ng test --watch=false --include="src/kbd/**/*.spec.ts"
```

Expected: PASS, all `shortcut.spec.ts` tests green.

- [ ] **Step 5: Format and lint**

```bash
pnpm exec oxfmt packages/controls/src/kbd/shortcut.ts packages/controls/src/kbd/shortcut.spec.ts
```

Then `pnpm check:changed`. Expected: no errors reported for the two new files.

---

## Task 2: Theme parts and `ngn-kbd` control

**Files:**

- Create: `packages/themes/src/templates/kbd/index.ts`, `packages/themes/src/templates/kbd/package.json`
- Create: `packages/themes/src/base/kbd/index.ts`, `.../base/kbd/package.json`
- Create: `packages/themes/src/nova/kbd/index.ts`, `.../nova/kbd/package.json`
- Create: `packages/themes/src/shade/kbd/index.ts`, `.../shade/kbd/package.json`
- Create: `packages/themes/src/material/kbd/index.ts`, `.../material/kbd/package.json`
- Modify: `packages/themes/src/templates/index.ts`, `packages/themes/src/base/index.ts`, `packages/themes/src/nova/index.ts`, `packages/themes/src/shade/index.ts`, `packages/themes/src/material/index.ts`
- Create: `packages/controls/src/kbd/kbd.ts`, `packages/controls/src/kbd/kbd.html`, `packages/controls/src/kbd/index.ts`, `packages/controls/src/kbd/ng-package.json`, `packages/controls/src/kbd/package.json`
- Create: `packages/controls/src/kbd/kbd.spec.ts`

**Interfaces:**

- Consumes: `formatShortcut` from Task 1.
- Produces: `kbdControlTemplate` (scope `'kbd'`, classNames `['root', 'key']`), `NgnKbd` with a required `shortcut` input, and the `@ngneers/controls/kbd` entry point.

- [ ] **Step 1: Write the failing render spec**

Create `packages/controls/src/kbd/kbd.spec.ts`:

Any TestBed spec that instantiates a control extending `NgnBase` must provide
`provideNgnControls` — `NgnBase` injects `Platform`, which is not `providedIn: 'root'`.
Reference: `packages/controls/src/radio/radio.spec.ts`.

```ts
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideNgnControls } from '@ngneers/controls/api/ng';
import { novaCoral } from '@ngneers/controls-themes/nova';
import { beforeEach, describe, expect, it } from 'vitest';

import { NgnKbd } from './kbd';

@Component({
  imports: [NgnKbd],
  template: `<ngn-kbd shortcut="mod+shift+a" />`,
})
class KbdHost {}

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [provideNgnControls({ theme: { preset: novaCoral }, disableAnimations: true })],
  });
});

describe('NgnKbd', () => {
  it('renders the shortcut glyphs inside a kbd element', () => {
    const fixture = TestBed.createComponent(KbdHost);
    fixture.detectChanges();
    const kbd = fixture.nativeElement.querySelector('kbd') as HTMLElement;
    expect(kbd.textContent?.trim()).toBe('⇧⌘A');
  });
});
```

- [ ] **Step 2: Run the spec to verify it fails**

```bash
pnpm --filter @ngneers/controls exec ng test --watch=false --include="src/kbd/**/*.spec.ts"
```

Expected: FAIL — cannot resolve `./kbd`.

- [ ] **Step 3: Create the control template**

`packages/themes/src/templates/kbd/index.ts`:

```ts
import { createControlTemplate } from '@ngneers/controls-themes/api';

export const kbdControlTemplate = createControlTemplate({
  scope: 'kbd',
  classNames: ['root', 'key'],
});
```

`packages/themes/src/templates/kbd/package.json`:

```json
{}
```

Add to `packages/themes/src/templates/index.ts`, alphabetically after the `itemView` entry:

```ts
kbd: Awaited < typeof import('./kbd') > ['kbdControlTemplate'];
```

- [ ] **Step 4: Create the base theme part**

`packages/themes/src/base/kbd/index.ts`:

```ts
import { createThemePart, css } from '@ngneers/controls-themes/api';
import { kbdControlTemplate } from '@ngneers/controls-themes/templates/kbd';

export const kbdStyles = createThemePart({
  controlTemplate: kbdControlTemplate,
  dependencies: [],
  root: {
    css: ({ c }) => css`
      ${c('root')} {
        display: inline-flex;
        align-items: center;
      }
      ${c('key')} {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-family: inherit;
        white-space: nowrap;
      }
    `,
  },
});
```

`packages/themes/src/base/kbd/package.json`:

```json
{}
```

In `packages/themes/src/base/index.ts` add the import beside the other alphabetical imports:

```ts
import { kbdStyles } from '@ngneers/controls-themes/base/kbd';
```

and the entry in the `baseStyles` object, after `itemView`:

```ts
  kbd: kbdStyles,
```

- [ ] **Step 5: Create the nova theme part**

`packages/themes/src/nova/kbd/index.ts`:

```ts
import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { kbdControlTemplate } from '@ngneers/controls-themes/templates/kbd';

export const kbdStyles = createThemePart({
  controlTemplate: kbdControlTemplate,
  base: baseStyles.kbd,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('key')} {
        min-width: 1.5rem;
        height: 1.5rem;
        padding: 0 0.375rem;
        border: 1px solid ${v('color.surface.300')};
        border-bottom-width: 2px;
        border-radius: ${v('size.rounded.md')};
        background: ${v('color.surface.100')};
        color: ${v('color.surface.700')};
        font-size: ${v('font.size.xs')};
        font-weight: ${v('font.weight.medium')};
        line-height: 1;
      }
    `,
  },
});
```

`packages/themes/src/nova/kbd/package.json`:

```json
{}
```

In `packages/themes/src/nova/index.ts` add the import:

```ts
import { kbdStyles } from '@ngneers/controls-themes/nova/kbd';
```

and add `kbdStyles,` to the parts array passed to `createTheme(...)`, beside `itemViewStyles`.

- [ ] **Step 6: Create the shade and material theme parts**

`packages/themes/src/shade/kbd/index.ts` — same shape, `shade/base` tokens:

```ts
import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@ngneers/controls-themes/shade/base';
import { kbdControlTemplate } from '@ngneers/controls-themes/templates/kbd';

export const kbdStyles = createThemePart({
  controlTemplate: kbdControlTemplate,
  base: baseStyles.kbd,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('key')} {
        min-width: 1.5rem;
        height: 1.25rem;
        padding: 0 0.375rem;
        border: 1px solid ${v('color.border')};
        border-radius: ${v('size.rounded.sm')};
        background: ${v('color.muted.base')};
        color: ${v('color.muted.foreground')};
        font-size: ${v('font.size.xs')};
        line-height: 1;
      }
    `,
  },
});
```

Shade's `surface` slot is `{ base, foreground, … }`, not a numeric ramp, which is why this part uses `color.muted.*` and `color.border`.

`packages/themes/src/material/kbd/index.ts` — same shape, `material/base` tokens:

```ts
import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  colorsTemplate,
  fontTemplate,
  sizesTemplate,
} from '@ngneers/controls-themes/material/base';
import { kbdControlTemplate } from '@ngneers/controls-themes/templates/kbd';

export const kbdStyles = createThemePart({
  controlTemplate: kbdControlTemplate,
  base: baseStyles.kbd,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('key')} {
        min-width: 1.5rem;
        height: 1.5rem;
        padding: 0 0.5rem;
        border-radius: ${v('size.rounded.sm')};
        background: ${v('color.surface.200')};
        color: ${v('color.surface.700')};
        font-size: ${v('font.size.xs')};
        line-height: 1;
      }
    `,
  },
});
```

Add a `{}` `package.json` in each folder, then wire both indexes exactly as in Step 5 (`import { kbdStyles } from '@ngneers/controls-themes/{shade,material}/kbd';` plus `kbdStyles,` in the theme parts array).

All token paths above are verified against existing parts: nova and material expose a numeric `color.surface.*` ramp (`nova/button`, `material/filter` use it), shade does not (`shade/avatar` uses `color.muted.base`). `size.rounded.{sm,md}`, `font.size.xs`, and `font.weight.medium` exist in all three.

- [ ] **Step 7: Create the control**

`packages/controls/src/kbd/kbd.ts`:

```ts
import { Component, computed, input } from '@angular/core';
import { NgnBase, NgnPt, provideSelf } from '@ngneers/controls/base';
import { kbdControlTemplate } from '@ngneers/controls-themes/templates/kbd';

import { formatShortcut } from './shortcut';

/**
 * Displays a keyboard shortcut as glyphs, e.g. `mod+shift+a` → `⇧⌘A`.
 * @category control
 */
@Component({
  selector: 'ngn-kbd',
  templateUrl: './kbd.html',
  imports: [NgnPt],
  providers: [provideSelf(NgnKbd)],
})
export class NgnKbd extends NgnBase<'kbd'> {
  protected readonly theme = this.injectThemeTemplate(kbdControlTemplate, 'root');

  /**
   * The shortcut to display, as `+`-joined lowercase tokens — `mod+shift+a`, `escape`,
   * `alt+arrowup`. `mod` renders ⌘ on every platform; `ctrl` renders ⌃.
   */
  public readonly shortcut = input.required<string>();

  protected readonly display = computed(() => formatShortcut(this.shortcut()));
}
```

`packages/controls/src/kbd/kbd.html`:

```html
<kbd [ptInt]="this" [ptClass]="'key'">{{ display() }}</kbd>
```

`packages/controls/src/kbd/index.ts`:

```ts
export * from './kbd';
export * from './shortcut';
```

`packages/controls/src/kbd/ng-package.json`:

```json
{
  "$schema": "../../node_modules/ng-packagr/ng-package.schema.json",
  "lib": {
    "entryFile": "index.ts"
  }
}
```

`packages/controls/src/kbd/package.json`:

```json
{}
```

- [ ] **Step 8: Run the spec to verify it passes**

```bash
pnpm --filter @ngneers/controls exec ng test --watch=false --include="src/kbd/**/*.spec.ts"
```

Expected: PASS — both `shortcut.spec.ts` and `kbd.spec.ts` green.

- [ ] **Step 9: Build the themes package**

```bash
pnpm --filter @ngneers/controls-themes build
```

Expected: success, and `packages/themes/dist/templates/kbd` exists with an `exports` entry. If the subpath is missing, a `{}` `package.json` marker was not created.

- [ ] **Step 10: Format**

```bash
pnpm exec oxfmt packages/controls/src/kbd packages/themes/src/templates/kbd packages/themes/src/base/kbd packages/themes/src/nova/kbd packages/themes/src/shade/kbd packages/themes/src/material/kbd packages/themes/src/templates/index.ts packages/themes/src/base/index.ts packages/themes/src/nova/index.ts packages/themes/src/shade/index.ts packages/themes/src/material/index.ts
pnpm prettier --write packages/controls/src/kbd/kbd.html
```

---

## Task 3: `NgnKeyboardShortcut` directive

**Files:**

- Create: `packages/controls/src/kbd/keyboard-shortcut.ts`
- Create: `packages/controls/src/kbd/keyboard-shortcut.spec.ts`
- Modify: `packages/controls/src/kbd/index.ts`

**Interfaces:**

- Consumes: `parseShortcut`, `matchesShortcut` from Task 1.
- Produces: `type NgnShortcutBinding = { shortcut: string; callback: (event: KeyboardEvent) => void; disabled?: boolean }`, and `NgnKeyboardShortcut` with `bindings` (alias `ngnKeyboardShortcut`) plus `register(binding: () => NgnShortcutBinding): () => void`.

- [ ] **Step 1: Write the failing spec**

Create `packages/controls/src/kbd/keyboard-shortcut.spec.ts`:

```ts
import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { NgnKeyboardShortcut, type NgnShortcutBinding } from './keyboard-shortcut';

@Component({
  imports: [NgnKeyboardShortcut],
  template: `
    <div [ngnKeyboardShortcut]="bindings()">
      <button id="inner">Inner</button>
      <input id="text" />
    </div>
  `,
})
class ScopeHost {
  public readonly bindings = signal<NgnShortcutBinding[]>([]);
  public readonly directive = viewChild.required(NgnKeyboardShortcut);
}

@Component({
  imports: [NgnKeyboardShortcut],
  template: `
    <div [ngnKeyboardShortcut]="outer()">
      <div [ngnKeyboardShortcut]="inner()">
        <button id="deep">Deep</button>
      </div>
    </div>
  `,
})
class NestedHost {
  public readonly outer = signal<NgnShortcutBinding[]>([]);
  public readonly inner = signal<NgnShortcutBinding[]>([]);
}

/** Dispatches a bubbling keydown from an element inside the scope. */
function press(
  root: HTMLElement,
  selector: string,
  key: string,
  modifiers: Partial<KeyboardEventInit> = {}
): KeyboardEvent {
  const target = root.querySelector(selector)!;
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ...modifiers,
  });
  target.dispatchEvent(event);
  return event;
}

describe('NgnKeyboardShortcut', () => {
  it('fires the callback for a keydown from a focused descendant', () => {
    const fixture = TestBed.createComponent(ScopeHost);
    const calls: string[] = [];
    fixture.componentInstance.bindings.set([
      { shortcut: 'ctrl+s', callback: () => calls.push('save') },
    ]);
    fixture.detectChanges();

    const event = press(fixture.nativeElement, '#inner', 's', { ctrlKey: true });
    expect(calls).toEqual(['save']);
    expect(event.defaultPrevented).toBe(true);
  });

  it('ignores a non-matching combo', () => {
    const fixture = TestBed.createComponent(ScopeHost);
    const calls: string[] = [];
    fixture.componentInstance.bindings.set([
      { shortcut: 'ctrl+s', callback: () => calls.push('save') },
    ]);
    fixture.detectChanges();

    press(fixture.nativeElement, '#inner', 's');
    expect(calls).toEqual([]);
  });

  it('ignores repeat events', () => {
    const fixture = TestBed.createComponent(ScopeHost);
    const calls: string[] = [];
    fixture.componentInstance.bindings.set([
      { shortcut: 'ctrl+s', callback: () => calls.push('save') },
    ]);
    fixture.detectChanges();

    press(fixture.nativeElement, '#inner', 's', { ctrlKey: true, repeat: true });
    expect(calls).toEqual([]);
  });

  it('ignores a disabled binding', () => {
    const fixture = TestBed.createComponent(ScopeHost);
    const calls: string[] = [];
    fixture.componentInstance.bindings.set([
      { shortcut: 'ctrl+s', callback: () => calls.push('save'), disabled: true },
    ]);
    fixture.detectChanges();

    press(fixture.nativeElement, '#inner', 's', { ctrlKey: true });
    expect(calls).toEqual([]);
  });

  it('suppresses a modifier-less combo inside a text input', () => {
    const fixture = TestBed.createComponent(ScopeHost);
    const calls: string[] = [];
    fixture.componentInstance.bindings.set([{ shortcut: 'a', callback: () => calls.push('a') }]);
    fixture.detectChanges();

    press(fixture.nativeElement, '#text', 'a');
    expect(calls).toEqual([]);

    press(fixture.nativeElement, '#inner', 'a');
    expect(calls).toEqual(['a']);
  });

  it('still fires a modifier combo inside a text input', () => {
    const fixture = TestBed.createComponent(ScopeHost);
    const calls: string[] = [];
    fixture.componentInstance.bindings.set([
      { shortcut: 'ctrl+s', callback: () => calls.push('save') },
    ]);
    fixture.detectChanges();

    press(fixture.nativeElement, '#text', 's', { ctrlKey: true });
    expect(calls).toEqual(['save']);
  });

  it('lets the inner scope win and does not reach the outer one', () => {
    const fixture = TestBed.createComponent(NestedHost);
    const calls: string[] = [];
    fixture.componentInstance.outer.set([
      { shortcut: 'ctrl+s', callback: () => calls.push('outer') },
    ]);
    fixture.componentInstance.inner.set([
      { shortcut: 'ctrl+s', callback: () => calls.push('inner') },
    ]);
    fixture.detectChanges();

    press(fixture.nativeElement, '#deep', 's', { ctrlKey: true });
    expect(calls).toEqual(['inner']);
  });

  it('falls through to the outer scope when the inner one does not match', () => {
    const fixture = TestBed.createComponent(NestedHost);
    const calls: string[] = [];
    fixture.componentInstance.outer.set([
      { shortcut: 'ctrl+s', callback: () => calls.push('outer') },
    ]);
    fixture.componentInstance.inner.set([
      { shortcut: 'ctrl+k', callback: () => calls.push('inner') },
    ]);
    fixture.detectChanges();

    press(fixture.nativeElement, '#deep', 's', { ctrlKey: true });
    expect(calls).toEqual(['outer']);
  });

  it('checks registered bindings before the host bindings and unregisters on demand', () => {
    const fixture = TestBed.createComponent(ScopeHost);
    const calls: string[] = [];
    fixture.componentInstance.bindings.set([
      { shortcut: 'ctrl+s', callback: () => calls.push('host') },
    ]);
    fixture.detectChanges();

    const unregister = fixture.componentInstance.directive().register(() => ({
      shortcut: 'ctrl+s',
      callback: () => calls.push('registered'),
    }));

    press(fixture.nativeElement, '#inner', 's', { ctrlKey: true });
    expect(calls).toEqual(['registered']);

    unregister();
    press(fixture.nativeElement, '#inner', 's', { ctrlKey: true });
    expect(calls).toEqual(['registered', 'host']);
  });
});
```

- [ ] **Step 2: Run the spec to verify it fails**

```bash
pnpm --filter @ngneers/controls exec ng test --watch=false --include="src/kbd/**/*.spec.ts"
```

Expected: FAIL — cannot resolve `./keyboard-shortcut`.

- [ ] **Step 3: Implement the directive**

Create `packages/controls/src/kbd/keyboard-shortcut.ts`:

```ts
import { Directive, input } from '@angular/core';

import { matchesShortcut, parseShortcut } from './shortcut';

/** One shortcut and the callback it runs. */
export type NgnShortcutBinding = {
  /** Shortcut config string, e.g. `mod+shift+a`. */
  shortcut: string;
  /** Runs when the combo is pressed while focus is inside the scope. */
  callback: (event: KeyboardEvent) => void;
  /** Skips this binding while `true`. */
  disabled?: boolean;
};

function isEditableTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  );
}

/**
 * Runs shortcut callbacks while focus is inside the host element. A handled shortcut stops
 * propagating, so a nested scope wins over an outer one.
 */
@Directive({
  selector: '[ngnKeyboardShortcut]',
  host: {
    '(keydown)': 'onKeydown($event)',
  },
})
export class NgnKeyboardShortcut {
  /**
   * Shortcuts owned by this scope. Descendant registrations (e.g. an
   * {@link NgnActionButton} config's `shortcut`) are checked before these.
   */
  public readonly bindings = input<NgnShortcutBinding[]>([], { alias: 'ngnKeyboardShortcut' });

  private readonly _registered = new Set<() => NgnShortcutBinding>();

  /** Adds a descendant-owned binding and returns its unregister function. */
  public register(binding: () => NgnShortcutBinding): () => void {
    this._registered.add(binding);
    return () => this._registered.delete(binding);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.repeat) {
      return;
    }
    for (const binding of this.candidates()) {
      if (binding.disabled) {
        continue;
      }
      const parsed = parseShortcut(binding.shortcut);
      if (!matchesShortcut(event, parsed)) {
        continue;
      }
      // A bare letter must not steal keystrokes from a field the user is typing in.
      if (isEditableTarget(event.target) && !parsed.ctrl && !parsed.meta && !parsed.alt) {
        continue;
      }
      event.preventDefault();
      event.stopPropagation();
      binding.callback(event);
      return;
    }
  }

  private candidates(): NgnShortcutBinding[] {
    const own = this.bindings();
    return [...[...this._registered].map(binding => binding()), ...(Array.isArray(own) ? own : [])];
  }
}
```

- [ ] **Step 4: Export it from the barrel**

`packages/controls/src/kbd/index.ts`:

```ts
export * from './kbd';
export * from './keyboard-shortcut';
export * from './shortcut';
```

- [ ] **Step 5: Run the spec to verify it passes**

```bash
pnpm --filter @ngneers/controls exec ng test --watch=false --include="src/kbd/**/*.spec.ts"
```

Expected: PASS — all three spec files green.

- [ ] **Step 6: Format and lint**

```bash
pnpm exec oxfmt packages/controls/src/kbd
```

Then `pnpm check:changed`. Expected: clean for the kbd folder.

---

## Task 4: Action button registers its config shortcut

**Files:**

- Modify: `packages/controls/src/api/ngn-button.ts`
- Modify: `packages/controls/src/button/action-button.ts`
- Modify: `packages/controls/src/button/action-button.html`
- Modify: `packages/controls/src/snackbar/snackbar.ts`
- Create: `packages/controls/src/kbd/action-button-shortcut.spec.ts`

**Interfaces:**

- Consumes: `NgnKeyboardShortcut`, `NgnShortcutBinding` (Task 3), `NgnKbd`, `formatShortcut` (Tasks 1–2).
- Produces: `NgnActionButtonConfig.shortcut?: string`, `NgnActionButtonConfig.action?: (event?: PointerEvent) => void`, and `NgnActionButton.click(event?: PointerEvent)`.

- [ ] **Step 1: Write the failing spec**

Create `packages/controls/src/kbd/action-button-shortcut.spec.ts`:

`NgnActionButton` extends `NgnBase`, so this spec needs `provideNgnControls` (see Task 2).

```ts
import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideNgnControls } from '@ngneers/controls/api/ng';
import { NgnActionButton } from '@ngneers/controls/button';
import { novaCoral } from '@ngneers/controls-themes/nova';
import { beforeEach, describe, expect, it } from 'vitest';

import { NgnKeyboardShortcut } from './keyboard-shortcut';

import type { NgnActionButtonConfig } from '@ngneers/controls/api';

@Component({
  imports: [NgnActionButton, NgnKeyboardShortcut],
  template: `
    <div [ngnKeyboardShortcut]="[]">
      <ngn-action-button [config]="config()" (clicked)="clicked.push($event)" />
      <input id="text" />
    </div>
  `,
})
class ScopedActionButtonHost {
  public readonly actions: string[] = [];
  public readonly clicked: string[] = [];
  public readonly config = signal<NgnActionButtonConfig<string>>({
    label: 'Save',
    value: 'save',
    shortcut: 'ctrl+s',
    action: () => this.actions.push('action'),
  });
}

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [provideNgnControls({ theme: { preset: novaCoral }, disableAnimations: true })],
  });
});

function press(root: HTMLElement, selector: string, key: string, ctrlKey = true): void {
  root
    .querySelector(selector)!
    .dispatchEvent(new KeyboardEvent('keydown', { key, ctrlKey, bubbles: true, cancelable: true }));
}

describe('action button shortcut', () => {
  it('runs the config action and emits clicked when the combo is pressed', () => {
    const fixture = TestBed.createComponent(ScopedActionButtonHost);
    fixture.detectChanges();

    press(fixture.nativeElement, '#text', 's');
    expect(fixture.componentInstance.actions).toEqual(['action']);
    expect(fixture.componentInstance.clicked).toEqual(['save']);
  });

  it('renders the glyphs and exposes aria-keyshortcuts', () => {
    const fixture = TestBed.createComponent(ScopedActionButtonHost);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLElement;
    expect(button.getAttribute('aria-keyshortcuts')).toBe('ctrl+s');
    expect(button.querySelector('kbd')?.textContent?.trim()).toBe('⌃S');
  });

  it('does not fire while the config is disabled', () => {
    const fixture = TestBed.createComponent(ScopedActionButtonHost);
    fixture.detectChanges();
    fixture.componentInstance.config.update(config => ({ ...config, disabled: true }));
    fixture.detectChanges();

    press(fixture.nativeElement, '#text', 's');
    expect(fixture.componentInstance.clicked).toEqual([]);
  });

  it('stops listening once the shortcut is removed from the config', () => {
    const fixture = TestBed.createComponent(ScopedActionButtonHost);
    fixture.detectChanges();
    fixture.componentInstance.config.update(config => ({ ...config, shortcut: undefined }));
    fixture.detectChanges();

    press(fixture.nativeElement, '#text', 's');
    expect(fixture.componentInstance.clicked).toEqual([]);
  });
});
```

- [ ] **Step 2: Run the spec to verify it fails**

```bash
pnpm --filter @ngneers/controls exec ng test --watch=false --include="src/kbd/**/*.spec.ts"
```

Expected: FAIL — `shortcut` is not a property of `NgnActionButtonConfig`.

- [ ] **Step 3: Extend the config type**

In `packages/controls/src/api/ngn-button.ts`, replace the `action` line and add `shortcut`:

```ts
export type NgnActionButtonConfig<T = unknown> = {
  label: string | (() => string);
  value: T;
  /** Runs on click, or on the keyboard {@link NgnActionButtonConfig.shortcut}, where no pointer event exists. */
  action?: (event?: PointerEvent) => void;
  /**
   * Shortcut config string, e.g. `mod+s`. Registered with the nearest ancestor
   * `[ngnKeyboardShortcut]` scope, so it fires only while focus is inside that container.
   */
  shortcut?: string;
  icon?: IconType;
  defaultIcon?: NgnIconKey;
  kind?: CustomKind<'button'>;
  color?: CustomColor;
  disabled?: boolean;
  testId?: string;
};
```

- [ ] **Step 4: Wire the action button**

Rewrite `packages/controls/src/button/action-button.ts`:

```ts
import {
  booleanAttribute,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { NgnBase, provideSelf } from '@ngneers/controls/base';
import { NgnIcon } from '@ngneers/controls/icon';
import { formatShortcut, NgnKbd, NgnKeyboardShortcut } from '@ngneers/controls/kbd';
import { NgnTooltip } from '@ngneers/controls/tooltip';
import { Logger, maybeCallback } from '@ngneers/controls/utils';

import { NgnButton } from './button';

import type { NgnActionButtonConfig } from '@ngneers/controls/api';

@Component({
  selector: 'ngn-action-button',
  templateUrl: 'action-button.html',
  imports: [NgnButton, NgnIcon, NgnKbd, NgnTooltip],
  providers: [provideSelf(NgnActionButton)],
})
export class NgnActionButton<T> extends NgnBase<null> {
  protected readonly theme = null;

  /**
   * The configuration describing the button: its label, icon, tooltip, value,
   * shortcut, and the action callback fired on click.
   * @see {@link NgnActionButtonConfig}
   */
  public readonly config = input.required<NgnActionButtonConfig<T>>();

  /**
   * Whether the inner button is displayed inline (line-height sized).
   * @default false
   */
  public readonly inline = input(false, { transform: booleanAttribute });

  /**
   * Emits the {@link config}'s `value` when the button is clicked, after its
   * `action` callback has run.
   */
  public readonly clicked = output<T>();

  private readonly _shortcutScope = inject(NgnKeyboardShortcut, { optional: true });

  protected readonly maybeCallback = maybeCallback;

  /** The shortcut rendered inside the button — icon-only buttons show it in the tooltip instead. */
  protected readonly shortcutHint = computed(() => {
    const config = this.config();
    return config.kind === 'icon' ? null : (config.shortcut ?? null);
  });

  protected readonly tooltip = computed(() => {
    const config = this.config();
    if (config.kind !== 'icon') {
      return null;
    }
    const label = maybeCallback(config.label);
    return config.shortcut ? `${label} (${formatShortcut(config.shortcut)})` : label;
  });

  constructor() {
    super();
    effect(onCleanup => {
      const shortcut = this.config().shortcut;
      if (!shortcut) {
        return;
      }
      if (!this._shortcutScope) {
        Logger.warn(
          `[ngn-action-button] shortcut "${shortcut}" is ignored: no ancestor [ngnKeyboardShortcut] scope.`
        );
        return;
      }
      onCleanup(
        this._shortcutScope.register(() => ({
          shortcut,
          callback: () => this.click(),
          disabled: this.config().disabled,
        }))
      );
    });
  }

  protected click(event?: PointerEvent): void {
    // Run the config's action callback first, then emit `clicked` — consumers
    // (snackbar, dialog) treat `clicked` as the dismiss signal, so the action
    // must fire before the host tears the button down.
    this.config().action?.(event);
    this.clicked.emit(this.config().value);
  }
}
```

- [ ] **Step 5: Update the action button template**

Rewrite `packages/controls/src/button/action-button.html`:

```html
<button
  type="button"
  ngnButton
  [kind]="config().kind"
  [color]="config().color"
  [ngnButtonInline]="inline()"
  [disabled]="config().disabled"
  (click)="click($event)"
  [attr.data-test-id]="config().testId"
  [attr.aria-keyshortcuts]="config().shortcut"
  [ngnTooltip]="tooltip()"
  ngnTooltipAutoAriaMode="label"
>
  @if (config().icon || config().defaultIcon) {
  <ngn-icon [icon]="config().icon" [defaultIcon]="config().defaultIcon" />
  } @else { {{ maybeCallback(config().label) }} } @if (shortcutHint(); as shortcut) {
  <ngn-kbd [shortcut]="shortcut" />
  }
</button>
```

- [ ] **Step 6: Note the snackbar ceiling**

In `packages/controls/src/snackbar/snackbar.ts`, above the action-button rendering or the footer-button field, add one line:

```ts
// ponytail: snackbar has no [ngnKeyboardShortcut] scope, so a config `shortcut` is inert here; add a scope host if needed.
```

- [ ] **Step 7: Run the spec to verify it passes**

```bash
pnpm --filter @ngneers/controls exec ng test --watch=false --include="src/kbd/**/*.spec.ts"
```

Expected: PASS — all four spec files green.

- [ ] **Step 8: Check for `action` callers broken by the optional parameter**

```bash
pnpm --filter @ngneers/controls exec tsc --noEmit -p tsconfig.lib.json
```

Expected: no errors — this command is clean on the pre-change tree, so anything it reports is yours. If a caller reads a property off the now-optional event, narrow it at that call site rather than reverting the type.

- [ ] **Step 9: Format**

```bash
pnpm exec oxfmt packages/controls/src/api/ngn-button.ts packages/controls/src/button/action-button.ts packages/controls/src/snackbar/snackbar.ts packages/controls/src/kbd
pnpm prettier --write packages/controls/src/button/action-button.html
```

---

## Task 5: Dialog root becomes a shortcut scope

**Files:**

- Modify: `packages/controls/src/kbd/keyboard-shortcut.ts` (element registry + `closestShortcutScope`)
- Modify: `packages/controls/src/kbd/index.ts` (export the new helper)
- Modify: `packages/controls/src/button/action-button.ts` (DOM lookup instead of DI)
- Modify: `packages/controls/src/dialog/dialog.ts`
- Modify: `packages/controls/src/dialog/dialog.html`
- Create: `packages/controls/src/kbd/dialog-shortcut.spec.ts`

**Interfaces:**

- Consumes: `NgnKeyboardShortcut` (Task 3), `NgnActionButtonConfig.shortcut` (Task 4).
- Produces: `closestShortcutScope(element: Element | null): NgnKeyboardShortcut | null` — the DOM-ancestor scope lookup descendants use instead of DI. Footer buttons of `ngn-dialog` gain working shortcuts, including inside a consumer-supplied footer template.

- [ ] **Step 1: Write the failing spec**

Create `packages/controls/src/kbd/dialog-shortcut.spec.ts`:

`NgnDialog` extends `NgnBase`, so this spec needs `provideNgnControls` (see Task 2).

```ts
import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideNgnControls } from '@ngneers/controls/api/ng';
import { NgnDialog } from '@ngneers/controls/dialog';
import { novaCoral } from '@ngneers/controls-themes/nova';
import { beforeEach, describe, expect, it } from 'vitest';

import type { NgnActionButtonConfig } from '@ngneers/controls/api';

@Component({
  imports: [NgnDialog],
  template: `
    <ngn-dialog
      title="Confirm"
      [open]="true"
      [footerButtons]="buttons()"
      (buttonClicked)="clicked.push($event)"
    >
      <input id="text" />
    </ngn-dialog>
  `,
})
class DialogHost {
  // buttonClicked emits `value | null`, so the collector must admit null.
  public readonly clicked: (string | null)[] = [];
  public readonly buttons = signal<NgnActionButtonConfig<string>[]>([
    { label: 'Save', value: 'save', shortcut: 'ctrl+s' },
  ]);
}

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [provideNgnControls({ theme: { preset: novaCoral }, disableAnimations: true })],
  });
});

describe('dialog footer button shortcuts', () => {
  it('fires the footer button shortcut from a focused field inside the dialog', () => {
    const fixture = TestBed.createComponent(DialogHost);
    fixture.detectChanges();

    fixture.nativeElement
      .querySelector('#text')!
      .dispatchEvent(
        new KeyboardEvent('keydown', { key: 's', ctrlKey: true, bubbles: true, cancelable: true })
      );

    expect(fixture.componentInstance.clicked).toEqual(['save']);
  });
});
```

- [ ] **Step 2: Run the spec to verify it fails**

```bash
pnpm --filter @ngneers/controls exec ng test --watch=false --include="src/kbd/**/*.spec.ts"
```

Expected: FAIL — `clicked` is empty, because `<dialog>` is not yet a scope. (If the dialog's own `(keydown)="onCancel($event)"` handler throws on this event instead, that is the same failure signal — proceed.)

- [ ] **Step 2b: Add the consumer-template spec case**

The failure above is not only "no scope yet" — DI cannot solve it at all. Angular resolves a
`TemplateRef`'s element injector from its **declaration** site, not the DOM position it is
projected into. `dialog.html` declares `#defaultFooterTemplate` as a sibling of `<dialog>`, and a
consumer-supplied `footerTemplate` is declared in the consumer's own component, so neither one's
buttons can see a directive on `<dialog>` under DI. Scope resolution therefore moves to DOM
ancestry. Add a second case to the same spec file, proving the consumer-template path — this is
the case DI could never satisfy:

```ts
@Component({
  imports: [NgnDialog, NgnActionButton, NgnTemplate],
  template: `
    <ngn-dialog title="Rename" [open]="true">
      <input id="field" />
      <ng-template [ngnTemplate]="'footer'">
        <ngn-action-button [config]="button" (clicked)="clicked.push($event)" />
      </ng-template>
    </ngn-dialog>
  `,
})
class CustomFooterHost {
  public readonly clicked: string[] = [];
  public readonly button: NgnActionButtonConfig<string> = {
    label: 'Save',
    value: 'save',
    shortcut: 'ctrl+s',
  };
}
```

with a test that dispatches the same `ctrl+s` keydown from `#field` and expects `['save']`.
Check `packages/controls/src/dialog/dialog-templates.ts` for how a footer template is supplied
(`ngnTemplate` name, or a `footerTemplate` input) and use whichever the current code accepts.

- [ ] **Step 3: Add DOM-ancestor scope resolution to the directive**

In `packages/controls/src/kbd/keyboard-shortcut.ts`, add a module-level registry and lookup,
and have the directive enrol its own host element:

```ts
const SCOPES = new WeakMap<Element, NgnKeyboardShortcut>();

/** The nearest shortcut scope at or above `element`, or null when there is none. */
export function closestShortcutScope(element: Element | null): NgnKeyboardShortcut | null {
  for (let node = element; node; node = node.parentElement) {
    const scope = SCOPES.get(node);
    if (scope) {
      return scope;
    }
  }
  return null;
}
```

Inside the directive, alongside the existing members:

```ts
  private readonly _host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  constructor() {
    SCOPES.set(this._host, this);
    inject(DestroyRef).onDestroy(() => SCOPES.delete(this._host));
  }
```

Everything else about the directive — the `keydown` handler, the guards, `preventDefault` +
`stopPropagation`, `register`, `candidates` — stays exactly as it is. Export
`closestShortcutScope` from the folder barrel.

- [ ] **Step 4: Switch the action button to DOM resolution**

In `packages/controls/src/button/action-button.ts`, replace the DI lookup

```ts
  private readonly _shortcutScope = inject(NgnKeyboardShortcut, { optional: true });
```

with the host element plus a lazy DOM walk, and use it in the existing registration effect:

```ts
  private readonly _host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
```

The effect body keeps its current shape; only the scope lookup changes to
`closestShortcutScope(this._host)`. Import `closestShortcutScope` from `@ngneers/controls/kbd`
and drop the now-unused `NgnKeyboardShortcut` import if nothing else uses it.

Timing: the walk must run when the button's element is attached. The registration effect's first
run happens after the view is created, which is normally enough. If a spec shows the walk running
too early (scope resolves null while the ancestor plainly exists), wrap the resolution in
`afterNextRender` and create the registration effect with an explicit `{ injector }` — report it
if you have to.

- [ ] **Step 5: Make the dialog root a scope**

In `packages/controls/src/dialog/dialog.ts`, add `NgnKeyboardShortcut` to the `imports` array of
the `@Component` decorator, importing it from `@ngneers/controls/kbd`.

In `packages/controls/src/dialog/dialog.html`, add `[ngnKeyboardShortcut]="[]"` to the opening
`<dialog>` tag. The empty array makes it a pure scope host — no bindings of its own, no default
shortcuts. Do NOT move or restructure the footer template; DOM resolution makes its declaration
site irrelevant.

- [ ] **Step 6: Run the spec to verify it passes**

```bash
pnpm --filter @ngneers/controls exec ng test --watch=false --include="src/kbd/**/*.spec.ts"
```

Expected: PASS — all five spec files green, including BOTH dialog cases (default footer buttons
and the consumer-supplied footer template).

- [ ] **Step 7: Type check and format**

```bash
pnpm --filter @ngneers/controls exec tsc --noEmit -p tsconfig.lib.json
pnpm exec oxfmt packages/controls/src/dialog/dialog.ts packages/controls/src/button/action-button.ts packages/controls/src/kbd
pnpm prettier --write packages/controls/src/dialog/dialog.html
```

---

## Task 6: Playwright harness and e2e test

**Files:**

- Create: `packages/playwright/src/components/kbd.ts`
- Modify: `packages/playwright/src/components/index.ts`
- Modify: `apps/test-wrapper/src/app/imports.ts`
- Create: `tests/components/kbd.test.ts`

**Interfaces:**

- Consumes: `kbdControlTemplate` (Task 2), `NgnKbd` / `NgnKeyboardShortcut` (Tasks 2–3), dialog scope (Task 5).
- Produces: `NgnKbdHarness` with `locator`, `key`, `expectText(text: string)`; test-wrapper import keys `kbd`, `keyboardShortcut`, `actionButton`.

- [ ] **Step 1: Create the harness**

`packages/playwright/src/components/kbd.ts`:

```ts
import { kbdControlTemplate } from '@ngneers/controls-themes/templates/kbd';
import { expect, type Locator } from '@playwright/test';

import { themeClasses } from '../utils/theme';

export class NgnKbdHarness {
  public readonly classes = themeClasses(kbdControlTemplate);
  public readonly locator: Locator;
  public readonly key: Locator;

  constructor(hostLocator: Locator) {
    this.locator = hostLocator;
    this.key = hostLocator.locator(this.classes.key);
  }

  public async expectText(text: string) {
    await expect(this.key).toHaveText(text);
  }
}
```

Add to `packages/playwright/src/components/index.ts`, keeping alphabetical order:

```ts
export * from './kbd';
```

- [ ] **Step 2: Register the test-wrapper imports**

In `apps/test-wrapper/src/app/imports.ts` add three entries (`actionButton` does not exist yet):

```ts
  actionButton: () => import('@ngneers/controls/button').then(m => m.NgnActionButton),
  kbd: () => import('@ngneers/controls/kbd').then(m => m.NgnKbd),
  keyboardShortcut: () => import('@ngneers/controls/kbd').then(m => m.NgnKeyboardShortcut),
```

- [ ] **Step 3: Write the e2e test**

Create `tests/components/kbd.test.ts`:

```ts
import { NgnKbdHarness } from '@ngneers/controls-playwright';
import test, { expect } from '@playwright/test';

import { expectOutput, loadComponent } from '../helper/load-component';

test('renders shortcut glyphs', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `<ngn-kbd [shortcut]="inputs().shortcut" />`,
      imports: ['kbd'],
    },
    { inputs: { shortcut: 'mod+shift+a' } }
  );

  const kbd = new NgnKbdHarness(page.locator('ngn-kbd'));
  await kbd.expectText('⇧⌘A');
});

test('dialog footer button fires on its shortcut', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `
        <ngn-dialog
          title="Confirm"
          [open]="true"
          [modal]="true"
          [footerButtons]="inputs().buttons"
          (buttonClicked)="output('button', $event)"
        >
          <input id="field" />
        </ngn-dialog>
      `,
      imports: ['dialog'],
    },
    { inputs: { buttons: [{ label: 'Save', value: 'save', shortcut: 'mod+s' }] } }
  );

  await expect(page.locator('dialog')).toBeVisible();
  await page.locator('#field').focus();
  await page.keyboard.press('Control+s');

  await expectOutput(handle, 'button', ['save']);
});
```

- [ ] **Step 4: Rebuild the themes and playwright packages**

```bash
pnpm --filter @ngneers/controls-themes build && pnpm --filter @ngneers/controls-playwright build
```

Expected: both succeed. The e2e harness resolves themes from `dist`, so a skipped build makes the new subpath unresolvable.

- [ ] **Step 5: Start the browser server (separate shell, leave running)**

```bash
MSYS_NO_PATHCONV=1 docker run --add-host=hostmachine:host-gateway -p 3000:3000 --rm --init --workdir /home/pwuser --user pwuser mcr.microsoft.com/playwright:v1.61.0-noble /bin/sh -c "npx -y playwright@1.61.0 run-server --port 3000 --host 0.0.0.0"
```

Wait for `Listening on ws://0.0.0.0:3000/`. Off-CI, Playwright connects to this remote browser; without it every test fails `connect ECONNREFUSED 127.0.0.1:3000`.

- [ ] **Step 6: Run only this e2e file**

```bash
MSYS_NO_PATHCONV=1 pnpm exec playwright test kbd --project=chromium --reporter=line
```

Expected: both tests pass. Never use `pnpm test -- kbd` — the filter is dropped and the full ~1000-test suite runs. The test-wrapper dev server auto-starts on 4222.

If the dialog test fails with an empty output log, confirm the keydown reaches the `<dialog>`: the `#field` focus call is what guarantees it. If `⇧⌘A` mismatches, print the actual text — a stale themes `dist` or a missing `key` class is the usual cause.

- [ ] **Step 7: Type-check the test file**

```bash
pnpm test:build
```

Expected: no errors.

- [ ] **Step 8: Format**

```bash
pnpm exec oxfmt packages/playwright/src/components/kbd.ts packages/playwright/src/components/index.ts apps/test-wrapper/src/app/imports.ts tests/components/kbd.test.ts
```

---

## Task 7: Docs page and demos

**Files:**

- Create: `apps/docs/src/app/demos/kbd/base.ts`, `.../kbd/shortcut-scope.ts`, `.../kbd/dialog-buttons.ts`
- Create: `apps/docs/src/app/docs/components/kbd/page.ts`, `.../kbd/index.md`, `.../kbd/api.md`, `.../kbd/a11y.md`, `.../kbd/playground.ts`
- Modify: `apps/docs/src/app/docs/components/index.ts`

**Interfaces:**

- Consumes: everything from Tasks 1–5.
- Produces: `KbdPage` registered in the `Data Display` group of `COMPONENT_GROUPS`.

- [ ] **Step 1: Write the demos**

`apps/docs/src/app/demos/kbd/base.ts`:

```ts
import { Component } from '@angular/core';
import { NgnKbd } from '@ngneers/controls/kbd';

@Component({
  selector: 'ngn-demo-kbd-base',
  imports: [NgnKbd],
  template: `
    <div class="flex flex-wrap items-center gap-4 p-4">
      <ngn-kbd shortcut="mod+shift+a" />
      <ngn-kbd shortcut="ctrl+alt+delete" />
      <ngn-kbd shortcut="escape" />
      <ngn-kbd shortcut="mod+arrowup" />
      <ngn-kbd shortcut="f2" />
    </div>
  `,
})
export class Demo_Kbd_Base {}
```

`apps/docs/src/app/demos/kbd/shortcut-scope.ts`:

```ts
import { Component, signal } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { NgnInput } from '@ngneers/controls/input';
import { NgnKbd, NgnKeyboardShortcut } from '@ngneers/controls/kbd';

@Component({
  selector: 'ngn-demo-kbd-shortcut-scope',
  imports: [NgnButton, NgnInput, NgnKbd, NgnKeyboardShortcut],
  template: `
    <div class="flex flex-col gap-4 p-4">
      <div
        class="flex flex-col gap-2 rounded border border-dashed p-4"
        [ngnKeyboardShortcut]="[
          { shortcut: 'mod+s', callback: () => log('outer: save') },
          { shortcut: 'escape', callback: () => log('outer: escape') },
        ]"
      >
        <span class="text-sm">
          Outer scope — focus a field below, then press <ngn-kbd shortcut="mod+s" /> or
          <ngn-kbd shortcut="escape" />
        </span>
        <input ngnInput placeholder="Outer field" />

        <div
          class="flex flex-col gap-2 rounded border border-dashed p-4"
          [ngnKeyboardShortcut]="[{ shortcut: 'mod+s', callback: () => log('inner: save') }]"
        >
          <span class="text-sm">
            Inner scope — handles <ngn-kbd shortcut="mod+s" /> itself, so the outer scope never sees
            it. <ngn-kbd shortcut="escape" /> still bubbles out.
          </span>
          <input ngnInput placeholder="Inner field" />
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button ngnButton (click)="entries.set([])">Clear log</button>
        <span class="text-sm">{{ entries().join(' · ') || 'nothing yet' }}</span>
      </div>
    </div>
  `,
})
export class Demo_Kbd_ShortcutScope {
  protected readonly entries = signal<string[]>([]);

  protected log(entry: string): void {
    this.entries.update(list => [...list, entry]);
  }
}
```

`apps/docs/src/app/demos/kbd/dialog-buttons.ts`:

```ts
import { Component, signal } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { NgnDialog } from '@ngneers/controls/dialog';
import { NgnInput } from '@ngneers/controls/input';

import type { NgnActionButtonConfig } from '@ngneers/controls/api';

@Component({
  selector: 'ngn-demo-kbd-dialog-buttons',
  imports: [NgnButton, NgnDialog, NgnInput],
  template: `
    <div class="flex flex-col gap-4 p-4">
      <button ngnButton (click)="open.set(true)">Open dialog</button>
      <span class="text-sm">Last button: {{ last() ?? '—' }}</span>

      <ngn-dialog
        title="Rename"
        [(open)]="open"
        [modal]="true"
        [footerButtons]="buttons"
        (buttonClicked)="last.set($event)"
      >
        <input ngnInput placeholder="New name" />
      </ngn-dialog>
    </div>
  `,
})
export class Demo_Kbd_DialogButtons {
  protected readonly open = signal(false);
  protected readonly last = signal<string | null>(null);

  protected readonly buttons: NgnActionButtonConfig<string>[] = [
    { label: 'Cancel', value: 'cancel', kind: 'secondary' },
    { label: 'Save', value: 'save', kind: 'primary', shortcut: 'mod+s' },
  ];
}
```

`'secondary'` and `'primary'` are the kinds `tests/components/dialog.test.ts` already uses for footer buttons.

- [ ] **Step 2: Write the playground**

`apps/docs/src/app/docs/components/kbd/playground.ts`:

```ts
import { Component, viewChild } from '@angular/core';
import { NgnKbd } from '@ngneers/controls/kbd';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'ngn-docs-kbd-playground',
  imports: [NgnKbd, NgnDocsPlayground],
  template: `
    <ngn-docs-playground [controls]="[{ componentName: 'NgnKbd', component: component() }]">
      <ngn-kbd #ref shortcut="mod+shift+a" />
    </ngn-docs-playground>
  `,
})
export class NgnDocsKbdPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnKbd });
}
```

- [ ] **Step 3: Write the markdown**

`apps/docs/src/app/docs/components/kbd/index.md`:

```markdown
`ngn-kbd` renders a keyboard shortcut, and `[ngnKeyboardShortcut]` runs callbacks
for one. Both read the same config string: lowercase tokens joined by `+`, in any
order — `mod+shift+a`, `escape`, `alt+arrowup`, `mod+/`.

`mod` is the platform's primary modifier: Cmd on macOS, Ctrl everywhere else.
`ctrl`, `meta`, `alt`, and `shift` are literal on every platform. The final token
is a single character (`a`, `/`) or a name (`enter`, `escape`, `space`, `tab`,
`delete`, `arrowup`, `f2`).

### Displaying a shortcut

Glyphs are used on every platform, so the same string looks the same everywhere:
`mod` renders ⌘ and `ctrl` renders ⌃.

{{ demo: Demo_Kbd_Base }}

### Handling a shortcut

`[ngnKeyboardShortcut]` takes an array of `{ shortcut, callback }` and fires only
while focus is inside its host element. A handled shortcut stops propagating, so
a nested scope wins over an outer one.

{{ demo: Demo_Kbd_ShortcutScope }}

> **Focus is required.** Nothing fires while focus sits outside the host — including
> on `<body>`. For an application-wide shortcut, add your own `document` listener.

> **Typing is protected.** A combo with no `ctrl`/`mod`/`meta`/`alt` is ignored while
> the event target is an input, textarea, select, or contenteditable element, so a bare
> `a` never steals a keystroke. Held keys (`event.repeat`) fire once.

### Action buttons and dialogs

An `NgnActionButtonConfig` can carry a `shortcut`. The button registers it with the
nearest ancestor scope and renders the glyphs next to its label; an icon-only button
shows them in its tooltip instead. `ngn-dialog` is a scope, so footer buttons work
with no extra wiring.

{{ demo: Demo_Kbd_DialogButtons }}
```

`apps/docs/src/app/docs/components/kbd/api.md`:

```markdown
### Kbd API

{{ api: kbd/kbd NgnKbd }}

### Keyboard Shortcut API

{{ api: kbd/keyboard-shortcut NgnKeyboardShortcut }}
```

`apps/docs/src/app/docs/components/kbd/a11y.md`:

```markdown
`ngn-kbd` renders a native `<kbd>` element, which assistive technology announces as
keyboard input.

An action button configured with a `shortcut` sets `aria-keyshortcuts` to the config
string, so screen readers can announce the binding. Icon-only buttons keep their
label in the tooltip and append the glyphs to it.

Shortcuts never replace a visible control: every `[ngnKeyboardShortcut]` binding in
the library is a shortcut _to_ a focusable button, not the only way to reach an action.
```

- [ ] **Step 4: Write the page and register it**

`apps/docs/src/app/docs/components/kbd/page.ts`:

```ts
import { NgnDocsKbdPlayground } from './playground';
import { Demo_Kbd_Base } from '../../../demos/kbd/base';
import { Demo_Kbd_DialogButtons } from '../../../demos/kbd/dialog-buttons';
import { Demo_Kbd_ShortcutScope } from '../../../demos/kbd/shortcut-scope';

import type { NgnDocsPage } from '../../../utils/page/types';

export const KbdPage: NgnDocsPage = {
  title: `Kbd`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,
      title: 'Examples',
      mdFile: 'components/kbd/index.md',
      components: [Demo_Kbd_Base, Demo_Kbd_ShortcutScope, Demo_Kbd_DialogButtons],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsKbdPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/kbd/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/kbd/a11y.md' },
  ],
};
```

In `apps/docs/src/app/docs/components/index.ts` add the import in alphabetical position:

```ts
import { KbdPage } from './kbd/page';
```

and add `KbdPage,` to the `Data Display` group's `pages` array, after `ItemViewPage`.

- [ ] **Step 5: Build the docs app**

```bash
pnpm docs:build
```

Expected: success. This also regenerates the API docs (typedoc scans `src/**/*.ts`, so no registration is needed) and the search index, so the new page becomes searchable. A failure here is usually a bad `{{ api: ... }}` path or an unregistered demo component.

- [ ] **Step 6: Verify the search index picked the page up**

```bash
pnpm --filter @ngneers/controls-docs search:check
```

Expected: no missing-route or missing-title complaint for `kbd`. Do not try to verify the page on the dev server at 4200 — it serves a stale pre-built bundle for TS and template edits, so a passing `docs:build` plus this check is the real evidence.

- [ ] **Step 7: Format and final lint**

```bash
pnpm exec oxfmt apps/docs/src/app/demos/kbd apps/docs/src/app/docs/components/kbd apps/docs/src/app/docs/components/index.ts
pnpm check:changed
```

Expected: clean. Leave everything uncommitted — the user commits.

---

## Verification Summary

Run these at the end, in order:

```bash
pnpm --filter @ngneers/controls exec ng test --watch=false --include="src/kbd/**/*.spec.ts"
pnpm --filter @ngneers/controls-themes build
pnpm --filter @ngneers/controls-playwright build
pnpm test:build
pnpm docs:build
pnpm check:changed
```

Plus the scoped e2e run with the docker browser server up:

```bash
MSYS_NO_PATHCONV=1 pnpm exec playwright test kbd --project=chromium --reporter=line
```
