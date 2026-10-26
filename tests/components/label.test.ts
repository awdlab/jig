import test, { expect } from '@playwright/test';

import { expectNoA11yViolations } from '../helper/axe';
import { loadComponent } from '../helper/load-component';

test('names a slider and clicking the label focuses it', async ({ page }) => {
  await loadComponent(page, {
    template: `
      <label [jigFor]="volume">Volume</label>
      <jig-slider #volume style="width: 240px" />`,
    imports: ['jigFor', 'slider'],
  });

  const slider = page.getByRole('slider', { name: 'Volume' });
  await expect(slider).toBeVisible();

  await page.locator('label').click();
  await expect(slider).toBeFocused();
  await expectNoA11yViolations(page);
});

test('names a select-button group by id and focuses its selected button', async ({ page }) => {
  await loadComponent(page, {
    template: `
      <label jigFor="view">View</label>
      <jig-select-button
        inputId="view"
        [value]="'grid'"
        [options]="[{ value: 'list', label: 'List' }, { value: 'grid', label: 'Grid' }]"
      />`,
    imports: ['jigFor', 'selectButton'],
  });

  await expect(page.getByRole('group', { name: 'View' })).toBeVisible();

  await page.locator('label').click();
  await expect(page.getByRole('switch', { name: 'Grid' })).toBeFocused();
  await expectNoA11yViolations(page);
});

test('names a native input through aria-labelledby too', async ({ page }) => {
  await loadComponent(page, {
    template: `
      <label jigFor="name">Name</label>
      <input id="name" />`,
    imports: ['jigFor'],
  });

  const input = page.getByRole('textbox', { name: 'Name' });
  const labelId = await page.locator('label').getAttribute('id');
  await expect(input).toHaveAttribute('aria-labelledby', labelId!);

  await page.locator('label').click();
  await expect(input).toBeFocused();
});

test('names an inline calendar as a group', async ({ page }) => {
  await loadComponent(page, {
    template: `
      <label [jigFor]="due">Due date</label>
      <jig-calendar #due [inline]="true" />`,
    imports: ['jigFor', 'calendar'],
  });

  await expect(page.getByRole('group', { name: 'Due date' })).toBeVisible();
});

test('names a color-picker and a toggle-button through their native buttons', async ({ page }) => {
  await loadComponent(page, {
    template: `
      <label [jigFor]="brand">Brand color</label>
      <jig-color-picker #brand />
      <label [jigFor]="bold">Bold</label>
      <jig-toggle-button #bold />`,
    imports: ['jigFor', 'color-picker', 'toggleButton'],
  });

  await expect(page.getByRole('button', { name: 'Brand color' })).toBeVisible();
  await page.getByText('Bold').click();
  await expect(page.getByRole('switch', { name: 'Bold' })).toBeFocused();
});

test('labels a slider by the id set on its host', async ({ page }) => {
  await loadComponent(page, {
    template: `
      <label jigFor="vol">Volume</label>
      <jig-slider id="vol" style="width: 240px" />`,
    imports: ['jigFor', 'slider'],
  });

  await expect(page.locator('jig-slider')).toHaveAttribute('id', 'vol');
  await expect(page.getByRole('slider', { name: 'Volume' })).toBeVisible();
});

test('removes its id from the control when the label goes away', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `
        @if (inputs().show) {
          <label [jigFor]="volume">Volume</label>
        }
        <jig-slider #volume style="width: 240px" />`,
      imports: ['jigFor', 'slider'],
    },
    { inputs: { show: true } }
  );

  const slider = page.locator('jig-slider');
  await expect(slider).toHaveAttribute('aria-labelledby', /.+/);
  await handle.setInputs({ show: false });
  await expect(slider).not.toHaveAttribute('aria-labelledby');
});

test('a wrapping label leaves focus on the clicked option', async ({ page }) => {
  await loadComponent(page, {
    template: `
      <label [jigFor]="view">
        View
        <jig-select-button
          #view
          [options]="[{ value: 'list', label: 'List' }, { value: 'grid', label: 'Grid' }]"
          [value]="'list'"
        />
      </label>`,
    imports: ['jigFor', 'selectButton'],
  });

  await page.getByRole('switch', { name: 'Grid' }).click();
  await expect(page.getByRole('switch', { name: 'Grid' })).toBeFocused();
});

test('an unlabelled color-picker trigger keeps a fallback name', async ({ page }) => {
  await loadComponent(page, {
    template: `<jig-color-picker />`,
    imports: ['color-picker'],
  });

  await expect(page.getByRole('button', { name: 'Select color' })).toBeVisible();
});

test('the label wins over a control label input on native and custom targets alike', async ({
  page,
}) => {
  await loadComponent(page, {
    template: `
      <label [jigFor]="tags">Tags</label>
      <jig-tag-input #tags label="Other" />
      <label [jigFor]="volume">Volume</label>
      <jig-slider #volume label="Other" style="width: 240px" />`,
    imports: ['jigFor', 'tagInput', 'slider'],
  });

  await expect(page.getByRole('combobox', { name: 'Tags' })).toBeVisible();
  await expect(page.getByRole('slider', { name: 'Volume' })).toBeVisible();
});

test('labels a number-input and a tree by the id set on their host', async ({ page }) => {
  await loadComponent(page, {
    template: `
      <label [jigFor]="amount">Amount</label>
      <input jigNumberInput #amount="jigNumberInput" />
      <label jigFor="files">Files</label>
      <jig-tree id="files" [items]="[{ value: 'a', label: 'A' }]" />`,
    imports: ['jigFor', 'numberInput', 'tree'],
  });

  await expect(page.getByRole('spinbutton', { name: 'Amount' })).toBeVisible();
  await expect(page.locator('jig-tree')).toHaveAttribute('id', 'files');
  await expect(page.getByRole('tree', { name: 'Files' })).toBeVisible();
});

test('checkbox and switch accept labelledBy', async ({ page }) => {
  await loadComponent(page, {
    template: `
      <span id="ext">External</span>
      <jig-checkbox labelledBy="ext" />
      <jig-switch labelledBy="ext" />`,
    imports: ['checkbox', 'switch'],
  });

  await expect(page.getByRole('checkbox', { name: 'External' })).toHaveCount(2);
});

test('labels a jigInput through its export and keeps a bound id', async ({ page }) => {
  await loadComponent(page, {
    template: `
      <label [jigFor]="name">Name</label>
      <input jigInput #name="jigInput" />
      <input jigInput [id]="'email'" />`,
    imports: ['jigFor', 'input'],
  });

  await expect(page.getByRole('textbox', { name: 'Name' })).toBeVisible();
  await expect(page.locator('input').nth(1)).toHaveAttribute('id', 'email');
});

test('puts the label first in aria-labelledby', async ({ page }) => {
  await loadComponent(page, {
    template: `
      <span id="unit">(percent)</span>
      <label [jigFor]="volume">Volume</label>
      <jig-slider #volume labelledBy="unit" style="width: 240px" />`,
    imports: ['jigFor', 'slider'],
  });

  await expect(page.getByRole('slider')).toHaveAccessibleName('Volume (percent)');
});

test('names an inline color-picker as a group', async ({ page }) => {
  await loadComponent(page, {
    template: `
      <label [jigFor]="brand">Brand color</label>
      <jig-color-picker #brand [inline]="true" />`,
    imports: ['jigFor', 'color-picker'],
  });

  await expect(page.getByRole('group', { name: 'Brand color' })).toBeVisible();
});
