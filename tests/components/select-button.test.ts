import test, { expect } from '@playwright/test';
import { NgnSelectButtonHarness } from '@ngneers/controls-playwright';
import { loadComponent } from '../helper/load-component';
import { expectScreenshot } from '../helper/screenshot';

test.fixme('base', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<ngn-select-button />`,
      imports: ['selectButton'],
    },
    {}
  );

  const selectButton = new NgnSelectButtonHarness(page.locator('ngn-select-button'));
  await expectScreenshot(page, testInfo, 'base');
});
