import test from '@playwright/test';
import { NgnInputHarness } from '@ngneers/controls-playwright';
import { loadComponent } from '../helper/load-component';
import { expectScreenshot } from '../helper/screenshot';
import { expectNoA11yViolations } from '../helper/axe';

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

test('accessibility (axe)', async ({ page }) => {
  // input-field label provides the accessible name (wired to the input's id).
  await loadComponent(page, {
    template: `
      <ngn-input-field label="Full name">
        <input ngnInput />
      </ngn-input-field>
    `,
    imports: ['input', 'inputField'],
  });
  await expectNoA11yViolations(page);
});
