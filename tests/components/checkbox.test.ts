import test, { expect } from '@playwright/test';
import { JigCheckboxHarness } from '@awdlab/jig-playwright';
import { loadComponent } from '../helper/load-component';
import { useRtl } from '../helper/direction';
import { expectNoA11yViolations } from '../helper/axe';
import { expectScreenshot } from '../helper/screenshot';

const TEMPLATE = `<jig-checkbox
  [value]="inputs().value"
  [disabled]="inputs().disabled"
  [readonly]="inputs().readonly"
  [invalid]="inputs().invalid"
  (valueChange)="output('value', $event)"
/>`;

test('toggles on click and emits value changes', async ({ page }) => {
  const handle = await loadComponent(
    page,
    { template: TEMPLATE, imports: ['checkbox'] },
    { inputs: { value: false, disabled: false, readonly: false, invalid: false } }
  );

  const input = page.getByRole('checkbox');
  await expect(input).not.toBeChecked();

  await input.click();
  await expect(input).toBeChecked();

  await input.click();
  await expect(input).not.toBeChecked();

  const outputs = await handle.getOutputLog();
  expect(outputs['value']).toEqual([true, false]);
});

test('toggles via keyboard (Space)', async ({ page }) => {
  const handle = await loadComponent(
    page,
    { template: TEMPLATE, imports: ['checkbox'] },
    { inputs: { value: false, disabled: false, readonly: false, invalid: false } }
  );

  const input = page.getByRole('checkbox');
  await input.focus();
  await input.press('Space');
  await expect(input).toBeChecked();

  await input.press('Space');
  await expect(input).not.toBeChecked();

  expect((await handle.getOutputLog())['value']).toEqual([true, false]);
});

test('disabled checkbox cannot be toggled', async ({ page }) => {
  const handle = await loadComponent(
    page,
    { template: TEMPLATE, imports: ['checkbox'] },
    { inputs: { value: false, disabled: true, readonly: false, invalid: false } }
  );

  const checkbox = new JigCheckboxHarness(page.locator('jig-checkbox'));
  await checkbox.expectDisabled();

  await checkbox.toggle(true);
  await checkbox.expectValue(false);
  expect(await handle.getOutputLog()).toEqual({});
});

test('readonly checkbox blocks interaction but stays enabled', async ({ page }) => {
  const handle = await loadComponent(
    page,
    { template: TEMPLATE, imports: ['checkbox'] },
    { inputs: { value: false, disabled: false, readonly: true, invalid: false } }
  );

  const checkbox = new JigCheckboxHarness(page.locator('jig-checkbox'));
  await checkbox.expectDisabled(false);
  await checkbox.expectReadonly();

  // The control preventDefaults the click, so the value never flips.
  await checkbox.toggle();
  await checkbox.expectValue(false);
  expect(await handle.getOutputLog()).toEqual({});
});

test('surfaces aria-invalid only after the control is touched', async ({ page }) => {
  await loadComponent(
    page,
    { template: TEMPLATE, imports: ['checkbox'] },
    { inputs: { value: false, disabled: false, readonly: false, invalid: true } }
  );

  const checkbox = new JigCheckboxHarness(page.locator('jig-checkbox'));
  // invalidOn='touched' (default) gates the raw invalid flag: nothing surfaces
  // until the user has interacted, so the invalid never flashes on a pristine field.
  await checkbox.expectInvalid(false);

  // blurring the control marks it touched, which reveals the invalid state.
  await checkbox.focus();
  await checkbox.expectFocused();
  await checkbox.input.blur();

  await checkbox.expectInvalid();
});

test('indeterminate state renders as mixed and resolves on click', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `<jig-checkbox
        [allowIndeterminate]="true"
        [value]="inputs().value"
        (valueChange)="output('value', $event)"
      />`,
      imports: ['checkbox'],
    },
    { inputs: { value: null } }
  );

  const checkbox = new JigCheckboxHarness(page.locator('jig-checkbox'));
  await checkbox.expectIndeterminate();

  // Clicking an indeterminate checkbox resolves it to checked.
  await checkbox.toggle();
  await checkbox.expectIndeterminate(false);
  await checkbox.expectValue(true);
  expect((await handle.getOutputLog())['value']).toEqual([true]);
});

test('accessibility (axe)', async ({ page }) => {
  // Named via an implicit wrapping <label> so the checkbox has an accessible name.
  await loadComponent(
    page,
    {
      template: `<label>Accept the terms
        <jig-checkbox [value]="inputs().value" (valueChange)="output('value', $event)" />
      </label>`,
      imports: ['checkbox'],
    },
    { inputs: { value: false } }
  );
  await expectNoA11yViolations(page);
});

test('visual', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    { template: `<div class="page-center">${TEMPLATE}</div>`, imports: ['checkbox'] },
    { inputs: { value: false, disabled: false, readonly: false, invalid: false } }
  );

  await test.step('unchecked', async () => {
    await expectScreenshot(page, testInfo, 'unchecked');
  });

  await test.step('checked', async () => {
    await handle.setInputs({ value: true, disabled: false, readonly: false, invalid: false });
    await expectScreenshot(page, testInfo, 'checked');
  });

  await test.step('disabled', async () => {
    await handle.setInputs({ value: true, disabled: true, readonly: false, invalid: false });
    await expectScreenshot(page, testInfo, 'disabled');
  });

  await test.step('invalid', async () => {
    await handle.setInputs({ value: false, disabled: false, readonly: false, invalid: true });
    // invalidOn='touched' gates the styling, so touch the control first.
    await page.getByRole('checkbox').focus();
    await page.getByRole('checkbox').blur();
    await expect(page.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true');
    await expectScreenshot(page, testInfo, 'invalid');
  });
});

test('rtl', async ({ page }, testInfo) => {
  await useRtl(page);
  await loadComponent(
    page,
    { template: TEMPLATE, imports: ['checkbox'] },
    { inputs: { value: false, disabled: false, readonly: false, invalid: false } }
  );
  await expectScreenshot(page, testInfo);
});
