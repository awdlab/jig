import test, { expect } from '@playwright/test';

import { expectNoA11yViolations } from '../helper/axe';
import { loadComponent } from '../helper/load-component';

test('label names the projected input and clicking it focuses the input', async ({ page }) => {
  await loadComponent(page, {
    template: `
      <ngn-input-field style="width: 240px" [label]="'Full name'">
        <input ngnInput />
      </ngn-input-field>`,
    imports: ['inputField', 'input'],
  });

  const input = page.locator('input');
  const inputId = await input.getAttribute('id');
  await expect(page.locator('label')).toHaveAttribute('for', inputId!);

  await page.locator('label').click();
  await expect(input).toBeFocused();
});

test('clear button empties the projected input and keeps an accessible name', async ({ page }) => {
  await loadComponent(page, {
    template: `
      <ngn-input-field style="width: 240px" [label]="'Search'" [showClearButton]="true">
        <input ngnInput value="hello" />
      </ngn-input-field>`,
    imports: ['inputField', 'input'],
  });

  const input = page.locator('input');
  await input.fill('hello');
  const clear = page.getByRole('button');
  await expect(clear).toHaveAttribute('aria-label', /.+/);

  await clear.click();
  await expect(input).toHaveValue('');
});

test('invalid forces the invalid look on the field chrome', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `
      <ngn-input-field style="width: 240px" [label]="'Email'" [invalid]="inputs().invalid">
        <input ngnInput />
      </ngn-input-field>`,
      imports: ['inputField', 'input'],
    },
    { inputs: { invalid: false } }
  );

  const chrome = page.locator('ngn-input-field [class*="input-field-root"]');
  await expect(chrome).not.toHaveClass(/input-field-invalid/);

  await handle.setInputs({ invalid: true });
  await expect(chrome).toHaveClass(/input-field-invalid/);
});

test('accessibility (axe)', async ({ page }) => {
  await loadComponent(page, {
    template: `
      <ngn-input-field style="width: 240px" [label]="'Full name'" [showClearButton]="true">
        <input ngnInput value="Ada" />
      </ngn-input-field>`,
    imports: ['inputField', 'input'],
  });

  await expect(page.locator('input')).toBeVisible();
  await expectNoA11yViolations(page);
});
