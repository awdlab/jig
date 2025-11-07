import test, { Page } from '@playwright/test';
import { loadComponent } from '../helper/load-component';
import { InputsType } from 'apps/test-wrapper/src/app/window';
import { expectScreenshot } from '../helper/screenshot';
import { NgnButtonGroupHarness } from '@ngneers/controls-playwright';

async function prepareTest(page: Page, inputs: InputsType = {}) {
  const handle = await loadComponent(page, {
    template: `
        <ngn-button-group>
          <button ngnButton kind="primary">Button 1</button>
          <button ngnButton kind="primary">Button 2</button>
          <button ngnButton kind="primary">Button 3</button>
          <button ngnButton kind="primary">Button 4</button>
          <button ngnButton kind="primary">Button 5</button>
        </ngn-button-group>
      `,
    imports: ['buttonGroup', 'button'],
  });
  return handle;
}

test('base', async ({ page }, testInfo) => {
  const handle = await prepareTest(page);

  const buttonGroup = new NgnButtonGroupHarness(page.locator('ngn-button-group'));
  await buttonGroup.expectItemCount(5);

  await expectScreenshot(page, testInfo, 'horizontal');
  page.setViewportSize({ width: 365, height: 400 });
  await expectScreenshot(page, testInfo, 'vertical');
});
