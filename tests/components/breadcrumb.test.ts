import test, { Page } from '@playwright/test';
import { loadComponent } from '../helper/load-component';
import { InputsType } from 'apps/test-wrapper/src/app/window';
import { type NgnActionItem } from '@ngneers/controls/api';
import { NgnBreadcrumbHarness } from '@ngneers/controls-playwright';
import { expectScreenshot } from '../helper/screenshot';

const ITEMS: NgnActionItem[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => ({
  id: `item${i}`,
  label: `Item ${i}`,
}));

async function prepareTest(page: Page, inputs: InputsType = {}) {
  const handle = await loadComponent(
    page,
    {
      template: `
        <ngn-breadcrumb style="width: 400px;" [items]="inputs().items" />
      `,
      imports: ['breadcrumb'],
    },
    {
      inputs: {
        items: ITEMS,
        ...inputs,
      },
    }
  );
  return handle;
}

test('base', async ({ page }, testInfo) => {
  const handle = await prepareTest(page);

  const breadcrumb = new NgnBreadcrumbHarness(page.locator('ngn-breadcrumb'));
  await breadcrumb.itemView.expectItemCount(11); // 10 + 1 overflow item
  await breadcrumb.itemView.expectItemVisibleCount(5); // 4 + 1 overflow item

  await breadcrumb.itemView.overflowItem.locator(breadcrumb.classes['overflow']).click();
  await breadcrumb.overflowMenu.expectItemCount(6);

  await expectScreenshot(page, testInfo, 'overflow-open');
});
