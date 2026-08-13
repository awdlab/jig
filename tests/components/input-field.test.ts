import test, { expect } from '@playwright/test';

import { expectNoA11yViolations } from '../helper/axe';
import { loadComponent } from '../helper/load-component';
import { useRtl } from '../helper/direction';
import { expectScreenshot } from '../helper/screenshot';

test('label names the projected input and clicking it focuses the input', async ({ page }) => {
  await loadComponent(page, {
    template: `
      <jig-input-field style="width: 240px" [label]="'Full name'">
        <input jigInput />
      </jig-input-field>`,
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
      <jig-input-field style="width: 240px" [label]="'Search'" [showClearButton]="true">
        <input jigInput value="hello" />
      </jig-input-field>`,
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
      <jig-input-field style="width: 240px" [label]="'Email'" [invalid]="inputs().invalid">
        <input jigInput />
      </jig-input-field>`,
      imports: ['inputField', 'input'],
    },
    { inputs: { invalid: false } }
  );

  const chrome = page.locator('jig-input-field [class*="input-field-root"]');
  await expect(chrome).not.toHaveClass(/input-field-invalid/);

  await handle.setInputs({ invalid: true });
  await expect(chrome).toHaveClass(/input-field-invalid/);
});

test('accessibility (axe)', async ({ page }) => {
  await loadComponent(page, {
    template: `
      <jig-input-field style="width: 240px" [label]="'Full name'" [showClearButton]="true">
        <input jigInput value="Ada" />
      </jig-input-field>`,
    imports: ['inputField', 'input'],
  });

  await expect(page.locator('input')).toBeVisible();
  await expectNoA11yViolations(page);
});

test('rtl', async ({ page }, testInfo) => {
  await useRtl(page);
  await loadComponent(page, {
    template: `
      <jig-input-field style="width: 240px" [label]="'Full name'">
        <input jigInput />
      </jig-input-field>`,
    imports: ['inputField', 'input'],
  });
  await expectScreenshot(page, testInfo);
});
