import test, { expect } from '@playwright/test';
import { NgnToggleButtonHarness } from '@ngneers/controls-playwright';
import { loadComponent } from '../helper/load-component';
import { expectNoA11yViolations } from '../helper/axe';

test('toggles value on click, reflects aria-pressed, and emits valueChange', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `<ngn-toggle-button [value]="inputs().value" (valueChange)="output('value', $event)">Toggle</ngn-toggle-button>`,
      imports: ['toggleButton'],
    },
    { inputs: { value: false } }
  );

  const host = page.locator('ngn-toggle-button');
  const button = host.locator('button');
  const toggle = new NgnToggleButtonHarness(host);

  await toggle.expectActive(false);
  await expect(button).toHaveAttribute('aria-pressed', 'false');

  // Click to activate.
  await toggle.click();
  await toggle.expectActive(true);
  await expect(button).toHaveAttribute('aria-pressed', 'true');
  expect((await handle.getOutputLog())['value']).toEqual([true]);

  // Click to deactivate.
  await toggle.click();
  await toggle.expectActive(false);
  await expect(button).toHaveAttribute('aria-pressed', 'false');
  expect((await handle.getOutputLog())['value']).toEqual([true, false]);
});

test('disabled toggle button does not toggle and emits nothing', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `<ngn-toggle-button
        [value]="inputs().value"
        [disabled]="inputs().disabled"
        (valueChange)="output('value', $event)"
      >Toggle</ngn-toggle-button>`,
      imports: ['toggleButton'],
    },
    { inputs: { value: false, disabled: true } }
  );

  const host = page.locator('ngn-toggle-button');
  const button = host.locator('button');

  await expect(button).toBeDisabled();

  // Force the click past the disabled state — it must still not toggle.
  await button.click({ force: true });
  await new NgnToggleButtonHarness(host).expectActive(false);
  await expect(button).toHaveAttribute('aria-pressed', 'false');

  // No output was emitted while disabled.
  expect(await handle.getOutputLog()).toEqual({});
});

test('accessibility (axe)', async ({ page }) => {
  await loadComponent(
    page,
    {
      // `label` (not projected text) drives the button's accessible name.
      template: `<ngn-toggle-button [value]="inputs().value" [label]="'Toggle'"></ngn-toggle-button>`,
      imports: ['toggleButton'],
    },
    { inputs: { value: false } }
  );

  await expectNoA11yViolations(page);
});
