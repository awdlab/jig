import test from '@playwright/test';
import { NgnInputHarness } from 'packages/playwright/src/components/input';

test('base', async ({ page }) => {
  await page.goto('http://localhost:4200/docs/input?story=base');

  const textField = new NgnInputHarness(page.locator('input[ngnInput]').first());
  await textField.expectValue('');
  await textField.fill('123');
  await textField.expectValue('123');
});
