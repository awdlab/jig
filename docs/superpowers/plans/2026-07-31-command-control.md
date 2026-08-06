# `ngn-command` Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a `ngn-command` command-palette control — a chromeless modal dialog wrapping a search input over a filtered, grouped action list — plus the `NgnDialog` changes that make chromeless dialogs possible.

**Architecture:** `NgnCommand` is pure glue. It maps `NgnActionItem[]` onto `NgnItem[]` and hands the list to `ngn-list-box` (which already owns filtering, grouping, arrow-key highlight, scroll-into-view, and the empty state), inside an `ngn-dialog` whose header/footer/close button are suppressed. Keyboard events from the search input are forwarded into the list-box, exactly as `NgnSelect` does. Everything visual flows through four theme parts.

**Tech Stack:** Angular 22 (signals, zoneless), TypeScript strict, pnpm workspace, Playwright e2e (`tests/components/*.test.ts`), oxlint/oxfmt, theme system (`@ngneers/controls-themes`).

**Spec:** [docs/superpowers/specs/2026-07-31-command-control-design.md](../specs/2026-07-31-command-control-design.md)

## Global Constraints

- **Do not switch or create branches.** Work on the current branch, `feat/docs-semantic-search`.
- **Do not commit.** Leave every file uncommitted; the user commits themselves. Task-final steps are verification steps, not commits.
- Angular 22 signals API only: `input()`, `model()`, `computed()`, `signal()`, `output()`. Never `@Input()`/`@Output()`.
- Boolean inputs use `input(false, { transform: booleanAttribute })`.
- Icon inputs are prefixed: `iconSearch`, never `searchIcon`.
- Every `input()` / `model()` / `output()` gets a 1–2 sentence TSDoc; non-obvious defaults documented with unquoted `@default`.
- No component-level CSS. All styling lives in `packages/themes/src/{base,shade,nova,material}/command/`.
- Selector prefix `ngn`; folder name and element selector match: `command` ⇒ `ngn-command`.
- Imports use `@ngneers/*` path aliases, never relative cross-package paths.
- 2-space indent, single quotes.
- Format changed files with `pnpm fix:changed` (NOT `pnpm format` — it reformats the whole repo and ignores file arguments).
- Every new theme folder needs an empty `package.json` containing `{}` next to `index.ts`, or the subpath export is not generated.
- After any theme change, run `pnpm --filter @ngneers/controls-themes build` before e2e — the Playwright harness resolves themes from `dist`.

## Running the e2e tests

Off-CI, Playwright connects to a dockerized browser server on port 3000. Start it once and leave it running:

```bash
MSYS_NO_PATHCONV=1 docker run --add-host=hostmachine:host-gateway -p 3000:3000 --rm --init --workdir /home/pwuser --user pwuser mcr.microsoft.com/playwright:v1.61.0-noble /bin/sh -c "npx -y playwright@1.61.0 run-server --port 3000 --host 0.0.0.0"
```

Wait for `Listening on ws://0.0.0.0:3000/`. Then run **targeted** tests only (the full suite is far too slow):

```bash
MSYS_NO_PATHCONV=1 pnpm exec playwright test tests/components/command.test.ts --project=chromium --reporter=line
```

The test-wrapper dev server auto-starts on 4222 and compiles `@ngneers/controls/*` from source, so control edits need no rebuild.

## File Structure

**Created:**

| File                                                                                        | Responsibility                                               |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `packages/controls/src/command/command-templates.ts`                                        | Template projection inputs + `CommandItem` type              |
| `packages/controls/src/command/command.ts`                                                  | Control class: item mapping, keyboard forwarding, activation |
| `packages/controls/src/command/command.html`                                                | Dialog + search field + list-box + default templates         |
| `packages/controls/src/command/index.ts`                                                    | Barrel                                                       |
| `packages/controls/src/command/ng-package.json`                                             | Secondary entrypoint                                         |
| `packages/controls/src/command/package.json`                                                | `{}` marker                                                  |
| `packages/themes/src/templates/command/index.ts`                                            | Control template: scope, classNames, deps                    |
| `packages/themes/src/templates/command/package.json`                                        | `{}` marker                                                  |
| `packages/themes/src/{base,shade,nova,material}/command/index.ts`                           | Theme parts                                                  |
| `packages/themes/src/{base,shade,nova,material}/command/package.json`                       | `{}` markers                                                 |
| `tests/components/command.test.ts`                                                          | e2e coverage                                                 |
| `apps/docs/src/app/demos/command/{base,grouped,routes}.ts`                                  | Demos                                                        |
| `apps/docs/src/app/docs/components/command/{page.ts,index.md,api.md,a11y.md,playground.ts}` | Docs page                                                    |

**Modified:**

| File                                                       | Change                                                                      |
| ---------------------------------------------------------- | --------------------------------------------------------------------------- |
| `packages/controls/src/dialog/dialog-templates.ts`         | `hasHeaderTemplate` / `hasFooterTemplate` computeds                         |
| `packages/controls/src/dialog/dialog.ts`                   | `closeButton` + `label` inputs, `showHeader`/`showFooter`, header viewChild |
| `packages/controls/src/dialog/dialog.html`                 | `@if` around header/footer/X, drag-handle + labelledby binding              |
| `packages/themes/src/templates/index.ts`                   | `command` entry in `ThemeTemplate`                                          |
| `packages/themes/src/base/index.ts`                        | `command: commandStyles` in `baseStyles`                                    |
| `packages/themes/src/{base,shade,nova,material}/index.ts`  | Register `commandStyles`                                                    |
| `packages/controls/src/i18n/translations/{en,de}/index.ts` | `command` translation group                                                 |
| `apps/test-wrapper/src/app/imports.ts`                     | `command` entry                                                             |
| `apps/docs/src/app/docs/components/index.ts`               | `CommandPage` import + group entry                                          |
| `tests/components/dialog.test.ts`                          | Coverage for the new dialog behavior                                        |

**Explicitly out of scope:** a `NgnCommandHarness` in `packages/playwright/src/components/` (dialog has none either), the theme gallery page, and keyboard-shortcut rendering.

---

### Task 1: Dialog renders no chrome when it has no chrome content

**Files:**

- Modify: `packages/controls/src/dialog/dialog-templates.ts`
- Modify: `packages/controls/src/dialog/dialog.ts:78` (viewChild block), `:110` (`title` input area)
- Modify: `packages/controls/src/dialog/dialog.html:1-70`
- Test: `tests/components/dialog.test.ts`

**Interfaces:**

- Consumes: nothing from earlier tasks.
- Produces: `NgnDialog` inputs `closeButton: InputSignal<boolean>` (default `true`) and `label: InputSignal<string | undefined>`. Task 3 binds `[closeButton]="false"` and `[label]="labelText()"`.

- [ ] **Step 1: Write the failing tests**

Append to `tests/components/dialog.test.ts`:

```ts
const CHROMELESS_TEMPLATE = `
  <ngn-dialog
    [open]="inputs().open"
    [modal]="true"
    [closeButton]="inputs().closeButton"
    [label]="inputs().label"
  >
    <p id="chromeless-body">Body</p>
  </ngn-dialog>
`;

test('drops header, footer and close button when nothing fills them', async ({ page }) => {
  const handle = await loadComponent(
    page,
    { template: CHROMELESS_TEMPLATE, imports: ['dialog'] },
    { inputs: { open: true, closeButton: false, label: 'Palette' } }
  );

  const dialog = page.locator('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('header')).toHaveCount(0);
  await expect(dialog.locator('footer')).toHaveCount(0);
  await expect(dialog.locator('button')).toHaveCount(0);
  await expect(dialog).toHaveAttribute('aria-label', 'Palette');
  expect(await dialog.getAttribute('aria-labelledby')).toBeNull();

  await handle.setInputs({ open: true, closeButton: true, label: 'Palette' });
  await expect(dialog.locator('header')).toHaveCount(1);
  await expect(dialog.locator('header button')).toHaveCount(1);
  await expect(dialog.locator('footer')).toHaveCount(0);
});

test('a titled dialog still renders its header, and keeps no dangling labelledby without one', async ({
  page,
}) => {
  const handle = await loadModal(page, 'any', true);
  const dialog = page.locator('dialog');

  const labelId = await dialog.getAttribute('aria-labelledby');
  expect(labelId).toBeTruthy();
  await expect(page.locator(`#${labelId}`)).toHaveText('My Dialog');

  await handle.setInputs({ title: null, open: true, closeBy: 'any' });
  expect(await dialog.getAttribute('aria-labelledby')).toBeNull();
  await expect(dialog.locator('header')).toHaveCount(1);
});
```

- [ ] **Step 2: Run the tests to verify they fail**

```bash
MSYS_NO_PATHCONV=1 pnpm exec playwright test tests/components/dialog.test.ts --project=chromium --reporter=line -g "drops header|titled dialog"
```

Expected: FAIL. The first test fails because `header`/`footer` always render and `closeButton`/`label` are not inputs (the test-wrapper logs an unknown-input warning); the second fails on the dangling `aria-labelledby`.

- [ ] **Step 3: Add the template-presence computeds**

In `packages/controls/src/dialog/dialog-templates.ts`, after the `headerTemplate` computed:

```ts
  /**
   * Whether the consumer supplied header content of their own.
   */
  protected readonly hasHeaderTemplate = computed(
    () => !!(this._userHeaderTemplate() ?? this.templateHeader())
  );
```

and after the `footerTemplate` computed:

```ts
  /**
   * Whether the consumer supplied footer content of their own.
   */
  protected readonly hasFooterTemplate = computed(
    () => !!(this._userFooterTemplate() ?? this.templateFooter())
  );
```

- [ ] **Step 4: Add the dialog inputs and visibility computeds**

In `packages/controls/src/dialog/dialog.ts`, next to the existing `_dialogElement` viewChild:

```ts
  private readonly _headerElement = viewChild<ElementRef<HTMLElement>>('header');
```

After the `title` input:

```ts
  /**
   * Whether the close (X) button is rendered in the header.
   * Set to `false` for chromeless dialogs — with no title and no header template
   * the header is then dropped entirely.
   * @default true
   */
  public readonly closeButton = input(true, { transform: booleanAttribute });
  /**
   * Accessible name for the dialog. Use it when the dialog has no visible title,
   * for example a chromeless dialog. Ignored when {@link title} is set.
   */
  public readonly label = input<string>();
```

After the `popoverClosedBy` computed:

```ts
  protected readonly showHeader = computed(
    () => this.hasHeaderTemplate() || !!this.title() || this.closeButton()
  );
  protected readonly showFooter = computed(
    () => this.hasFooterTemplate() || !!this.footerButtons()?.length
  );
  /**
   * Only reference the header id when something actually renders it, so the dialog
   * never points `aria-labelledby` at a missing element.
   */
  protected readonly labelledBy = computed(() =>
    this.title() || this.hasHeaderTemplate() ? this.headerId : null
  );
  protected readonly ariaLabel = computed(() => (this.labelledBy() ? null : (this.label() ?? null)));
```

- [ ] **Step 5: Gate the chrome in the template**

In `packages/controls/src/dialog/dialog.html`, replace the two labelling/drag attributes on `<dialog>`:

```html
[attr.aria-labelledby]="labelledBy()" [attr.aria-label]="ariaLabel()"
[ngnMovableDragHandle]="_headerElement()?.nativeElement ?? null"
```

Wrap the header (the `#header` template variable is not visible outside the `@if`, which is why the drag handle now reads the viewChild):

```html
@if (showHeader()) {
<header #header [ptInt]="this" [ptClass]="'header'">
  <ng-template
    [ngTemplateOutlet]="headerTemplate()"
    [ngTemplateOutletContext]="{ headerId, title: title() }"
  ></ng-template>
  @if (closeButton()) {
  <button
    ngnButton
    [kind]="'icon'"
    [attr.aria-label]="i18n['dialog_close']()"
    (click)="closeWithButton()"
    tabindex="-1"
  >
    <ngn-icon [defaultIcon]="'dialog-close'"></ngn-icon>
  </button>
  }
</header>
}
```

and the footer:

```html
@if (showFooter()) {
<footer [ptInt]="this" [ptClass]="'footer'">
  <ng-template [ngTemplateOutlet]="footerTemplate()"></ng-template>
</footer>
}
```

Make `_headerElement` accessible to the template by declaring it `protected` rather than `private`.

Do **not** add `[ptClass]="'close-button'"` to the button. The shade/nova/material themes define a `close-button` class the markup never used; wiring it up now would restyle every existing dialog and is out of scope.

- [ ] **Step 6: Run the tests to verify they pass**

```bash
MSYS_NO_PATHCONV=1 pnpm exec playwright test tests/components/dialog.test.ts --project=chromium --reporter=line
```

Expected: PASS, including the pre-existing dialog tests (movable still drags by its header, focus trap intact).

- [ ] **Step 7: Type-check and format**

```bash
pnpm test:build && pnpm fix:changed
```

Expected: no type errors.

---

### Task 2: Theme control template, registration and i18n keys

**Files:**

- Create: `packages/themes/src/templates/command/index.ts`, `packages/themes/src/templates/command/package.json`
- Modify: `packages/themes/src/templates/index.ts`
- Modify: `packages/controls/src/i18n/translations/en/index.ts`, `packages/controls/src/i18n/translations/de/index.ts`

**Interfaces:**

- Consumes: nothing.
- Produces: `commandControlTemplate` (scope `'command'`, classNames `root`, `search-icon`, `item`, `item-icon`, `item-label`, `empty`; deps `dialog`, `list-box`, `search`), the `command` key in `ThemeTemplate` (so `NgnBase<'command'>` type-checks), and translation keys `command_placeholder`, `command_noResults`, `command_label`.

The class list differs slightly from the spec: `search` and `list` are theme _dependencies_ (input-field, list-box), not classNames, and the default item template needs `item`/`item-icon`/`item-label` of its own.

- [ ] **Step 1: Create the control template**

`packages/themes/src/templates/command/index.ts`:

```ts
import { createControlTemplate } from '@ngneers/controls-themes/api';
import { dialogControlTemplate } from '@ngneers/controls-themes/templates/dialog';
import { inputFieldControlTemplate } from '@ngneers/controls-themes/templates/input-field';
import { listBoxControlTemplate } from '@ngneers/controls-themes/templates/list-box';

export const commandControlTemplate = createControlTemplate({
  scope: 'command',
  classNames: ['root', 'search-icon', 'item', 'item-icon', 'item-label', 'empty'],
  dependencies: [
    { class: 'dialog', template: dialogControlTemplate },
    { class: 'list-box', template: listBoxControlTemplate },
    { class: 'search', template: inputFieldControlTemplate },
  ],
});
```

`packages/themes/src/templates/command/package.json`:

```json
{}
```

- [ ] **Step 2: Register the scope**

In `packages/themes/src/templates/index.ts`, add to the `ThemeTemplate` type, alphabetically after `'color-picker'`:

```ts
command: Awaited < typeof import('./command') > ['commandControlTemplate'];
```

- [ ] **Step 3: Add the English translations**

In `packages/controls/src/i18n/translations/en/index.ts`, next to the `listBox` group:

```ts
  command: {
    placeholder: 'Type a command or search…',
    noResults: 'No results found',
    label: 'Command palette',
  },
```

`label` is a third key beyond the spec's two: a chromeless modal has no visible title, so without it the dialog ships with no accessible name.

- [ ] **Step 4: Add the German translations**

In `packages/controls/src/i18n/translations/de/index.ts`, in the matching position:

```ts
  command: {
    placeholder: 'Befehl eingeben oder suchen…',
    noResults: 'Keine Ergebnisse gefunden',
    label: 'Befehlspalette',
  },
```

- [ ] **Step 5: Build the themes package to verify the export resolves**

```bash
pnpm --filter @ngneers/controls-themes build
```

Expected: build succeeds and `packages/themes/dist/package.json` contains an `./templates/command` export entry. Verify:

```bash
grep -c "templates/command" packages/themes/dist/package.json
```

Expected: a non-zero count. A `0` means the `package.json` marker from Step 1 is missing.

- [ ] **Step 6: Format**

```bash
pnpm fix:changed
```

---

### Task 3: The `NgnCommand` control

**Files:**

- Create: `packages/controls/src/command/command-templates.ts`, `command.ts`, `command.html`, `index.ts`, `ng-package.json`, `package.json`
- Modify: `apps/test-wrapper/src/app/imports.ts`
- Test: `tests/components/command.test.ts`

**Interfaces:**

- Consumes: `NgnDialog.closeButton` / `NgnDialog.label` (Task 1); `commandControlTemplate` and the `command_*` translation keys (Task 2).
- Produces: `NgnCommand` with inputs `items`, `open` (model), `placeholder`, `label`, `filter`, `iconSearch`, `size`, `closeBy`, `templateItem`, `templateGroup`, `templateEmpty`; output `commandSelected`; methods `show()`, `hide()`, `toggle()`; exported type `CommandItem = NgnItem<NgnActionItem, string>`. Tasks 4–6 consume the class names from Task 2 and this public API.

- [ ] **Step 1: Write the failing e2e test**

Create `tests/components/command.test.ts`:

```ts
import test, { expect } from '@playwright/test';

import { expectNoA11yViolations } from '../helper/axe';
import { evalValue, loadComponent } from '../helper/load-component';

const TEMPLATE = `
  <ngn-command
    [items]="inputs().items"
    [open]="inputs().open"
    (openChange)="output('open', $event)"
    (commandSelected)="output('selected', $event.id)"
  />
`;

// `IconType` is an Iconify data object, not a name string. Same minimal stub
// `tests/components/icon.test.ts` uses.
const ICONIFY = { body: '<path d="M0 0h24v24H0z" />', width: 24, height: 24 };

const ITEMS = [
  {
    id: 'navigation',
    label: 'Navigation',
    children: [
      { id: 'home', label: 'Home', icon: ICONIFY },
      { id: 'inbox', label: 'Inbox', icon: ICONIFY },
    ],
  },
  {
    id: 'actions',
    label: 'Actions',
    children: [
      { id: 'new-file', label: 'New File' },
      { id: 'copy', label: 'Copy', disabled: true },
    ],
  },
];

function loadCommand(page: import('@playwright/test').Page, open = true) {
  return loadComponent(
    page,
    { template: TEMPLATE, imports: ['command'] },
    { inputs: { items: ITEMS, open } }
  );
}

test('opens as a chromeless modal dialog holding a search field and a grouped list', async ({
  page,
}) => {
  await loadCommand(page);
  const dialog = page.locator('dialog');

  await expect(dialog).toBeVisible();
  await expect(dialog.locator('header')).toHaveCount(0);
  await expect(dialog.locator('footer')).toHaveCount(0);
  await expect(dialog.locator('[role="option"]')).toHaveCount(4);
  await expect(dialog.locator('[role="group"]')).toHaveCount(2);
  await expect(dialog.getByRole('option', { name: 'Home' })).toBeVisible();
});

test('focuses the search field on open and filters as you type', async ({ page }) => {
  await loadCommand(page);
  const input = page.locator('dialog input');

  await expect(input).toBeFocused();

  await input.fill('inb');
  await expect(page.locator('dialog [role="option"]')).toHaveCount(1);
  await expect(page.getByRole('option', { name: 'Inbox' })).toBeVisible();
  await expect(page.locator('dialog [role="group"]')).toHaveCount(1);

  await input.fill('zzz');
  await expect(page.locator('dialog [role="option"]')).toHaveCount(0);
  await expect(page.getByText('No results found')).toBeVisible();
});

test('ArrowDown plus Enter activates the highlighted item, emits it and closes', async ({
  page,
}) => {
  const handle = await loadCommand(page);
  const input = page.locator('dialog input');

  await input.press('ArrowDown');
  await expect(input).toHaveAttribute('aria-activedescendant', /_option_home$/);

  await input.press('ArrowDown');
  await input.press('Enter');

  const log = await handle.getOutputLog();
  expect(log['selected']).toEqual(['inbox']);
  expect(log['open']?.at(-1)).toBe(false);
  await expect(page.locator('dialog')).toBeHidden();
});

test('clicking an item runs its callback', async ({ page }) => {
  await loadComponent(
    page,
    { template: TEMPLATE, imports: ['command'] },
    {
      inputs: {
        open: true,
        items: evalValue(`[
          { id: 'ping', label: 'Ping', callback: () => ((window).__ngnPing = 'pong') },
        ]`),
      },
    }
  );

  await page.getByRole('option', { name: 'Ping' }).click();
  await expect.poll(() => page.evaluate(() => (window as any).__ngnPing)).toBe('pong');
});

test('the filter text resets between openings', async ({ page }) => {
  const handle = await loadCommand(page);
  const input = page.locator('dialog input');

  await input.fill('inb');
  await expect(page.locator('dialog [role="option"]')).toHaveCount(1);

  await handle.setInputs({ items: ITEMS, open: false });
  await handle.setInputs({ items: ITEMS, open: true });

  await expect(page.locator('dialog input')).toHaveValue('');
  await expect(page.locator('dialog [role="option"]')).toHaveCount(4);
});

test('has no accessibility violations while open', async ({ page }) => {
  await loadCommand(page);
  await expect(page.locator('dialog')).toBeVisible();
  await expectNoA11yViolations(page);
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
MSYS_NO_PATHCONV=1 pnpm exec playwright test tests/components/command.test.ts --project=chromium --reporter=line
```

Expected: FAIL — the `command` key does not exist in the test-wrapper's `IMPORTS` map, so nothing renders.

- [ ] **Step 3: Create the entrypoint scaffolding**

`packages/controls/src/command/package.json`:

```json
{}
```

`packages/controls/src/command/ng-package.json`:

```json
{
  "$schema": "../../node_modules/ng-packagr/ng-package.schema.json",
  "lib": {
    "entryFile": "index.ts"
  }
}
```

`packages/controls/src/command/index.ts`:

```ts
export * from './command';
export * from './command-templates';
```

- [ ] **Step 4: Write the templates base class**

`packages/controls/src/command/command-templates.ts`:

```ts
import { computed, contentChild, Directive, input, TemplateRef, viewChild } from '@angular/core';
import { templateTypesFn } from '@ngneers/controls/api/ng';
import { NgnBase } from '@ngneers/controls/base';

import type { NgnActionItem, NgnItem } from '@ngneers/controls/api';

/**
 * The shape the command control hands to the list box: an {@link NgnItem} whose
 * `data` carries the original {@link NgnActionItem} and whose `value` is its id.
 */
export type CommandItem = NgnItem<NgnActionItem, string>;

@Directive()
export abstract class CommandTemplates extends NgnBase<'command'> {
  private readonly _defaultItemTemplate =
    viewChild.required<TemplateRef<typeof this.templateTypes.item>>('defaultItemTemplate');
  private readonly _userItemTemplate =
    contentChild<TemplateRef<typeof this.templateTypes.item>>('item');
  /**
   * Set a custom template for a command entry.
   * Can also be set using an `<ng-template>` element with `#item` template reference variable.
   */
  public readonly templateItem = input<TemplateRef<typeof this.templateTypes.item> | null>(null);
  protected readonly itemTemplate = computed(
    () => this._userItemTemplate() ?? this.templateItem() ?? this._defaultItemTemplate()
  );

  private readonly _userGroupTemplate =
    contentChild<TemplateRef<typeof this.templateTypes.item>>('group');
  /**
   * Set a custom template for a group header.
   * Can also be set using an `<ng-template>` element with `#group` template reference variable.
   * Falls back to the list box's own group template.
   */
  public readonly templateGroup = input<TemplateRef<typeof this.templateTypes.item> | null>(null);
  protected readonly groupTemplate = computed(
    () => this._userGroupTemplate() ?? this.templateGroup()
  );

  private readonly _defaultEmptyTemplate =
    viewChild.required<TemplateRef<unknown>>('defaultEmptyTemplate');
  private readonly _userEmptyTemplate = contentChild<TemplateRef<unknown>>('empty');
  /**
   * Set a custom template for the no-results state.
   * Can also be set using an `<ng-template>` element with `#empty` template reference variable.
   */
  public readonly templateEmpty = input<TemplateRef<unknown> | null>(null);
  protected readonly emptyTemplate = computed(
    () => this._userEmptyTemplate() ?? this.templateEmpty() ?? this._defaultEmptyTemplate()
  );

  /**
   * Types for the command templates.
   */
  public readonly templateTypes = templateTypesFn<{
    item: {
      $implicit: CommandItem | undefined;
    };
  }>();
}
```

- [ ] **Step 5: Write the control class**

`packages/controls/src/command/command.ts`:

```ts
import {
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgnPt, provideSelf } from '@ngneers/controls/base';
import { NgnDialog } from '@ngneers/controls/dialog';
import { NgnIcon } from '@ngneers/controls/icon';
import { I18n } from '@ngneers/controls/i18n';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputField } from '@ngneers/controls/input-field';
import { NgnListBox } from '@ngneers/controls/list-box';
import { NgnTemplate } from '@ngneers/controls/api/ng';
import { NgnAutofocus } from '@ngneers/controls/directives';
import { maybeCallback } from '@ngneers/controls/utils';
import { generateElementId } from '@ngneers/controls/utils-ng';
import { commandControlTemplate } from '@ngneers/controls-themes/templates/command';

import { type CommandItem, CommandTemplates } from './command-templates';

import type { FilterConfig, NgnActionItem } from '@ngneers/controls/api';
import type { CloseBy } from '@ngneers/controls/api/ng';
import type { DialogSize } from '@ngneers/controls/dialog';
import type { IconType } from '@ngneers/controls-custom-types';

function toCommandItem(item: NgnActionItem): CommandItem {
  return {
    label: item.label,
    value: item.id,
    icon: item.icon,
    disabled: item.disabled,
    testId: item.testId,
    data: item,
    ...(item.children?.length ? { items: item.children.map(toCommandItem) } : {}),
  };
}

function collectById(items: readonly NgnActionItem[], into: Map<string, NgnActionItem>) {
  for (const item of items) {
    into.set(item.id, item);
    if (item.children?.length) {
      collectById(item.children, into);
    }
  }
  return into;
}

/**
 * @category control
 */
@Component({
  selector: 'ngn-command',
  templateUrl: './command.html',
  imports: [
    NgnPt,
    NgnDialog,
    NgnListBox,
    NgnInput,
    NgnInputField,
    NgnIcon,
    NgnTemplate,
    NgnAutofocus,
  ],
  providers: [provideSelf(NgnCommand)],
})
export class NgnCommand extends CommandTemplates {
  protected readonly theme = this.injectThemeTemplate(commandControlTemplate, 'root');
  protected readonly i18n = inject(I18n).translations;
  private readonly _router = inject(Router, { optional: true });
  private readonly _listBox = viewChild<NgnListBox<CommandItem[], false>>(NgnListBox);

  protected readonly listBoxId = generateElementId();
  protected readonly maybeCallback = maybeCallback;
  protected readonly filterText = signal('');

  /**
   * The commands to offer. A top-level entry with `children` renders as a labelled
   * group; leaf entries are the runnable commands.
   */
  public readonly items = input.required<readonly NgnActionItem[]>();
  /**
   * Shows or hides the palette. Bind two-way, or use {@link show} / {@link hide} / {@link toggle}.
   * @default false
   */
  public readonly open = model(false);
  /**
   * Placeholder for the search field.
   * @default the `command_placeholder` translation
   */
  public readonly placeholder = input<string>();
  /**
   * Accessible name for the palette dialog.
   * @default the `command_label` translation
   */
  public readonly label = input<string>();
  /**
   * Whether searching is enabled, or a `FilterConfig` customizing how it matches.
   * Matches item labels case-insensitively per word by default.
   * @default true
   */
  public readonly filter = input<FilterConfig<CommandItem> | boolean>(true);
  /**
   * The icon shown in the search field.
   */
  public readonly iconSearch = input<IconType>();
  /**
   * Size of the palette dialog.
   * @default { width: '560px', maxWidth: '90vw', maxHeight: '60vh' }
   */
  public readonly size = input<DialogSize>({
    width: '560px',
    maxWidth: '90vw',
    maxHeight: '60vh',
  });
  /**
   * Determines how the palette can be dismissed. See {@link NgnDialog.closeBy}.
   * @default 'any'
   */
  public readonly closeBy = input<CloseBy>('any');

  /**
   * Emitted when a command is picked, carrying the original item. The item's
   * `callback` has already run and its `route` has already been navigated.
   */
  public readonly commandSelected = output<NgnActionItem>();

  protected readonly placeholderText = computed(
    () => this.placeholder() ?? this.i18n['command_placeholder']()
  );
  protected readonly labelText = computed(() => this.label() ?? this.i18n['command_label']());
  protected readonly mappedItems = computed(() => this.items().map(toCommandItem));
  protected readonly activeDescendantId = computed(() => {
    const highlighted = this._listBox()?.currentHighlightedValue();
    return highlighted == null ? null : `${this.listBoxId}_option_${highlighted}`;
  });

  private readonly _itemsById = computed(() => collectById(this.items(), new Map()));

  constructor() {
    super();
    effect(() => {
      if (!this.open()) {
        this.filterText.set('');
        this._listBox()?.currentHighlightedValue.set(null);
        this._listBox()?.value.set(null);
      }
    });
  }

  /**
   * Opens the palette. Alternatively set the `open` input to `true`.
   */
  public show(): void {
    this.open.set(true);
  }
  public hide(): void {
    this.open.set(false);
  }
  public toggle(): void {
    this.open.update(open => !open);
  }

  protected onKeyDown(event: KeyboardEvent) {
    this._listBox()?.onKeyDown(event);
  }

  protected onItemClicked(value: string) {
    const item = this._itemsById().get(value);
    if (!item) {
      return;
    }
    item.callback?.();
    if (item.route) {
      void this._router?.navigate(Array.isArray(item.route) ? item.route : [item.route]);
    }
    this.commandSelected.emit(item);
    this.open.set(false);
  }
}
```

`NgnAutofocus` and `NgnMovable` both live in `@ngneers/controls/directives` (`menu.ts:20` imports it from there).

**Deliberate test gap:** `route` navigation is not covered by e2e. The test-wrapper app has no route table, so a navigation assertion would test the harness rather than the control. It is exercised by the `Demo_Command_Routes` demo in Task 6 instead; `callback` and `commandSelected` — the same code path minus the `Router` call — are covered above.

- [ ] **Step 6: Write the template**

`packages/controls/src/command/command.html`:

```html
<ngn-dialog
  [ptInt]="this"
  [ptDep]="'dialog'"
  [modal]="true"
  [closeButton]="false"
  [label]="labelText()"
  [(open)]="open"
  [closeBy]="closeBy()"
  [size]="size()"
>
  <ngn-input-field [ptInt]="this" [ptDep]="'search'">
    <ngn-icon [ptInt]="this" [ptClass]="'search-icon'" [icon]="iconSearch()" defaultIcon="search" />
    <input
      ngnInput
      ngnAutofocus
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded="true"
      autocomplete="off"
      [attr.aria-controls]="listBoxId"
      [attr.aria-activedescendant]="activeDescendantId()"
      [attr.aria-label]="placeholderText()"
      [placeholder]="placeholderText()"
      [value]="filterText()"
      (valueChange)="filterText.set($event)"
      (keydown)="onKeyDown($event)"
    />
  </ngn-input-field>

  <ngn-list-box
    [ptInt]="this"
    [ptDep]="'list-box'"
    [inputId]="listBoxId"
    [focussable]="false"
    [selectable]="true"
    [items]="mappedItems()"
    [filter]="filter()"
    [filterText]="filterText()"
    [templateItem]="itemTemplate()"
    [templateGroup]="groupTemplate()"
    [templateEmpty]="emptyTemplate()"
    (itemClicked)="onItemClicked($event)"
  />
</ngn-dialog>

<ng-template #defaultItemTemplate [ngnTemplate]="templateTypes.item" let-item>
  <span [ptInt]="this" [ptClass]="'item'" [attr.data-testid]="item?.testId">
    @if (item?.icon; as icon) {
    <ngn-icon [ptInt]="this" [ptClass]="'item-icon'" [icon]="icon" />
    }
    <span [ptInt]="this" [ptClass]="'item-label'">{{ maybeCallback(item?.label) }}</span>
  </span>
</ng-template>

<ng-template #defaultEmptyTemplate>
  <span [ptInt]="this" [ptClass]="'empty'" [attr.data-testid]="'empty'"
    >{{ i18n['command_noResults']() }}</span
  >
</ng-template>
```

- [ ] **Step 7: Register the control with the test-wrapper**

In `apps/test-wrapper/src/app/imports.ts`, after the `'color-picker'` entry:

```ts
  command: () => import('@ngneers/controls/command').then(m => m.NgnCommand),
```

- [ ] **Step 8: Run the test to verify it passes**

```bash
MSYS_NO_PATHCONV=1 pnpm exec playwright test tests/components/command.test.ts --project=chromium --reporter=line
```

Expected: PASS. Two likely stumbles:

- `aria-activedescendant` empty on the first ArrowDown — the `_listBox()` viewChild resolves only after the first render; confirm the list-box sits in the component's own view (it does; `<ng-content>` inside `ngn-dialog` keeps it in `NgnCommand`'s template).
- No focus on the search input — `ngnAutofocus` runs on render; if the dialog's own `autofocus` handling steals it, pass `[autofocus]="false"` to `ngn-dialog`.

- [ ] **Step 9: Type-check, lint and format**

```bash
pnpm test:build && pnpm lint && pnpm fix:changed
```

Expected: clean. `pnpm lint` is type-aware, so it also catches a missing `command` entry in `ThemeTemplate`.

---

### Task 4: Base and shade theme parts

**Files:**

- Create: `packages/themes/src/base/command/index.ts`, `packages/themes/src/base/command/package.json`
- Create: `packages/themes/src/shade/command/index.ts`, `packages/themes/src/shade/command/package.json`
- Modify: `packages/themes/src/base/index.ts`, `packages/themes/src/shade/index.ts`

**Interfaces:**

- Consumes: `commandControlTemplate` (Task 2), the rendered markup from Task 3.
- Produces: `commandStyles` exported from both paths, and `baseStyles.command` for the themed parts to build on.

- [ ] **Step 1: Write the base part**

`packages/themes/src/base/command/index.ts` — structure only, no colors:

```ts
import { createThemePart, css } from '@ngneers/controls-themes/api';
import { commandControlTemplate } from '@ngneers/controls-themes/templates/command';

export const commandStyles = createThemePart({
  controlTemplate: commandControlTemplate,
  dependencies: [],
  root: {
    css: ({ c, d }) => css`
      ${c('root')} {
        display: contents;
      }
      ${c('root')} ${d('dialog', 'wrapper')} {
        padding: 0;
        overflow: hidden;
      }
      ${c('root')} ${d('list-box')} {
        flex: 1;
        min-height: 0;
        border: none;
        border-radius: 0;
      }
      ${c('item')} {
        display: flex;
        align-items: center;
        width: 100%;
        min-width: 0;
      }
      ${c('item-label')} {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    `,
  },
});
```

`packages/themes/src/base/command/package.json`:

```json
{}
```

- [ ] **Step 2: Register the base part**

In `packages/themes/src/base/index.ts`, add the import alphabetically:

```ts
import { commandStyles } from '@ngneers/controls-themes/base/command';
```

and the entry in the exported `baseStyles` object:

```ts
  command: commandStyles,
```

- [ ] **Step 3: Write the shade part**

`packages/themes/src/shade/command/index.ts` — this is the screenshot target:

```ts
import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  colorsTemplate,
  fontTemplate,
  shadowTemplate,
  sizesTemplate,
} from '@ngneers/controls-themes/shade/base';
import { commandControlTemplate } from '@ngneers/controls-themes/templates/command';

export const commandStyles = createThemePart({
  controlTemplate: commandControlTemplate,
  base: baseStyles.command,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate, shadowTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('root')} ${d('dialog', 'wrapper')} {
        margin-block: 15vh auto;
        border-radius: ${v('size.rounded.lg')};
        box-shadow: ${v('shadow.xl')};
      }
      ${c('root')} ${d('search', 'root')} {
        border: none;
        border-bottom: 1px solid ${v('color.border')};
        border-radius: 0;
        padding: ${v('size.padding.sm')} ${v('size.padding.md')};
        gap: ${v('size.padding.sm')};
      }
      ${c('search-icon')} {
        color: ${v('color.muted.foreground')};
      }
      ${c('root')} ${d('list-box')} {
        padding: ${v('size.padding.sm')};
        background: transparent;
      }
      ${c('root')} ${d('list-box', 'group')} {
        background: transparent;
        padding-inline: ${v('size.padding.md')};
      }
      ${c('root')} ${d('list-box', 'item-selected')} {
        background: transparent;
        color: inherit;
      }
      ${c('item')} {
        gap: ${v('size.padding.md')};
        font-size: ${v('font.size.sm')};
      }
      ${c('item-icon')} {
        color: ${v('color.muted.foreground')};
        flex: none;
      }
      ${c('empty')} {
        display: block;
        padding: ${v('size.padding.lg')};
        text-align: center;
        color: ${v('color.muted.foreground')};
        font-size: ${v('font.size.sm')};
      }
    `,
  },
});
```

Two notes on why these rules exist: the list-box marks the activated row `item-selected`, which would leave a stuck highlight behind after a command runs, so shade neutralizes it and lets `item-highlighted` alone carry the highlight; and the search field's own input-field border is replaced by a single divider so the row reads as part of the palette rather than a nested control.

`packages/themes/src/shade/command/package.json`:

```json
{}
```

- [ ] **Step 4: Register the shade part**

In `packages/themes/src/shade/index.ts`, add the import alphabetically (after `colorPickerStyles`):

```ts
import { commandStyles } from '@ngneers/controls-themes/shade/command';
```

and `commandStyles,` to the parts array, after `colorPickerStyles,`.

- [ ] **Step 5: Rebuild the themes and verify the styling applies**

```bash
pnpm --filter @ngneers/controls-themes build
```

Then check the computed styles from a throwaway assertion — snapshots can serve stale theme CSS across runs, computed styles do not:

```bash
MSYS_NO_PATHCONV=1 pnpm exec playwright test tests/components/command.test.ts --project=chromium --reporter=line
```

Expected: all Task 3 tests still pass. Then confirm the chrome is gone visually by adding a temporary check inside the first test and removing it afterwards:

```ts
const padding = await page.locator('dialog').evaluate(el => getComputedStyle(el).paddingTop);
expect(padding).toBe('0px');
```

- [ ] **Step 6: Format**

```bash
pnpm fix:changed
```

---

### Task 5: Nova and material theme parts

**Files:**

- Create: `packages/themes/src/nova/command/index.ts`, `packages/themes/src/nova/command/package.json`
- Create: `packages/themes/src/material/command/index.ts`, `packages/themes/src/material/command/package.json`
- Modify: `packages/themes/src/nova/index.ts`, `packages/themes/src/material/index.ts`

**Interfaces:**

- Consumes: `commandControlTemplate` (Task 2), `baseStyles.command` (Task 4).
- Produces: `commandStyles` from both paths.

**Important:** nova and material do **not** share shade's colour token names. Neither has `color.muted.foreground` or `color.accent.*`. Their muted text token is `color.surface.500` and their subtle background is `color.surface.100` (see `nova/menu/index.ts` and `material/list-box/index.ts`). `v()` is typed, so a wrong path is a compile error — do not invent token names, and do not copy shade's CSS verbatim.

- [ ] **Step 1: Write the nova part**

`packages/themes/src/nova/command/index.ts`:

```ts
import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, shadowTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { commandControlTemplate } from '@ngneers/controls-themes/templates/command';

export const commandStyles = createThemePart({
  controlTemplate: commandControlTemplate,
  base: baseStyles.command,
  dependencies: [colorsTemplate, sizesTemplate, shadowTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('root')} ${d('dialog', 'wrapper')} {
        margin-block: 15vh auto;
        border-radius: ${v('size.rounded.lg')};
      }
      ${c('root')} ${d('search', 'root')} {
        border: none;
        border-bottom: 1px solid ${v('color.border')};
        border-radius: 0;
        box-shadow: none;
        padding: ${v('size.padding.sm')} ${v('size.padding.md')};
        gap: ${v('size.padding.sm')};
      }
      ${c('search-icon')} {
        color: ${v('color.surface.500')};
      }
      ${c('root')} ${d('list-box')} {
        padding: ${v('size.padding.sm')};
        background: transparent;
      }
      ${c('root')} ${d('list-box', 'group')} {
        background: transparent;
        padding-inline: ${v('size.padding.md')};
      }
      ${c('root')} ${d('list-box', 'item-selected')} {
        background: transparent;
        color: inherit;
      }
      ${c('item')} {
        gap: ${v('size.padding.md')};
      }
      ${c('item-icon')} {
        color: ${v('color.surface.500')};
        flex: none;
      }
      ${c('empty')} {
        display: block;
        padding: ${v('size.padding.md')};
        text-align: center;
        color: ${v('color.surface.500')};
      }
    `,
  },
});
```

`packages/themes/src/nova/command/package.json`:

```json
{}
```

- [ ] **Step 2: Write the material part**

`packages/themes/src/material/command/index.ts` — same rules, material tokens. Material's input-field is underlined rather than boxed, so its own bottom border already divides the search row; do not add another one:

```ts
import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  colorsTemplate,
  shadowTemplate,
  sizesTemplate,
} from '@ngneers/controls-themes/material/base';
import { commandControlTemplate } from '@ngneers/controls-themes/templates/command';

export const commandStyles = createThemePart({
  controlTemplate: commandControlTemplate,
  base: baseStyles.command,
  dependencies: [colorsTemplate, sizesTemplate, shadowTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('root')} ${d('dialog', 'wrapper')} {
        margin-block: 15vh auto;
        border-radius: ${v('size.rounded.md')};
        box-shadow: ${v('shadow.lg')};
      }
      ${c('root')} ${d('search', 'root')} {
        border-radius: 0;
        padding: ${v('size.padding.sm')} ${v('size.padding.md')};
        gap: ${v('size.padding.sm')};
      }
      ${c('search-icon')} {
        color: ${v('color.surface.500')};
      }
      ${c('root')} ${d('list-box')} {
        padding: ${v('size.padding.sm')};
        background: transparent;
      }
      ${c('root')} ${d('list-box', 'group')} {
        background: transparent;
        padding-inline: ${v('size.padding.md')};
      }
      ${c('root')} ${d('list-box', 'item-selected')} {
        background: transparent;
        color: ${v('color.text')};
      }
      ${c('item')} {
        gap: ${v('size.padding.md')};
      }
      ${c('item-icon')} {
        color: ${v('color.surface.500')};
        flex: none;
      }
      ${c('empty')} {
        display: block;
        padding: ${v('size.padding.md')};
        text-align: center;
        color: ${v('color.surface.500')};
      }
    `,
  },
});
```

`packages/themes/src/material/command/package.json`:

```json
{}
```

- [ ] **Step 3: Register both parts**

In `packages/themes/src/nova/index.ts` and `packages/themes/src/material/index.ts`, add the import and the `commandStyles,` array entry, both alphabetically after the color-picker entry — same edit as Task 4 Step 4.

- [ ] **Step 4: Rebuild, type-check and verify**

```bash
pnpm --filter @ngneers/controls-themes build && pnpm test:build && pnpm lint
```

Expected: clean. Then re-run the command e2e test to confirm nothing regressed:

```bash
MSYS_NO_PATHCONV=1 pnpm exec playwright test tests/components/command.test.ts --project=chromium --reporter=line
```

- [ ] **Step 5: Format**

```bash
pnpm fix:changed
```

---

### Task 6: Docs page and demos

**Files:**

- Create: `apps/docs/src/app/demos/command/base.ts`, `grouped.ts`, `routes.ts`
- Create: `apps/docs/src/app/docs/components/command/page.ts`, `index.md`, `api.md`, `a11y.md`, `playground.ts`
- Modify: `apps/docs/src/app/docs/components/index.ts`

**Interfaces:**

- Consumes: the `NgnCommand` public API from Task 3.
- Produces: `CommandPage` (`NgnDocsPage`) exported from `apps/docs/src/app/docs/components/command/page.ts`.

- [ ] **Step 1: Write the demos**

`NgnActionItem.icon` is an `IconType` — an Iconify **data object**, not a name string. Import each icon (`import tablerHome from '@iconify/icons-tabler/home';`), the way `apps/docs/src/app/demos/menu/base.ts:2` does.

`apps/docs/src/app/demos/command/base.ts`:

```ts
import tablerCopy from '@iconify/icons-tabler/copy';
import tablerFolderPlus from '@iconify/icons-tabler/folder-plus';
import tablerPlus from '@iconify/icons-tabler/plus';
import { Component, signal } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { NgnCommand } from '@ngneers/controls/command';

import type { NgnActionItem } from '@ngneers/controls/api';

@Component({
  imports: [NgnCommand, NgnButton],
  selector: 'ngn-demo-command-base-demo',
  template: `
    <button ngnButton (click)="open.set(true)">Open palette</button>
    <ngn-command [items]="items" [(open)]="open" (commandSelected)="last.set($event.id)" />
    @if (last()) {
      <p>Ran: {{ last() }}</p>
    }
  `,
})
export class Demo_Command_Base {
  protected readonly open = signal(false);
  protected readonly last = signal<string | null>(null);
  protected readonly items: NgnActionItem[] = [
    { id: 'new-file', label: 'New File', icon: tablerPlus },
    { id: 'new-folder', label: 'New Folder', icon: tablerFolderPlus },
    { id: 'copy', label: 'Copy', icon: tablerCopy },
  ];
}
```

`apps/docs/src/app/demos/command/grouped.ts` — the screenshot layout:

```ts
import tablerCopy from '@iconify/icons-tabler/copy';
import tablerFile from '@iconify/icons-tabler/file';
import tablerFolder from '@iconify/icons-tabler/folder';
import tablerFolderPlus from '@iconify/icons-tabler/folder-plus';
import tablerHome from '@iconify/icons-tabler/home';
import tablerMail from '@iconify/icons-tabler/mail';
import tablerPlus from '@iconify/icons-tabler/plus';
import { Component, signal } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { NgnCommand } from '@ngneers/controls/command';

import type { NgnActionItem } from '@ngneers/controls/api';

@Component({
  imports: [NgnCommand, NgnButton],
  selector: 'ngn-demo-command-grouped-demo',
  template: `
    <button ngnButton (click)="open.set(true)">Open palette</button>
    <ngn-command [items]="items" [(open)]="open" />
  `,
})
export class Demo_Command_Grouped {
  protected readonly open = signal(false);
  protected readonly items: NgnActionItem[] = [
    {
      id: 'navigation',
      label: 'Navigation',
      children: [
        { id: 'home', label: 'Home', icon: tablerHome },
        { id: 'inbox', label: 'Inbox', icon: tablerMail },
        { id: 'documents', label: 'Documents', icon: tablerFile },
        { id: 'folders', label: 'Folders', icon: tablerFolder },
      ],
    },
    {
      id: 'actions',
      label: 'Actions',
      children: [
        { id: 'new-file', label: 'New File', icon: tablerPlus },
        { id: 'new-folder', label: 'New Folder', icon: tablerFolderPlus },
        { id: 'copy', label: 'Copy', icon: tablerCopy },
      ],
    },
  ];
}
```

`apps/docs/src/app/demos/command/routes.ts`:

```ts
import tablerAppWindow from '@iconify/icons-tabler/app-window';
import tablerList from '@iconify/icons-tabler/list';
import tablerSquare from '@iconify/icons-tabler/square';
import { Component, signal } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { NgnCommand } from '@ngneers/controls/command';

import type { NgnActionItem } from '@ngneers/controls/api';

@Component({
  imports: [NgnCommand, NgnButton],
  selector: 'ngn-demo-command-routes-demo',
  template: `
    <button ngnButton (click)="open.set(true)">Jump to a page</button>
    <ngn-command [items]="items" [(open)]="open" />
  `,
})
export class Demo_Command_Routes {
  protected readonly open = signal(false);
  protected readonly items: NgnActionItem[] = [
    { id: 'button', label: 'Button', icon: tablerSquare, route: '/components/button' },
    { id: 'dialog', label: 'Dialog', icon: tablerAppWindow, route: '/components/dialog' },
    { id: 'select', label: 'Select', icon: tablerList, route: '/components/select' },
  ];
}
```

If any `@iconify/icons-tabler/<name>` subpath does not resolve, pick a neighbouring icon that does — the package ships one module per icon and the names above are unverified against the installed version.

- [ ] **Step 2: Write the playground**

`apps/docs/src/app/docs/components/command/playground.ts`:

```ts
import { Component, signal, viewChild } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { NgnCommand } from '@ngneers/controls/command';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

import type { NgnActionItem } from '@ngneers/controls/api';

@Component({
  selector: 'ngn-docs-command-playground',
  imports: [NgnCommand, NgnButton, NgnDocsPlayground],
  template: `
    <ngn-docs-playground [controls]="[{ componentName: 'NgnCommand', component: component() }]">
      <button ngnButton (click)="open.set(true)">Open palette</button>
      <ngn-command #ref [items]="items" [(open)]="open" />
    </ngn-docs-playground>
  `,
})
export class NgnDocsCommandPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnCommand });
  protected readonly open = signal(false);
  protected readonly items: NgnActionItem[] = [
    { id: 'home', label: 'Home', icon: tablerHome },
    { id: 'inbox', label: 'Inbox', icon: tablerMail },
    { id: 'copy', label: 'Copy', icon: tablerCopy },
  ];
}
```

Add the matching `@iconify/icons-tabler/{home,mail,copy}` imports at the top of the playground file.

- [ ] **Step 3: Write the markdown**

`apps/docs/src/app/docs/components/command/index.md`:

```markdown
The Command palette (`<ngn-command>`) is a chromeless modal dialog holding a search
field over a filtered list of actions — the `⌘K` pattern. Pass the same
`NgnActionItem[]` you would give a menu: leaf entries are runnable commands, and a
top-level entry with `children` renders as a labelled group. Picking a command runs
its `callback`, navigates its `route`, emits `commandSelected`, and closes the palette.

### Basic Usage

Bind `[(open)]` and open the palette however you like — `ngn-command` deliberately
registers no global hotkey, so the shortcut stays yours to own.

{{ demo: Demo_Command_Base }}

### Grouped Commands

Give a top-level item `children` to render a labelled section. Searching keeps the
sections that still have a match and hides the rest.

{{ demo: Demo_Command_Grouped }}

### Routing

An item with a `route` navigates through the Angular router when picked, so the
palette doubles as a jump-to-page search.

{{ demo: Demo_Command_Routes }}

### Searching

Search matches item labels case-insensitively, word by word. Pass a `FilterConfig`
to `[filter]` to match other fields or change the matching strategy, or `false` to
turn searching off and use the palette as a plain action list.
```

`apps/docs/src/app/docs/components/command/api.md`:

```markdown
{{ api: command/command NgnCommand }}
```

`apps/docs/src/app/docs/components/command/a11y.md`:

```markdown
The palette is a native modal `<dialog>` named by the `label` input (defaulting to
the `command_label` translation), so it has an accessible name despite having no
visible title. Focus moves to the search field on open and stays there; the field is
a `role="combobox"` with `aria-controls` and `aria-activedescendant` pointing at the
highlighted option in the list box.

## Keyboard

| Key                     | Action                                                           |
| ----------------------- | ---------------------------------------------------------------- |
| `ArrowDown` / `ArrowUp` | Move the highlight (wraps at the ends, skips disabled commands). |
| `Enter`                 | Run the highlighted command and close the palette.               |
| `Escape`                | Dismiss the palette (unless `closeBy` says otherwise).           |

There is no `Home`/`End` or typeahead beyond the search field itself.

## ARIA & screen readers

The list is the list box's `role="listbox"`, with `role="group"` section nodes and
`role="option"` commands. The search field owns focus and mirrors the highlight
through `aria-activedescendant`, so screen readers announce the active command while
typing. The no-results message is announced through the list box's `role="status"`
region.

## Developer responsibilities

- Register the opening shortcut yourself, and make sure a visible control can open
  the palette too — a keyboard-only shortcut is not discoverable.
- Give every command a label that reads on its own; the icon is decorative.
```

- [ ] **Step 4: Write the page definition**

`apps/docs/src/app/docs/components/command/page.ts`:

```ts
import { NgnDocsCommandPlayground } from './playground';
import { Demo_Command_Base } from '../../../demos/command/base';
import { Demo_Command_Grouped } from '../../../demos/command/grouped';
import { Demo_Command_Routes } from '../../../demos/command/routes';
import { i18nKeys } from '../../../utils/i18n-doc';

import type { NgnDocsPage } from '../../../utils/page/types';

export const CommandPage: NgnDocsPage = {
  title: `Command`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,
      title: 'Examples',
      mdFile: 'components/command/index.md',
      components: [Demo_Command_Base, Demo_Command_Grouped, Demo_Command_Routes],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsCommandPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/command/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/command/a11y.md' },
    i18nKeys('command', {
      placeholder: 'Placeholder shown in the palette search field.',
      noResults: 'Message shown when the search matches no command.',
      label: 'Accessible name for the palette dialog.',
    }),
  ],
};
```

- [ ] **Step 5: Register the page**

In `apps/docs/src/app/docs/components/index.ts`, add the import next to the other page imports:

```ts
import { CommandPage } from './command/page';
```

and add `CommandPage,` to the `Actions` group's `pages` array (alongside `ButtonPage`, `ButtonGroupPage`, …) — the palette is an action surface, not an input.

- [ ] **Step 6: Verify the docs build**

```bash
pnpm docs:build
```

Expected: build succeeds. The dev server on :4200 serves a stale bundle for TS/template edits, so the build is the check — not the browser.

- [ ] **Step 7: Format and final lint**

```bash
pnpm fix:changed && pnpm lint && pnpm test:build
```

Expected: clean. Leave every file uncommitted.

---

## Verification summary

Run at the end of the whole plan:

```bash
pnpm --filter @ngneers/controls-themes build && pnpm test:build && pnpm lint && pnpm docs:build
```

```bash
MSYS_NO_PATHCONV=1 pnpm exec playwright test tests/components/command.test.ts tests/components/dialog.test.ts --project=chromium --reporter=line
```

Both must pass before reporting the work complete. Report the actual output; if a step is skipped, say so.
