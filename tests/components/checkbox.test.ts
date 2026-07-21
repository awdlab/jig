import test, { expect } from '@playwright/test';
import { loadComponent } from '../helper/load-component';
import { expectNoA11yViolations } from '../helper/axe';

const TEMPLATE = `<ngn-checkbox
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

  const input = page.getByRole('checkbox');
  await expect(input).toBeDisabled();

  await input.click({ force: true });
  await expect(input).not.toBeChecked();
  expect(await handle.getOutputLog()).toEqual({});
});

test('readonly checkbox blocks interaction but stays enabled', async ({ page }) => {
  const handle = await loadComponent(
    page,
    { template: TEMPLATE, imports: ['checkbox'] },
    { inputs: { value: false, disabled: false, readonly: true, invalid: false } }
  );

  const input = page.getByRole('checkbox');
  await expect(input).not.toBeDisabled();
  await expect(input).toHaveAttribute('aria-readonly', '');

  // The control preventDefaults the click, so the value never flips.
  await input.click();
  await expect(input).not.toBeChecked();
  expect(await handle.getOutputLog()).toEqual({});
});

test('surfaces aria-invalid only after the control is touched', async ({ page }) => {
  await loadComponent(
    page,
    { template: TEMPLATE, imports: ['checkbox'] },
    { inputs: { value: false, disabled: false, readonly: false, invalid: true } }
  );

  const checkbox = page.getByRole('checkbox');
  // invalidOn='touched' (default) gates the raw invalid flag: nothing surfaces
  // until the user has interacted, so the invalid never flashes on a pristine field.
  await expect(checkbox).not.toHaveAttribute('aria-invalid', 'true');

  // blurring the control marks it touched, which reveals the invalid state.
  await checkbox.focus();
  await checkbox.blur();

  await expect(checkbox).toHaveAttribute('aria-invalid', 'true');
});

test('indeterminate state renders as mixed and resolves on click', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `<ngn-checkbox
        [allowIndeterminate]="true"
        [value]="inputs().value"
        (valueChange)="output('value', $event)"
      />`,
      imports: ['checkbox'],
    },
    { inputs: { value: null } }
  );

  const input = page.getByRole('checkbox');
  await expect(input).toHaveJSProperty('indeterminate', true);

  // Clicking an indeterminate checkbox resolves it to checked.
  await input.click();
  await expect(input).toHaveJSProperty('indeterminate', false);
  await expect(input).toBeChecked();
  expect((await handle.getOutputLog())['value']).toEqual([true]);
});

test('accessibility (axe)', async ({ page }) => {
  // Named via an implicit wrapping <label> so the checkbox has an accessible name.
  await loadComponent(
    page,
    {
      template: `<label>Accept the terms
        <ngn-checkbox [value]="inputs().value" (valueChange)="output('value', $event)" />
      </label>`,
      imports: ['checkbox'],
    },
    { inputs: { value: false } }
  );
  await expectNoA11yViolations(page);
});
