import test, { expect } from '@playwright/test';
import { NgnToggleButtonHarness } from '@ngneers/controls-playwright';
import { loadComponent } from '../helper/load-component';
import { expectScreenshot } from '../helper/screenshot';

test.fixme('base', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<button ngnToggleButton [active]="inputs().active" (activeChange)="output('active', $event)">Toggle</button>`,
      imports: ['toggleButton'],
    },
    {
      inputs: {
        active: false,
      },
    }
  );

  const toggleButton = new NgnToggleButtonHarness(page.locator('[ngnToggleButton]'));
  await toggleButton.expectActive(false);
  await expectScreenshot(page, testInfo, 'inactive');

  // Click to activate
  await toggleButton.click();
  await toggleButton.expectActive(true);
  await expectScreenshot(page, testInfo, 'active');

  // Verify output event
  const outputs = await handle.getOutputLog();
  expect(outputs['active']).toEqual([true]);

  // Click to deactivate
  await toggleButton.click();
  await toggleButton.expectActive(false);

  // Verify output event
  const outputs2 = await handle.getOutputLog();
  expect(outputs2['active']).toEqual([true, false]);
});

test.fixme('states', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<button 
        ngnToggleButton 
        [active]="inputs().active" 
        [disabled]="inputs().disabled"
        (activeChange)="output('active', $event)"
      >Toggle</button>`,
      imports: ['toggleButton'],
    },
    {
      inputs: {
        active: false,
        disabled: false,
      },
    }
  );

  const toggleButton = new NgnToggleButtonHarness(page.locator('[ngnToggleButton]'));

  // Test disabled state
  await handle.setInputs({ disabled: true });
  await toggleButton.expectDisabled(true);
  await expectScreenshot(page, testInfo, 'disabled-inactive');

  // Try to toggle - should not work
  await toggleButton.click(true);
  await toggleButton.expectActive(false);

  // Set active to true and test disabled with active
  await handle.setInputs({ active: true });
  await toggleButton.expectActive(true);
  await expectScreenshot(page, testInfo, 'disabled-active');

  // Verify no outputs were emitted during disabled test
  expect(await handle.getOutputLog()).toEqual({});
});
