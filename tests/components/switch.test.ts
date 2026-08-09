import test, { expect } from '@playwright/test';
import { AwdSwitchHarness } from '@awdlab/jig-playwright';
import { loadComponent } from '../helper/load-component';
import { expectScreenshot } from '../helper/screenshot';
import { expectNoA11yViolations } from '../helper/axe';

test('base', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<jig-switch [value]="inputs().value" (valueChange)="output('value', $event)" />`,
      imports: ['switch'],
    },
    {
      inputs: {
        value: false,
      },
    }
  );

  const switchControl = new AwdSwitchHarness(page.locator('jig-switch'));
  await switchControl.expectValue(false);
  await expectScreenshot(page, testInfo, 'unchecked');

  // Toggle to checked
  await switchControl.toggle();
  await switchControl.expectValue(true);
  await expectScreenshot(page, testInfo, 'checked');

  // Verify output event
  const outputs = await handle.getOutputLog();
  expect(outputs['value']).toEqual([true]);

  // Toggle back to unchecked
  await switchControl.toggle();
  await switchControl.expectValue(false);

  // Verify output event
  const outputs2 = await handle.getOutputLog();
  expect(outputs2['value']).toEqual([true, false]);
});

test('keyboard navigation', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<jig-switch [value]="inputs().value" (valueChange)="output('value', $event)" />`,
      imports: ['switch'],
    },
    {
      inputs: {
        value: false,
      },
    }
  );

  const switchControl = new AwdSwitchHarness(page.locator('jig-switch'));
  await switchControl.expectValue(false);

  // Focus the switch
  await switchControl.input.focus();

  // Press Space to toggle
  await switchControl.input.press('Space');
  await switchControl.expectValue(true);

  // Press Space again to toggle back
  await switchControl.input.press('Space');
  await switchControl.expectValue(false);

  // Verify outputs
  const outputs = await handle.getOutputLog();
  expect(outputs['value']).toEqual([true, false]);
});

test('states', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<jig-switch
        [value]="inputs().value"
        [disabled]="inputs().disabled"
        [readonly]="inputs().readonly"
        [invalid]="inputs().invalid"
        [touched]="inputs().touched"
        (valueChange)="output('value', $event)"
      />`,
      imports: ['switch'],
    },
    {
      inputs: {
        value: false,
        disabled: false,
        readonly: false,
        invalid: false,
        touched: false,
      },
    }
  );

  const switchControl = new AwdSwitchHarness(page.locator('jig-switch'));

  // Test disabled state
  await handle.setInputs({ disabled: true });
  await switchControl.expectDisabled(true);
  await expectScreenshot(page, testInfo, 'disabled-unchecked');

  // Try to toggle - should not work
  await switchControl.toggle(true);
  await switchControl.expectValue(false);

  // Set value to true and test disabled with checked
  await handle.setInputs({ value: true });
  await switchControl.expectValue(true);
  await expectScreenshot(page, testInfo, 'disabled-checked');

  // Test readonly state
  await handle.setInputs({ disabled: false, readonly: true, value: false });
  await switchControl.expectReadonly(true);
  await expectScreenshot(page, testInfo, 'readonly-unchecked');

  // Try to toggle - should not work
  await switchControl.toggle(true);
  await switchControl.expectValue(false);

  // Set value to true and test readonly with checked
  await handle.setInputs({ value: true });
  await switchControl.expectValue(true);
  await expectScreenshot(page, testInfo, 'readonly-checked');

  // Test invalid state — touch the control so invalidOn='touched' surfaces it.
  await handle.setInputs({ readonly: false, invalid: true, value: false, touched: true });
  await expectScreenshot(page, testInfo, 'invalid-unchecked');

  await handle.setInputs({ value: true });
  await expectScreenshot(page, testInfo, 'invalid-checked');

  // Verify no outputs were emitted during disabled/readonly tests
  expect(await handle.getOutputLog()).toEqual({});
});

test('value updates', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<jig-switch [value]="inputs().value" (valueChange)="output('value', $event)" />`,
      imports: ['switch'],
    },
    {
      inputs: {
        value: false,
      },
    }
  );

  const switchControl = new AwdSwitchHarness(page.locator('jig-switch'));
  await switchControl.expectValue(false);

  // Update value via input
  await handle.setInputs({ value: true });
  await switchControl.expectValue(true);

  // Update value via interaction
  await switchControl.toggle();
  await switchControl.expectValue(false);

  // Verify output
  const outputs = await handle.getOutputLog();
  expect(outputs['value']).toEqual([false]);
});

test('accessibility (axe)', async ({ page }) => {
  await loadComponent(
    page,
    {
      // The checkbox derives its accessible name from the associated label.
      template: `
        <jig-switch #sw [value]="inputs().value" />
        <label [for]="sw.inputId()">Notifications</label>
      `,
      imports: ['switch'],
    },
    {
      inputs: {
        value: false,
      },
    }
  );

  await expectNoA11yViolations(page);
});
