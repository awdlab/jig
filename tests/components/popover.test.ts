import { NgnPopoverHarness } from '@ngneers/controls-playwright';
import test from '@playwright/test';
import { loadComponent } from '../load-component';

test('base', async ({ page }) => {
  const handle = await loadComponent(page, {
    template: `
      <button #anchor (click)="popover.open()">Open</button>
      <ngn-popover #popover [anchor]="anchor"> Content </ngn-popover>
    `,
    imports: ['popover'],
  });

  const popover = new NgnPopoverHarness(page.locator('ngn-popover').first());
  await popover.expectRendered();

  const button = page.locator('button').first();
  await button.click();
  await popover.expectOpened();
});

test('lazy', async ({ page }) => {
  const handle = await loadComponent(page, {
    template: `
      <button #anchor (click)="popover.open()">Open</button>
      <ngn-popover #popover [anchor]="anchor" [options]="{ cache: true }">
        <ng-template #lazy>
          <dummy></dummy>
        </ng-template>
      </ngn-popover>
    `,
    imports: ['popover', 'dummy_component'],
  });
  const popover = new NgnPopoverHarness(page.locator('ngn-popover').first());
  await popover.expectRendered(false);

  const button = page.locator('button').first();
  await button.click();
  await popover.expectRendered(true);
  await popover.expectOpened();
});
