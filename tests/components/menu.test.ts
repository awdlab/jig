import test, { expect } from '@playwright/test';

import { loadComponent, evalValue } from '../helper/load-component';
import { expectNoA11yViolations } from '../helper/axe';
import { expectScreenshot } from '../helper/screenshot';

const ITEMS = [
  { id: '1', label: 'Item 1' },
  { id: '2', label: 'Item 2' },
  { id: '3', label: 'Item 3' },
];

const POPOVER_TEMPLATE = `
  <button #anchor (click)="menu.show()">Open Menu</button>
  <awd-menu
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
    { template: `<awd-menu [items]="inputs().items" />`, imports: ['menu'] },
    { inputs: { items: ITEMS } }
  );

  await expect(page.locator('[role="menu"]')).toBeVisible();
  const items = page.locator('[role="menuitem"]');
  await expect(items).toHaveCount(3);
  await expect(items.first()).toHaveText(/Item 1/);
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
  await expect(page.locator('[role="menu"]')).toHaveCount(0);

  await anchor.click();
  await expect(page.locator('[role="menu"]')).toBeVisible();
  await expect(anchor).toHaveAttribute('aria-expanded', 'true');

  await page.keyboard.press('Escape');
  await expect(page.locator('[role="menu"]')).toHaveCount(0);
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

  await page.locator('button').first().click();
  await expect(page.locator('[role="menu"]')).toBeVisible();

  await page.getByRole('menuitem', { name: 'Item 1' }).click();

  expect(await page.evaluate(() => (window as any).__calls ?? [])).toContain('1');
  await expect(page.locator('[role="menu"]')).toHaveCount(0);
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

  await page.locator('button').first().click();
  const items = page.locator('[role="menuitem"]');
  await expect(items.first()).toBeVisible();

  await items.first().focus();
  await expect(items.nth(0)).toBeFocused();

  await page.keyboard.press('ArrowDown');
  await expect(items.nth(1)).toBeFocused();

  await page.keyboard.press('ArrowUp');
  await expect(items.nth(0)).toBeFocused();

  await page.keyboard.press('Enter');
  expect(await page.evaluate(() => (window as any).__calls ?? [])).toContain('1');
  await expect(page.locator('[role="menu"]')).toHaveCount(0);
});

test('submenu: parent item advertises a submenu and opens it on click', async ({ page }) => {
  await loadComponent(
    page,
    { template: `<awd-menu class="block w-40" [items]="inputs().items" />`, imports: ['menu'] },
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

  const parent = page.getByRole('menuitem', { name: 'Parent' });
  await expect(parent).toHaveAttribute('aria-haspopup', 'menu');
  await expect(parent).toHaveAttribute('aria-expanded', 'false');

  await parent.click();
  await expect(parent).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('menuitem', { name: 'Child 1' })).toBeVisible();
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
          <awd-menu #menu [popover]="true" [anchor]="anchor" [items]="inputs().items" />
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
            window.__ngn_test_wrapper.inputs({ visible: false });
            const anchor = document.querySelector('button');
            window.ng.applyChanges(window.ng.getOwningComponent(anchor));
          },
        }]`),
      },
    }
  );

  await page.locator('button').first().click();
  await page.getByRole('menuitem', { name: 'Item 1' }).click();
  await expect(page.locator('awd-menu')).toHaveCount(0);

  // Let the deferred closeAll frame run — the warning would land there.
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
  await expect(page.locator('[role="menu"]')).toBeVisible();

  await expectNoA11yViolations(page);
});

test('visual', async ({ page }, testInfo) => {
  await loadComponent(
    page,
    { template: `<awd-menu class="page-center" [items]="inputs().items" />`, imports: ['menu'] },
    { inputs: { items: ITEMS } }
  );

  await expect(page.locator('[role="menu"]')).toBeVisible();
  await expectScreenshot(page, testInfo, 'inline');
});
