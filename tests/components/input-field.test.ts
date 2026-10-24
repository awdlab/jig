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

test('an invalid form only marks the fields whose own control is invalid', async ({ page }) => {
  await loadComponent(page, {
    template: `
      <form style="display: flex; flex-direction: column; gap: 1.5rem; width: 240px">
        <jig-input-field data-testid="required" [label]="'Required'">
          <input jigInput name="req" ngModel required />
        </jig-input-field>
        <jig-input-field data-testid="optional" [label]="'Optional'">
          <input jigInput name="opt" ngModel />
        </jig-input-field>
        <jig-input-field data-testid="forced" [label]="'Forced'" [invalid]="true">
          <input jigInput name="forced" ngModel />
        </jig-input-field>
      </form>`,
    imports: ['inputField', 'input', 'forms'],
  });

  for (const name of ['req', 'opt', 'forced']) {
    await page.locator(`input[name="${name}"]`).focus();
  }
  await page.locator('input[name="forced"]').blur();
  await page.mouse.move(0, 0);
  await expect(page.locator('form')).toHaveClass(/ng-invalid/);
  await expect(page.locator('form')).toHaveClass(/ng-touched/);

  const borderColor = (testId: string) =>
    page
      .getByTestId(testId)
      .locator('[class*="input-field-root"]')
      .evaluate(el => getComputedStyle(el).borderTopColor);

  await expect
    .poll(async () => {
      const [required, optional, forced] = await Promise.all(
        ['required', 'optional', 'forced'].map(borderColor)
      );
      return { optionalIsInvalid: optional === required, forcedIsInvalid: forced === required };
    })
    .toEqual({ optionalIsInvalid: false, forcedIsInvalid: true });
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

test('readonly hides the clear button so the value cannot be wiped', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `
      <jig-input-field
        style="width: 240px"
        [label]="'Search'"
        [showClearButton]="true"
        [readonly]="inputs().readonly"
      >
        <input jigInput value="hello" [readOnly]="inputs().readonly" />
      </jig-input-field>`,
      imports: ['inputField', 'input'],
    },
    { inputs: { readonly: true } }
  );

  const input = page.locator('input');
  await expect(page.getByRole('button')).toHaveCount(0);
  await expect(input).toHaveValue('hello');

  await handle.setInputs({ readonly: false });
  await page.getByRole('button').click();
  await expect(input).toHaveValue('');
});
