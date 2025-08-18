import test from '@playwright/test';
import { NgnInputHarness } from 'packages/playwright/src/components/input';
import { loadComponent } from '../helper/load-component';
import { expectScreenshot } from '../helper/screenshot';

test('base', async ({ page }, testInfo) => {
  const handle = await loadComponent(page, {
    template: `<input ngnInput />`,
    imports: ['input'],
  });
  const textField = new NgnInputHarness(page.locator('input[ngnInput]').first());
  await textField.expectValue('');
  await textField.fill('123');
  await textField.expectValue('123');
  await expectScreenshot(page, testInfo);
});
