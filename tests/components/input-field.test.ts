import test, { expect, type Locator, type Page } from '@playwright/test';
import { JigInputFieldHarness, JigInputHarness } from '@awdlab/jig-playwright';

import { expectNoA11yViolations } from '../helper/axe';
import { loadComponent } from '../helper/load-component';
import { useRtl } from '../helper/direction';
import { expectScreenshot } from '../helper/screenshot';

function inputField(page: Page, locator: Locator = page.locator('jig-input-field')) {
  return new JigInputFieldHarness(locator, field => ({
    input: new JigInputHarness(field.locator('input')),
  }));
}

test('label names the projected input and clicking it focuses the input', async ({ page }) => {
  await loadComponent(page, {
    template: `
      <jig-input-field style="width: 240px" [label]="'Full name'">
        <input jigInput />
      </jig-input-field>`,
    imports: ['inputField', 'input'],
  });

  const field = inputField(page);
  const { input } = field.children;
  const inputId = await input.locator.getAttribute('id');
  await expect(field.label).toHaveAttribute('for', inputId!);

  await field.label.click();
  await input.expectFocused();
});

test('label names a projected select and clicking it focuses the select', async ({ page }) => {
  await loadComponent(page, {
    template: `
      <jig-input-field style="width: 240px" [label]="'Stage'">
        <jig-select [options]="[{ value: 'a', label: 'Lead' }]" />
      </jig-input-field>`,
    imports: ['inputField', 'select'],
  });

  const combobox = page.getByRole('combobox', { name: 'Stage' });
  await expect(combobox).toBeVisible();

  await inputField(page).label.click();
  await expect(combobox).toBeFocused();
});

test('label names a projected calendar and clicking it focuses its input', async ({ page }) => {
  await loadComponent(page, {
    template: `
      <jig-input-field style="width: 240px" [label]="'Close date'">
        <jig-calendar />
      </jig-input-field>`,
    imports: ['inputField', 'calendar'],
  });

  const input = page.getByLabel('Close date');
  await expect(input).toHaveCount(1);
  await expect(input).not.toHaveAttribute('aria-label');

  await inputField(page).label.click();
  await expect(input).toBeFocused();
});

test('label names a projected editable select input', async ({ page }) => {
  await loadComponent(page, {
    template: `
      <jig-input-field style="width: 240px" [label]="'City'">
        <jig-select [editable]="true" [options]="[{ value: 'b', label: 'Berlin' }]">
          <input jigInput />
        </jig-select>
      </jig-input-field>`,
    imports: ['inputField', 'select', 'input'],
  });

  await expect(page.getByRole('combobox', { name: 'City' })).toBeVisible();
});

test('labelledBy adds to the field label instead of replacing it', async ({ page }) => {
  await loadComponent(page, {
    template: `
      <span id="hint">(optional)</span>
      <jig-input-field style="width: 240px" [label]="'Nickname'" [labelledBy]="'hint'">
        <input jigInput />
      </jig-input-field>`,
    imports: ['inputField', 'input'],
  });

  await expect(inputField(page).children.input.locator).toHaveAccessibleName('Nickname (optional)');
});

test('clear button empties the projected input and keeps an accessible name', async ({ page }) => {
  await loadComponent(page, {
    template: `
      <jig-input-field style="width: 240px" [label]="'Search'" [showClearButton]="true">
        <input jigInput value="hello" />
      </jig-input-field>`,
    imports: ['inputField', 'input'],
  });

  const field = inputField(page);
  const { input } = field.children;
  await input.fill('hello');
  await expect(field.clearButton).toHaveAttribute('aria-label', /.+/);

  await field.clear();
  await input.expectValue('');
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

  const field = inputField(page);
  const invalidClass = new RegExp(field.classes.invalid.slice(1));
  await expect(field.root).not.toHaveClass(invalidClass);

  await handle.setInputs({ invalid: true });
  await expect(field.root).toHaveClass(invalidClass);
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
    inputField(page, page.getByTestId(testId)).root.evaluate(
      el => getComputedStyle(el).borderTopColor
    );

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

  await inputField(page).children.input.expectVisible();
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

  const field = inputField(page);
  const { input } = field.children;
  await expect(field.clearButton).toHaveCount(0);
  await input.expectValue('hello');

  await handle.setInputs({ readonly: false });
  await field.clear();
  await input.expectValue('');
});

test('labelledBy reaches a projected select too', async ({ page }) => {
  await loadComponent(page, {
    template: `
      <span id="hint">(required)</span>
      <jig-input-field style="width: 240px" [label]="'Stage'" [labelledBy]="'hint'">
        <jig-select [options]="[{ value: 'a', label: 'Lead' }]" />
      </jig-input-field>`,
    imports: ['inputField', 'select'],
  });

  await expect(page.getByRole('combobox')).toHaveAccessibleName('Stage (required)');
});

test('the field label follows an id set on the projected input', async ({ page }) => {
  await loadComponent(page, {
    template: `
      <label for="nick">External</label>
      <jig-input-field style="width: 240px" [label]="'Nickname'">
        <input jigInput id="nick" />
      </jig-input-field>`,
    imports: ['inputField', 'input'],
  });

  const field = inputField(page);
  await expect(field.children.input.locator).toHaveAttribute('id', 'nick');
  await expect(field.label).toHaveAttribute('for', 'nick');
});
