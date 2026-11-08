import test, { expect, type Page } from '@playwright/test';

import { loadComponent } from '../helper/load-component';

const TEMPLATE = `
  <div
    jigRovingGroup
    [jigRovingGroupOrientation]="inputs().orientation"
    [jigRovingGroupWrap]="inputs().wrap"
    [jigRovingGroupDisabled]="inputs().disabled"
  >
    <button jigRovingItem>One</button>
    <button jigRovingItem>Two</button>
    <button jigRovingItem>Three</button>
  </div>
`;

async function loadGroup(
  page: Page,
  inputs: { orientation?: 'horizontal' | 'vertical'; wrap?: boolean; disabled?: boolean } = {}
) {
  await loadComponent(
    page,
    { template: TEMPLATE, imports: ['rovingGroup'] },
    { inputs: { orientation: 'horizontal', wrap: false, disabled: false, ...inputs } }
  );
  const items = page.locator('[jigRovingItem]');
  await expect(items).toHaveCount(3);
  await items.first().focus();
  return items;
}

test('arrow keys, Home and End move focus and the single tab stop', async ({ page }) => {
  const items = await loadGroup(page);
  await expect(items.nth(0)).toHaveAttribute('tabindex', '0');
  await expect(items.nth(1)).toHaveAttribute('tabindex', '-1');

  await page.keyboard.press('ArrowRight');
  await expect(items.nth(1)).toBeFocused();
  await expect(items.nth(1)).toHaveAttribute('tabindex', '0');
  await expect(items.nth(0)).toHaveAttribute('tabindex', '-1');

  await page.keyboard.press('ArrowLeft');
  await expect(items.nth(0)).toBeFocused();

  await page.keyboard.press('End');
  await expect(items.nth(2)).toBeFocused();

  await page.keyboard.press('Home');
  await expect(items.nth(0)).toBeFocused();
});

test('without wrap the arrow keys stop at the edges', async ({ page }) => {
  const items = await loadGroup(page);

  await page.keyboard.press('ArrowLeft');
  await expect(items.nth(0)).toBeFocused();

  await page.keyboard.press('End');
  await page.keyboard.press('ArrowRight');
  await expect(items.nth(2)).toBeFocused();
});

test('with wrap the arrow keys loop around', async ({ page }) => {
  const items = await loadGroup(page, { wrap: true });

  await page.keyboard.press('ArrowLeft');
  await expect(items.nth(2)).toBeFocused();

  await page.keyboard.press('ArrowRight');
  await expect(items.nth(0)).toBeFocused();
});

test('vertical orientation moves with ArrowUp and ArrowDown only', async ({ page }) => {
  const items = await loadGroup(page, { orientation: 'vertical' });

  await page.keyboard.press('ArrowRight');
  await expect(items.nth(0)).toBeFocused();

  await page.keyboard.press('ArrowDown');
  await expect(items.nth(1)).toBeFocused();

  await page.keyboard.press('ArrowUp');
  await expect(items.nth(0)).toBeFocused();
});

test('a disabled group ignores navigation keys', async ({ page }) => {
  const items = await loadGroup(page, { disabled: true });

  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('End');
  await expect(items.nth(0)).toBeFocused();
  await expect(items.nth(0)).toHaveAttribute('tabindex', '0');
});
