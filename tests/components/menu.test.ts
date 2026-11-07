import test, { expect, type Page } from '@playwright/test';
import { JigMenuHarness } from '@awdlab/jig-playwright';

import { loadComponent, evalValue } from '../helper/load-component';
import { useRtl } from '../helper/direction';
import { expectNoA11yViolations } from '../helper/axe';
import { expectScreenshot } from '../helper/screenshot';

const ITEMS = [
  { id: '1', label: 'Item 1' },
  { id: '2', label: 'Item 2' },
  { id: '3', label: 'Item 3' },
];

/** The outermost menu; submenus nest their own `jig-menu` inside it. */
function rootMenu(page: Page) {
  return new JigMenuHarness(page.locator('jig-menu').first());
}

const POPOVER_TEMPLATE = `
  <button #anchor (click)="menu.show()">Open Menu</button>
  <jig-menu
    #menu
    [popover]="true"
    [anchor]="anchor"
    [items]="inputs().items"
    (closed)="output('closed', true)"
  />
`;

test('inline menu renders role=menu with a menuitem per item', async ({ page }) => {
  await loadComponent(
    page,
    { template: `<jig-menu [items]="inputs().items" />`, imports: ['menu'] },
    { inputs: { items: ITEMS } }
  );

  const menu = rootMenu(page);
  await menu.expectOpened();
  await menu.expectItemCount(3);
  await expect(menu.getItemByIndex(0)).toHaveText(/Item 1/);
});

test('popover menu wires aria on the anchor and opens/closes', async ({ page }) => {
  await loadComponent(
    page,
    { template: POPOVER_TEMPLATE, imports: ['menu'] },
    { inputs: { items: ITEMS } }
  );

  const anchor = page.locator('button').first();
  await expect(anchor).toHaveAttribute('aria-haspopup', 'menu');
  await expect(anchor).toHaveAttribute('aria-expanded', 'false');
  await expect(anchor).toHaveAttribute('aria-controls', /.+/);

  // Content is lazy — the menu role only exists once opened.
  const menu = rootMenu(page);
  await menu.expectOpened(false);

  await anchor.click();
  await menu.expectOpened();
  await expect(anchor).toHaveAttribute('aria-expanded', 'true');

  await page.keyboard.press('Escape');
  await menu.expectOpened(false);
  await expect(anchor).toHaveAttribute('aria-expanded', 'false');
});

test('clicking a popover menu item runs its callback and closes the menu', async ({ page }) => {
  const handle = await loadComponent(
    page,
    { template: POPOVER_TEMPLATE, imports: ['menu'] },
    {
      inputs: {
        items: evalValue(
          "[{ id: '1', label: 'Item 1', callback: () => { (window.__calls ??= []).push('1'); } }, { id: '2', label: 'Item 2' }]"
        ),
      },
    }
  );

  const menu = rootMenu(page);
  await page.locator('button').first().click();
  await menu.expectOpened();

  await menu.getItemByLabel('Item 1').click();

  expect(await page.evaluate(() => (window as any).__calls ?? [])).toContain('1');
  await menu.expectOpened(false);
  expect(await handle.getOutputLog()).toEqual({ closed: [true] });
});

test('keyboard: arrows move focus, Enter activates, Escape closes', async ({ page }) => {
  await loadComponent(
    page,
    { template: POPOVER_TEMPLATE, imports: ['menu'] },
    {
      inputs: {
        items: evalValue(
          "[{ id: '1', label: 'Item 1', callback: () => { (window.__calls ??= []).push('1'); } }, { id: '2', label: 'Item 2' }, { id: '3', label: 'Item 3' }]"
        ),
      },
    }
  );

  const menu = rootMenu(page);
  await page.locator('button').first().click();
  await expect(menu.getItemByIndex(0)).toBeVisible();

  await menu.getItemByIndex(0).focus();
  await expect(menu.getItemByIndex(0)).toBeFocused();

  await page.keyboard.press('ArrowDown');
  await expect(menu.getItemByIndex(1)).toBeFocused();

  await page.keyboard.press('ArrowUp');
  await expect(menu.getItemByIndex(0)).toBeFocused();

  await page.keyboard.press('Enter');
  expect(await page.evaluate(() => (window as any).__calls ?? [])).toContain('1');
  await menu.expectOpened(false);
});

test('submenu: parent item advertises a submenu and opens it on click', async ({ page }) => {
  await loadComponent(
    page,
    { template: `<jig-menu class="block w-40" [items]="inputs().items" />`, imports: ['menu'] },
    {
      inputs: {
        items: [
          { id: '1', label: 'Item 1' },
          {
            id: '2',
            label: 'Parent',
            children: [
              { id: '2-1', label: 'Child 1' },
              { id: '2-2', label: 'Child 2' },
            ],
          },
        ],
      },
    }
  );

  const menu = rootMenu(page);
  const parent = menu.getItemByLabel('Parent');
  await expect(parent).toHaveAttribute('aria-haspopup', 'menu');
  await expect(parent).toHaveAttribute('aria-expanded', 'false');

  await parent.click();
  await expect(parent).toHaveAttribute('aria-expanded', 'true');
  await expect(menu.getItemByLabel('Child 1')).toBeVisible();
});

test('item callback that destroys the menu does not warn', async ({ page }) => {
  const logs: string[] = [];
  page.on('console', msg => logs.push(msg.text()));

  await loadComponent(
    page,
    {
      template: `
        @if (inputs().visible) {
          <button #anchor (click)="menu.show()">Open Menu</button>
          <jig-menu #menu [popover]="true" [anchor]="anchor" [items]="inputs().items" />
        }
      `,
      imports: ['menu'],
    },
    {
      inputs: {
        visible: true,
        // The callback drops the menu synchronously, as a "delete this row" action does.
        items: evalValue(`[{
          id: '1',
          label: 'Item 1',
          callback: () => {
            window.__jig_test_wrapper.inputs({ visible: false });
            const anchor = document.querySelector('button');
            window.ng.applyChanges(window.ng.getOwningComponent(anchor));
          },
        }]`),
      },
    }
  );

  const menu = rootMenu(page);
  await page.locator('button').first().click();
  await menu.getItemByLabel('Item 1').click();
  await menu.expectAttached(false);

  // Let the deferred allClosed frame run — the warning would land there.
  await page.waitForTimeout(150);
  expect(logs.filter(l => l.includes('NG0953'))).toEqual([]);
});

test('accessibility (axe)', async ({ page }) => {
  await loadComponent(
    page,
    { template: POPOVER_TEMPLATE, imports: ['menu'] },
    { inputs: { items: ITEMS } }
  );

  // The menu is a lazy popover — open it so the scan covers the opened content.
  await page.locator('button').first().click();
  await rootMenu(page).expectOpened();

  await expectNoA11yViolations(page);
});

test('visual', async ({ page }, testInfo) => {
  await loadComponent(
    page,
    { template: `<jig-menu class="page-center" [items]="inputs().items" />`, imports: ['menu'] },
    { inputs: { items: ITEMS } }
  );

  await rootMenu(page).expectOpened();
  await expectScreenshot(page, testInfo, 'inline');
});

test('rtl', async ({ page }, testInfo) => {
  await useRtl(page);
  await loadComponent(
    page,
    { template: `<jig-menu [items]="inputs().items" />`, imports: ['menu'] },
    { inputs: { items: ITEMS } }
  );
  await expectScreenshot(page, testInfo);
});

test('rtl keyboard: submenus open away from the parent along the inline axis', async ({ page }) => {
  await useRtl(page);
  await loadComponent(
    page,
    { template: `<jig-menu class="block w-40" [items]="inputs().items" />`, imports: ['menu'] },
    {
      inputs: {
        items: [
          { id: '1', label: 'Item 1' },
          {
            id: '2',
            label: 'Parent',
            children: [
              { id: '2-1', label: 'Child 1' },
              { id: '2-2', label: 'Child 2' },
            ],
          },
        ],
      },
    }
  );

  const menu = rootMenu(page);
  const parent = menu.getItemByLabel('Parent');
  const child = menu.getItemByLabel('Child 1');
  await parent.focus();
  await expect(parent).toHaveAttribute('aria-expanded', 'false');

  // Nesting runs along the inline axis, so in RTL ArrowLeft opens the submenu.
  await page.keyboard.press('ArrowLeft');
  await expect(parent).toHaveAttribute('aria-expanded', 'true');
  await expect(child).toBeVisible();

  // ArrowRight (back toward the parent) closes it again.
  await child.focus();
  await page.keyboard.press('ArrowRight');
  await expect(child).not.toBeVisible();
});

test('popover menu focuses its first item on open', async ({ page }) => {
  await loadComponent(
    page,
    { template: POPOVER_TEMPLATE, imports: ['menu'] },
    { inputs: { items: ITEMS } }
  );

  await page.locator('button').first().click();
  await expect(rootMenu(page).getItemByLabel('Item 1')).toBeFocused();
});
