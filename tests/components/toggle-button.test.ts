import test, { expect } from '@playwright/test';
import { AwdToggleButtonHarness } from '@awdlab/jig-playwright';
import { loadComponent } from '../helper/load-component';
import { expectNoA11yViolations } from '../helper/axe';
import { expectScreenshot } from '../helper/screenshot';

test('toggles value on click, reflects aria-checked, and emits valueChange', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `<jig-toggle-button [value]="inputs().value" (valueChange)="output('value', $event)">Toggle</jig-toggle-button>`,
      imports: ['toggleButton'],
    },
    { inputs: { value: false } }
  );

  const host = page.locator('jig-toggle-button');
  const button = host.locator('button');
  const toggle = new AwdToggleButtonHarness(host);

  await toggle.expectActive(false);
  await expect(button).toHaveAttribute('aria-checked', 'false');

  // Click to activate.
  await toggle.click();
  await toggle.expectActive(true);
  await expect(button).toHaveAttribute('aria-checked', 'true');
  expect((await handle.getOutputLog())['value']).toEqual([true]);

  // Click to deactivate.
  await toggle.click();
  await toggle.expectActive(false);
  await expect(button).toHaveAttribute('aria-checked', 'false');
  expect((await handle.getOutputLog())['value']).toEqual([true, false]);
});

test('disabled toggle button does not toggle and emits nothing', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `<jig-toggle-button
        [value]="inputs().value"
        [disabled]="inputs().disabled"
        (valueChange)="output('value', $event)"
      >Toggle</jig-toggle-button>`,
      imports: ['toggleButton'],
    },
    { inputs: { value: false, disabled: true } }
  );

  const host = page.locator('jig-toggle-button');
  const button = host.locator('button');

  await expect(button).toBeDisabled();

  // Force the click past the disabled state — it must still not toggle.
  await button.click({ force: true });
  await new AwdToggleButtonHarness(host).expectActive(false);
  await expect(button).toHaveAttribute('aria-checked', 'false');

  // No output was emitted while disabled.
  expect(await handle.getOutputLog()).toEqual({});
});

test('accessibility (axe)', async ({ page }) => {
  await loadComponent(
    page,
    {
      // `label` (not projected text) drives the button's accessible name.
      template: `<jig-toggle-button [value]="inputs().value" [label]="'Toggle'"></jig-toggle-button>`,
      imports: ['toggleButton'],
    },
    { inputs: { value: false } }
  );

  await expectNoA11yViolations(page);
});

test('visual', async ({ page }, testInfo) => {
  await loadComponent(page, {
    template: `
      <div class="page-center flex items-center gap-2">
        <jig-toggle-button [value]="false">Off</jig-toggle-button>
        <jig-toggle-button [value]="true">On</jig-toggle-button>
        <jig-toggle-button [value]="true" disabled>Disabled</jig-toggle-button>
      </div>
    `,
    imports: ['toggleButton'],
  });

  await expectScreenshot(page, testInfo, 'states');
});
