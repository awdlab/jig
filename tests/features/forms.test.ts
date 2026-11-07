import { JigInputHarness, JigSelectHarness, JigSwitchHarness } from '@awdlab/jig-playwright';
import test, { expect, type Page } from '@playwright/test';

import { loadComponent } from '../helper/load-component';

import type { TemplateType } from '../../apps/test-wrapper/src/app/window.js';

/**
 * One scenario, four setups: each wrapper in `form-paradigms.ts` renders the
 * same input / switch / select with the same defaults and validators, so the
 * paradigms are compared against identical expectations.
 */
async function runFormScenario(
  page: Page,
  setup: { element: string; imports: TemplateType['imports'] }
) {
  await loadComponent(page, { template: `<${setup.element} />`, imports: setup.imports });

  const name = new JigInputHarness(page.locator('input[jigInput]'));
  const subscribed = new JigSwitchHarness(page.locator('jig-switch'));
  const flavor = new JigSelectHarness(page.locator('jig-select'));
  const hint = page.locator('jig-hint');
  const snapshot = page.getByTestId('snapshot');

  await test.step('defaults reach the DOM', async () => {
    await name.expectValue('Ada');
    await subscribed.expectValue(true);
    await flavor.expectSelectedItemText('Vanilla');
    await expect(snapshot).toHaveText('Ada|true|Vanilla');
    await expect(hint).toHaveText('');
  });

  await test.step('user edits reach the model', async () => {
    await name.fill('Grace');
    await subscribed.toggle();
    await flavor.open();
    await flavor.clickItemByText('Chocolate');

    await expect(snapshot).toHaveText('Grace|false|Chocolate');
  });

  await test.step('code writes reach the DOM', async () => {
    await page.getByTestId('set-from-code').click();

    await name.expectValue('Codex');
    await subscribed.expectValue(true);
    await flavor.expectSelectedItemText('Mint');
    await expect(snapshot).toHaveText('Codex|true|Mint');
  });

  await test.step('validation follows the value', async () => {
    await name.clear();
    await name.press('Tab');
    await expect(hint).toContainText('Required');

    await name.fill('Ab');
    await expect(hint).toContainText('Use at least 3 characters');

    await name.fill('Bob');
    await expect(hint).toHaveText('');
    await expect(snapshot).toHaveText('Bob|true|Mint');
  });
}

test('value / valueChange without a form', async ({ page }) => {
  await runFormScenario(page, { element: 'form-manual', imports: ['formManual'] });
});

test('template-driven forms', async ({ page }) => {
  await runFormScenario(page, { element: 'form-template-driven', imports: ['formTemplateDriven'] });
});

test('reactive forms', async ({ page }) => {
  await runFormScenario(page, { element: 'form-reactive', imports: ['formReactive'] });
});

test('signal forms', async ({ page }) => {
  await runFormScenario(page, { element: 'form-signal', imports: ['formSignal'] });
});
