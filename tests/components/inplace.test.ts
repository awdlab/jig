import test from '@playwright/test';
import { NgnInplaceHarness } from '@awdlab/jig-playwright';
import { loadComponent } from '../helper/load-component';
import { expectScreenshot } from '../helper/screenshot';
import { expectNoA11yViolations } from '../helper/axe';

test('base', async ({ page }, testInfo) => {
  const handle = await loadComponent(page, {
    template: `
      <awd-inplace>
        <ng-template #display>
          <span>Click to edit</span>
        </ng-template>
        <ng-template #content let-content>
          <div>
            <p>Content is visible</p>
            <button (click)="content.close()">Close</button>
          </div>
        </ng-template>
      </awd-inplace>
    `,
    imports: ['inplace'],
  });

  const inplace = new NgnInplaceHarness(page.locator('awd-inplace'));

  await inplace.expectDisplayVisible(true);
  await inplace.expectContentVisible(false);
  await expectScreenshot(page, testInfo, 'display');

  await inplace.clickDisplay();
  await inplace.expectDisplayVisible(false);
  await inplace.expectContentVisible(true);
  await expectScreenshot(page, testInfo, 'content');

  const closeButton = page.locator('button');
  await closeButton.click();
  await inplace.expectDisplayVisible(true);
  await inplace.expectContentVisible(false);
});

test('lazy loading', async ({ page }, testInfo) => {
  const handle = await loadComponent(page, {
    template: `
      <awd-inplace [lazy]="inputs().lazy" [cache]="inputs().cache">
        <ng-template #display>
          <span>Click to edit</span>
        </ng-template>
        <ng-template #content let-content>
          <dummy (calledConstructor)="output('constructorCalled', $event)">
            <p>Lazy content</p>
            <button (click)="content.close()">Close</button>
          </dummy>
        </ng-template>
      </awd-inplace>
    `,
    imports: ['inplace', 'dummy_component'],
  });

  const inplace = new NgnInplaceHarness(page.locator('awd-inplace'));

  await test.step('lazy=true (default)', async () => {
    await handle.setInputs({ lazy: true, cache: false });

    // Content should not be loaded initially
    await inplace.expectDisplayVisible(true);
    await inplace.expectContentVisible(false);

    await inplace.clickDisplay();
    await inplace.expectContentVisible(true);

    // Close and reopen to verify it loads again (no cache)
    const closeButton = page.locator('button');
    await closeButton.click();
    await inplace.expectContentVisible(false);
  });

  await test.step('lazy=true with cache=true', async () => {
    await handle.setInputs({ lazy: true, cache: true });
    await inplace.clickDisplay();
    await inplace.expectContentVisible(true);

    const closeButton = page.locator('button');
    await closeButton.click();
    await inplace.expectContentVisible(false);

    // Reopen - content should be cached
    await inplace.clickDisplay();
    await inplace.expectContentVisible(true);
  });

  await test.step('lazy=false', async () => {
    await handle.setInputs({ lazy: false, cache: false });
    const closeButton = page.locator('button');
    await closeButton.click();
    await inplace.expectDisplayVisible(true);
    // Content is not visible but should be rendered in DOM
  });
});

test('model binding', async ({ page }, testInfo) => {
  const handle = await loadComponent(page, {
    template: `
      <awd-inplace [(contentVisible)]="inputs().contentVisible">
        <ng-template #display>
          <span>Display view</span>
        </ng-template>
        <ng-template #content let-content>
          <div>
            <p>Content view</p>
            <button (click)="content.close()">Close</button>
          </div>
        </ng-template>
      </awd-inplace>
    `,
    imports: ['inplace'],
  });

  const inplace = new NgnInplaceHarness(page.locator('awd-inplace'));

  await test.step('initially closed', async () => {
    await handle.setInputs({ contentVisible: false });
    await inplace.expectDisplayVisible(true);
    await inplace.expectContentVisible(false);
  });

  await test.step('programmatically opened', async () => {
    await handle.setInputs({ contentVisible: true });
    await inplace.expectDisplayVisible(false);
    await inplace.expectContentVisible(true);
  });

  await test.step('programmatically closed', async () => {
    await handle.setInputs({ contentVisible: false });
    await inplace.expectDisplayVisible(true);
    await inplace.expectContentVisible(false);
  });
});

test('accessibility (axe)', async ({ page }) => {
  await loadComponent(page, {
    template: `
      <awd-inplace>
        <ng-template #display>
          <span>Click to edit</span>
        </ng-template>
        <ng-template #content let-content>
          <div>
            <p>Content is visible</p>
            <button (click)="content.close()">Close</button>
          </div>
        </ng-template>
      </awd-inplace>
    `,
    imports: ['inplace'],
  });

  const inplace = new NgnInplaceHarness(page.locator('awd-inplace'));

  // Scan the display (collapsed) surface first.
  await inplace.expectDisplayVisible(true);
  await expectNoA11yViolations(page);

  // Open and scan the expanded content surface.
  await inplace.clickDisplay();
  await inplace.expectContentVisible(true);
  await expectNoA11yViolations(page);
});
