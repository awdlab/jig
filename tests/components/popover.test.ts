import { NgnPopoverHarness } from '@ngneers/controls-playwright';
import test from '@playwright/test';

test('base', async ({ page }) => {
  await page.goto('http://localhost:4200/docs/popover?story=base');

  const popover = new NgnPopoverHarness(page.locator('ngn-popover').first());
  await popover.expectRendered();

  const button = page.locator('button').first();
  await button.click();
  await popover.expectOpened();
});

test('lazy', async ({ page }) => {
  await page.goto('http://localhost:4200/docs/popover?story=lazy');

  const popover = new NgnPopoverHarness(page.locator('ngn-popover').first());
  await popover.expectRendered(false);

  const button = page.locator('button').first();
  await button.click();
  await popover.expectRendered(true);
  await popover.expectOpened();
});
