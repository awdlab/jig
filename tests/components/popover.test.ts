import { NgnPopoverHarness } from '@ngneers/controls-playwright';
import test from '@playwright/test';
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
