import test from '@playwright/test';
import { NgnEditInplaceHarness } from '@ngneers/controls-playwright';
import { loadComponent } from '../helper/load-component';
import { expectScreenshot } from '../helper/screenshot';

test('base', async ({ page }, testInfo) => {
  const handle = await loadComponent(page, {
    template: `
      <ngn-edit-inplace [value]="inputs().value" (valueChange)="output('valueChange', $event)" />
    `,
    imports: ['editInplace'],
  });

  const editInplace = new NgnEditInplaceHarness(page.locator('ngn-edit-inplace'));

  await test.step('initial display', async () => {
    await handle.setInputs({ value: 'Initial value' });
    await editInplace.inplace.expectDisplayVisible(true);
    await editInplace.inplace.expectContentVisible(false);
    await expectScreenshot(page, testInfo, 'display');
  });

  await test.step('click to edit', async () => {
    await editInplace.inplace.clickDisplay();
    await editInplace.inplace.expectDisplayVisible(false);
    await editInplace.inplace.expectContentVisible(true);
    await editInplace.expectInputValue('Initial value');
    await expectScreenshot(page, testInfo, 'edit');
  });

  await test.step('change value and close with button', async () => {
    await editInplace.fillInput('Updated value');
    await editInplace.expectInputValue('Updated value');
    await editInplace.clickCloseButton();
    await editInplace.inplace.expectDisplayVisible(true);
    await editInplace.inplace.expectContentVisible(false);
    await expectScreenshot(page, testInfo, 'updated');
  });
});

test('close with enter key', async ({ page }, testInfo) => {
  const handle = await loadComponent(page, {
    template: `
      <ngn-edit-inplace [value]="inputs().value" (valueChange)="output('valueChange', $event)" />
    `,
    imports: ['editInplace'],
  });

  const editInplace = new NgnEditInplaceHarness(page.locator('ngn-edit-inplace'));

  await handle.setInputs({ value: 'Test value' });
  await editInplace.inplace.clickDisplay();
  await editInplace.inplace.expectContentVisible(true);

  await editInplace.fillInput('New value');
  await editInplace.pressEnter();
  await editInplace.inplace.expectDisplayVisible(true);
  await editInplace.inplace.expectContentVisible(false);
});

test('custom templates', async ({ page }, testInfo) => {
  const handle = await loadComponent(page, {
    template: `
      <ngn-edit-inplace [value]="inputs().value" (valueChange)="output('valueChange', $event)">
        <ng-template #display let-display>
          <div class="custom-display">
            <strong>Value:</strong> {{ display.value }}
          </div>
        </ng-template>
        <ng-template #edit let-edit>
          <div class="custom-edit">
            <input type="text" [value]="edit.value" (input)="edit.update($any($event.target).value)" />
            <button (click)="edit.close()">Save</button>
          </div>
        </ng-template>
      </ngn-edit-inplace>
    `,
    imports: ['editInplace'],
  });

  const editInplace = new NgnEditInplaceHarness(page.locator('ngn-edit-inplace'));
  const customDisplay = page.locator('.custom-display');
  const customEdit = page.locator('.custom-edit');

  await handle.setInputs({ value: 'Custom value' });

  await test.step('custom display template', async () => {
    await customDisplay.waitFor({ state: 'visible' });
    await expectScreenshot(page, testInfo, 'custom-display');
  });

  await test.step('custom edit template', async () => {
    await editInplace.inplace.clickDisplay();
    await customEdit.waitFor({ state: 'visible' });
    await expectScreenshot(page, testInfo, 'custom-edit');

    const input = customEdit.locator('input');
    await input.fill('Modified value');

    const saveButton = customEdit.locator('button');
    await saveButton.click();
    await customDisplay.waitFor({ state: 'visible' });
  });
});

test('lazy loading', async ({ page }, testInfo) => {
  const handle = await loadComponent(page, {
    template: `
      <ngn-edit-inplace 
        [value]="inputs().value" 
        [lazy]="inputs().lazy" 
        [cache]="inputs().cache"
        (valueChange)="output('valueChange', $event)"
      />
    `,
    imports: ['editInplace'],
  });

  const editInplace = new NgnEditInplaceHarness(page.locator('ngn-edit-inplace'));

  await test.step('lazy=true (default)', async () => {
    await handle.setInputs({ value: 'Lazy value', lazy: true, cache: false });
    await editInplace.inplace.expectDisplayVisible(true);

    await editInplace.inplace.clickDisplay();
    await editInplace.inplace.expectContentVisible(true);

    await editInplace.clickCloseButton();
    await editInplace.inplace.expectDisplayVisible(true);
  });

  await test.step('lazy=true with cache=true', async () => {
    await handle.setInputs({ lazy: true, cache: true });
    await editInplace.inplace.clickDisplay();
    await editInplace.inplace.expectContentVisible(true);

    await editInplace.clickCloseButton();
    await editInplace.inplace.expectDisplayVisible(true);
  });

  await test.step('lazy=false', async () => {
    await handle.setInputs({ lazy: false, cache: false });
    await editInplace.inplace.expectDisplayVisible(true);
  });
});

test('model binding', async ({ page }, testInfo) => {
  const handle = await loadComponent(page, {
    template: `
      <ngn-edit-inplace 
        [value]="inputs().value" 
        [(editVisible)]="inputs().editVisible"
        (valueChange)="output('valueChange', $event)"
      />
    `,
    imports: ['editInplace'],
  });

  const editInplace = new NgnEditInplaceHarness(page.locator('ngn-edit-inplace'));

  await test.step('initially closed', async () => {
    await handle.setInputs({ value: 'Test', editVisible: false });
    await editInplace.inplace.expectDisplayVisible(true);
    await editInplace.inplace.expectContentVisible(false);
  });

  await test.step('programmatically opened', async () => {
    await handle.setInputs({ editVisible: true });
    await editInplace.inplace.expectDisplayVisible(false);
    await editInplace.inplace.expectContentVisible(true);
  });

  await test.step('programmatically closed', async () => {
    await handle.setInputs({ editVisible: false });
    await editInplace.inplace.expectDisplayVisible(true);
    await editInplace.inplace.expectContentVisible(false);
  });
});
