import { JigPopoverHarness } from '@awdlab/jig-playwright';
import test, { expect } from '@playwright/test';
import { loadComponent } from '../helper/load-component';
import { useRtl } from '../helper/direction';
import { expectScreenshot } from '../helper/screenshot';
import { expectNoA11yViolations } from '../helper/axe';

test('base', async ({ page }, testInfo) => {
  const handle = await loadComponent(page, {
    template: `
      <button #anchor (click)="popover.show()">Open</button>
      <jig-popover #popover [anchor]="anchor"> Content </jig-popover>
    `,
    imports: ['popover'],
  });

  const popover = new JigPopoverHarness(page.locator('jig-popover').first());
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
      <jig-popover #popover [anchor]="anchor" [options]="{ cache: true }">
        <ng-template #lazy>
          <dummy>
            Content
          </dummy>
        </ng-template>
      </jig-popover>
    `,
    imports: ['popover', 'dummy_component'],
  });
  const popover = new JigPopoverHarness(page.locator('jig-popover').first());
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
        <jig-popover #popover [anchor]="anchor"> Content </jig-popover>
      }
    `,
    imports: ['popover'],
  });
  await handle.setInputs({ visible: true });

  const popover = new JigPopoverHarness(page.locator('jig-popover').first());
  await popover.expectRendered();

  // Keep a reference (as consumers driving show()/hide() imperatively do), then drop the popover.
  await page.evaluate(() => {
    const el = document.querySelector('jig-popover')!;
    (window as any).__popover = (window as any).ng.getComponent(el);
    (window as any).__popover.show();
  });
  await handle.setInputs({ visible: false });
  await expect(page.locator('jig-popover')).toHaveCount(0);

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

test('a popover left visible outside the top layer does not reflow its anchor', async ({
  page,
}) => {
  await loadComponent(page, {
    template: `
      <div>
        <button #anchor (click)="popover.show()">Open</button>
        <jig-popover #popover [anchor]="anchor">
          <div style="width: 200px; height: 300px">Content</div>
        </jig-popover>
      </div>
      <div id="after" style="height: 20px"></div>
    `,
    imports: ['popover'],
  });

  const popover = new JigPopoverHarness(page.locator('jig-popover').first());
  await page.locator('button').first().click();
  await popover.expectOpened();

  const after = page.locator('#after');
  const before = (await after.boundingBox())!.y;

  // Safari drops a closing popover out of the top layer while it is still displayed. Force that
  // state: in flow the 300px content would push everything below it down.
  await page
    .locator('jig-popover > div')
    .first()
    .evaluate((el: HTMLElement) => {
      el.hidePopover();
      el.style.display = 'flex';
    });

  expect((await after.boundingBox())!.y).toBe(before);
});

test('accessibility (axe)', async ({ page }) => {
  await loadComponent(page, {
    template: `
      <button #anchor (click)="popover.show()">Open</button>
      <jig-popover #popover [anchor]="anchor"> Content </jig-popover>
    `,
    imports: ['popover'],
  });

  const popover = new JigPopoverHarness(page.locator('jig-popover').first());

  // Open so the scan covers the opened overlay content.
  await page.locator('button').first().click();
  await popover.expectOpened();

  await expectNoA11yViolations(page);
});

test('rtl', async ({ page }, testInfo) => {
  await useRtl(page);
  await loadComponent(page, {
    template: `
      <button #anchor (click)="popover.show()">Open</button>
      <jig-popover #popover [anchor]="anchor"> Content </jig-popover>
    `,
    imports: ['popover'],
  });
  await page.getByText('Open').click();
  await expect(page.locator('jig-popover')).toBeVisible();
  await expectScreenshot(page, testInfo);
});
