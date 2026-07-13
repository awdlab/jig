import test, { expect } from '@playwright/test';
import { NgnRadioGroupHarness } from '@ngneers/controls-playwright';
import { loadComponent } from '../helper/load-component';
import { expectScreenshot } from '../helper/screenshot';
import { expectNoA11yViolations } from '../helper/axe';

const TEMPLATE = `
  <ngn-radio-group
    [value]="inputs().value"
    [disabled]="inputs().disabled"
    [readonly]="inputs().readonly"
    [invalid]="inputs().invalid"
    (valueChange)="output('value', $event)"
  >
    <ngn-radio value="a">A</ngn-radio>
    <ngn-radio value="b" [disabled]="inputs().bDisabled">B</ngn-radio>
    <ngn-radio value="c">C</ngn-radio>
  </ngn-radio-group>
`;

test('base', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    { template: TEMPLATE, imports: ['radioGroup', 'radio'] },
    {
      inputs: {
        value: 'a',
        disabled: false,
        readonly: false,
        invalid: false,
        bDisabled: false,
      },
    }
  );

  const group = new NgnRadioGroupHarness(page.locator('ngn-radio-group'));
  await group.expectSelected(0);
  await expectScreenshot(page, testInfo, 'selected-a');

  // Click the third option to select it.
  await group.select(2);
  await group.expectSelected(2);
  await group.expectNotSelected(0);

  const outputs = await handle.getOutputLog();
  expect(outputs['value']).toEqual(['c']);
});

test('keyboard selection follows focus', async ({ page }) => {
  const handle = await loadComponent(
    page,
    { template: TEMPLATE, imports: ['radioGroup', 'radio'] },
    { inputs: { value: 'a', disabled: false, readonly: false, invalid: false, bDisabled: false } }
  );

  const group = new NgnRadioGroupHarness(page.locator('ngn-radio-group'));
  await group.focusActive(); // focus the checked option (a)

  // ArrowRight moves to b and selects it (selection follows focus).
  await page.keyboard.press('ArrowRight');
  await group.expectSelected(1);

  // ArrowRight again -> c.
  await page.keyboard.press('ArrowRight');
  await group.expectSelected(2);

  const outputs = await handle.getOutputLog();
  expect(outputs['value']).toEqual(['b', 'c']);
});

test('keyboard skips disabled option', async ({ page }) => {
  const handle = await loadComponent(
    page,
    { template: TEMPLATE, imports: ['radioGroup', 'radio'] },
    { inputs: { value: 'a', disabled: false, readonly: false, invalid: false, bDisabled: true } }
  );

  const group = new NgnRadioGroupHarness(page.locator('ngn-radio-group'));
  await group.expectDisabled(1, true);
  await group.focusActive();

  // b is disabled, so ArrowRight jumps straight to c.
  await page.keyboard.press('ArrowRight');
  await group.expectSelected(2);

  const outputs = await handle.getOutputLog();
  expect(outputs['value']).toEqual(['c']);
});

test('states', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    { template: TEMPLATE, imports: ['radioGroup', 'radio'] },
    { inputs: { value: 'a', disabled: false, readonly: false, invalid: false, bDisabled: false } }
  );

  const group = new NgnRadioGroupHarness(page.locator('ngn-radio-group'));

  // Disabled group: clicking does not change the value.
  await handle.setInputs({ disabled: true });
  await group.expectDisabled(0, true);
  await expectScreenshot(page, testInfo, 'disabled');
  await group.select(2, true);
  await group.expectSelected(0);

  // Readonly group: still no value change on click.
  await handle.setInputs({ disabled: false, readonly: true });
  await group.select(2, true);
  await group.expectSelected(0);
  await expectScreenshot(page, testInfo, 'readonly');

  // Invalid styling.
  await handle.setInputs({ readonly: false, invalid: true });
  await expectScreenshot(page, testInfo, 'invalid');

  expect(await handle.getOutputLog()).toEqual({});
});

test('accessibility (axe)', async ({ page }) => {
  await loadComponent(
    page,
    { template: TEMPLATE, imports: ['radioGroup', 'radio'] },
    { inputs: { value: 'a', disabled: false, readonly: false, invalid: false, bDisabled: false } }
  );

  const group = new NgnRadioGroupHarness(page.locator('ngn-radio-group'));
  await group.expectSelected(0);

  await expectNoA11yViolations(page);
});
