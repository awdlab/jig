import { NgnPopoverHarness } from '@ngneers/controls-playwright';
import test, { expect } from '@playwright/test';
import { loadComponent } from '../helper/load-component';
import { expectScreenshot } from '../helper/screenshot';
import { expectNoA11yViolations } from '../helper/axe';

test('base', async ({ page }, testInfo) => {
  const handle = await loadComponent(page, {
    template: `
      <button #anchor (click)="popover.show()">Open</button>
      <ngn-popover #popover [anchor]="anchor"> Content </ngn-popover>
    `,
    imports: ['popover'],
  });

  const popover = new NgnPopoverHarness(page.locator('ngn-popover').first());
  await popover.expectRendered();
  await expectScreenshot(page, testInfo, 'closed');

  const button = page.locator('button').first();
  await button.click();
  await popover.expectOpened();
  await expectScreenshot(page, testInfo, 'opened');
});

test('lazy', async ({ page }, testInfo) => {
  const handle = await loadComponent(page, {
    template: `
      <button #anchor (click)="popover.show()">Open</button>
      <ngn-popover #popover [anchor]="anchor" [options]="{ cache: true }">
        <ng-template #lazy>
          <dummy>
            Content
          </dummy>
        </ng-template>
      </ngn-popover>
    `,
    imports: ['popover', 'dummy_component'],
  });
  const popover = new NgnPopoverHarness(page.locator('ngn-popover').first());
  await popover.expectRendered(false);
  await expectScreenshot(page, testInfo, 'closed');

  const button = page.locator('button').first();
  await button.click();
  await popover.expectRendered(true);
  await popover.expectOpened();
  await expectScreenshot(page, testInfo, 'opened');
});

test('stale reference after removal', async ({ page }) => {
  const handle = await loadComponent(page, {
    template: `
      <button #anchor>Open</button>
      @if (inputs().visible) {
        <ngn-popover #popover [anchor]="anchor"> Content </ngn-popover>
      }
    `,
    imports: ['popover'],
  });
  await handle.setInputs({ visible: true });

  const popover = new NgnPopoverHarness(page.locator('ngn-popover').first());
  await popover.expectRendered();

  // Keep a reference (as consumers driving show()/hide() imperatively do), then drop the popover.
  await page.evaluate(() => {
    const el = document.querySelector('ngn-popover')!;
    (window as any).__popover = (window as any).ng.getComponent(el);
    (window as any).__popover.show();
  });
  await handle.setInputs({ visible: false });
  await expect(page.locator('ngn-popover')).toHaveCount(0);

  const error = await page.evaluate(() => {
    try {
      (window as any).__popover.hide();
      (window as any).__popover.show();
      (window as any).__popover.toggle();
      return null;
    } catch (err) {
      return String(err);
    }
  });
  expect(error).toBeNull();
});

test('accessibility (axe)', async ({ page }) => {
  await loadComponent(page, {
    template: `
      <button #anchor (click)="popover.show()">Open</button>
      <ngn-popover #popover [anchor]="anchor"> Content </ngn-popover>
    `,
    imports: ['popover'],
  });

  const popover = new NgnPopoverHarness(page.locator('ngn-popover').first());

  // Open so the scan covers the opened overlay content.
  await page.locator('button').first().click();
  await popover.expectOpened();

  await expectNoA11yViolations(page);
});
