import test, { type Page } from '@playwright/test';
import { loadComponent } from '../helper/load-component';
import type { InputsType } from '../../apps/test-wrapper/src/app/window.js';
import { expectScreenshot } from '../helper/screenshot';
import { AwdButtonGroupHarness } from '@awdlab/jig-playwright';
import { expectNoA11yViolations } from '../helper/axe';

async function prepareTest(page: Page, inputs: InputsType = {}) {
  const handle = await loadComponent(page, {
    template: `
        <jig-button-group>
          <button ngnButton kind="primary">Button 1</button>
          <button ngnButton kind="primary">Button 2</button>
          <button ngnButton kind="primary">Button 3</button>
          <button ngnButton kind="primary">Button 4</button>
          <button ngnButton kind="primary">Button 5</button>
        </jig-button-group>
      `,
    imports: ['buttonGroup', 'button'],
  });
  return handle;
}

test('base', async ({ page }, testInfo) => {
  const handle = await prepareTest(page);

  const buttonGroup = new AwdButtonGroupHarness(page.locator('jig-button-group'));
  await buttonGroup.expectItemCount(5);

  await expectScreenshot(page, testInfo, 'horizontal');
  page.setViewportSize({ width: 365, height: 400 });
  await expectScreenshot(page, testInfo, 'vertical');
});

test('accessibility (axe)', async ({ page }) => {
  await prepareTest(page);
  await expectNoA11yViolations(page);
});
