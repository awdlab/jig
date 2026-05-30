import test from '@playwright/test';
import { NgnInputHarness } from '@ngneers/controls-playwright';
import { loadComponent } from '../helper/load-component';
import { expectScreenshot } from '../helper/screenshot';

test('base', async ({ page }, testInfo) => {
  const handle = await loadComponent(page, {
    template: `
      <ngn-input-field>
        <input ngnInput />
      </ngn-input-field>
    `,
    imports: ['input', 'inputField'],
  });
  const textField = new NgnInputHarness(page.locator('input[ngnInput]').first());
  await textField.expectValue('');
  await textField.fill('123');
  await textField.expectValue('123');
  await expectScreenshot(page, testInfo);
});
