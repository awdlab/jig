import test, { expect } from '@playwright/test';
import { NgnSelectButtonHarness } from '@ngneers/controls-playwright';
import { expectNoA11yViolations } from '../helper/axe';
import { loadComponent } from '../helper/load-component';
import { expectScreenshot } from '../helper/screenshot';

const options = `[
  { label: 'Option 1', value: 1 },
  { label: 'Option 2', value: 2 },
  { label: 'Option 3', value: 3 },
]`;

test('base', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<ngn-select-button [options]="${options}" [value]="inputs().value" (valueChange)="output('value', $event)" />`,
      imports: ['selectButton'],
    },
    {
      inputs: {
        value: null,
      },
    }
  );

  const selectButton = new NgnSelectButtonHarness(page.locator('ngn-select-button'));
  await selectButton.expectButtonCount(3);
  await selectButton.expectNoneSelected();
  await expectScreenshot(page, testInfo, 'base');

  // Select first option
  await selectButton.clickButtonAt(0);
  await selectButton.expectSelectedAt(0);
  await expectScreenshot(page, testInfo, 'selected-first');

  // Verify output event
  const outputs = await handle.getOutputLog();
  expect(outputs['value']).toEqual([1]);

  // Select second option
  await selectButton.clickButtonAt(1);
  await selectButton.expectSelectedAt(1);
  await selectButton.getButtonAt(0).expectActive(false);

  const outputs2 = await handle.getOutputLog();
  expect(outputs2['value']).toEqual([1, 2]);
});

test('prevent unselect', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<ngn-select-button [options]="${options}" [value]="inputs().value" (valueChange)="output('value', $event)" />`,
      imports: ['selectButton'],
    },
    {
      inputs: {
        value: 1,
      },
    }
  );

  const selectButton = new NgnSelectButtonHarness(page.locator('ngn-select-button'));
  await selectButton.expectSelectedAt(0);

  // Click selected option — readonly prevents interaction
  await selectButton.clickButtonAt(0, true);
  await selectButton.expectSelectedAt(0);

  // Verify no output emitted
  expect(await handle.getOutputLog()).toEqual({});
});

test('allow unselect', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<ngn-select-button [options]="${options}" [value]="inputs().value" (valueChange)="output('value', $event)" [allowUnselect]="inputs().allowUnselect" />`,
      imports: ['selectButton'],
    },
    {
      inputs: {
        value: 1,
        allowUnselect: true,
      },
    }
  );

  const selectButton = new NgnSelectButtonHarness(page.locator('ngn-select-button'));
  await selectButton.expectSelectedAt(0);

  // Click selected option — allowUnselect removes readonly so click deactivates
  await selectButton.clickButtonAt(0);
  await selectButton.getButtonAt(0).expectActive(false);

  // Select another option
  await selectButton.clickButtonAt(1);
  await selectButton.expectSelectedAt(1);

  const outputs = await handle.getOutputLog();
  expect(outputs['value']).toEqual([2]);
});

test('states', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<ngn-select-button
        [options]="${options}"
        [value]="inputs().value"
        [disabled]="inputs().disabled"
        [readonly]="inputs().readonly"
        [invalid]="inputs().invalid"
        [touched]="inputs().touched"
        (valueChange)="output('value', $event)"
      />`,
      imports: ['selectButton'],
    },
    {
      inputs: {
        value: 1,
        disabled: false,
        readonly: false,
        invalid: false,
        touched: false,
      },
    }
  );

  const selectButton = new NgnSelectButtonHarness(page.locator('ngn-select-button'));

  // Disabled state
  await handle.setInputs({ disabled: true });
  await selectButton.expectDisabled(true);
  await expectScreenshot(page, testInfo, 'disabled');

  // Try click while disabled — should not work
  await selectButton.clickButtonAt(1, true);
  expect(await handle.getOutputLog()).toEqual({});

  // Readonly state
  await handle.setInputs({ disabled: false, readonly: true });
  await expectScreenshot(page, testInfo, 'readonly');

  // Try click while readonly — should not work
  await selectButton.clickButtonAt(1, true);
  expect(await handle.getOutputLog()).toEqual({});

  // Invalid state — touch the control so invalidOn='touched' surfaces it.
  await handle.setInputs({ readonly: false, invalid: true, touched: true });
  await expectScreenshot(page, testInfo, 'invalid');
});

test('value updates via input', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<ngn-select-button [options]="${options}" [value]="inputs().value" (valueChange)="output('value', $event)" />`,
      imports: ['selectButton'],
    },
    {
      inputs: {
        value: null,
      },
    }
  );

  const selectButton = new NgnSelectButtonHarness(page.locator('ngn-select-button'));
  await selectButton.expectNoneSelected();

  // Set value programmatically
  await handle.setInputs({ value: 2 });
  await selectButton.expectSelectedAt(1);

  // Change to different value
  await handle.setInputs({ value: 3 });
  await selectButton.expectSelectedAt(2);
  await selectButton.getButtonAt(1).expectActive(false);

  // No output emitted for programmatic changes
  expect(await handle.getOutputLog()).toEqual({});
});

test('accessibility (axe)', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `<ngn-select-button [label]="'Choose an option'" [options]="${options}" [value]="inputs().value" />`,
      imports: ['selectButton'],
    },
    {
      inputs: {
        value: 1,
      },
    }
  );

  await expectNoA11yViolations(page);
});
