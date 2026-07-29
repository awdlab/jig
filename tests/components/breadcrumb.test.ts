import test, { type Page } from '@playwright/test';
import { loadComponent } from '../helper/load-component';
import type { InputsType } from '../../apps/test-wrapper/src/app/window.js';
import type { NgnActionItem } from '@ngneers/controls/api';
import { NgnBreadcrumbHarness } from '@ngneers/controls-playwright';
import { expectScreenshot } from '../helper/screenshot';
import { expectNoA11yViolations } from '../helper/axe';

const ITEMS: NgnActionItem[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => ({
  id: `item${i}`,
  label: `Item ${i}`,
}));

async function prepareTest(page: Page, inputs: InputsType = {}) {
  const handle = await loadComponent(
    page,
    {
      template: `
        <ngn-breadcrumb
          style="width: 420px; outline: 1px solid red;"
          [items]="inputs().items"
        />
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
  await breadcrumb.itemView.expectItemCount(10);
  // 420px fits five of the ten crumbs at the theme's control font size; the rest move
  // into the overflow menu. Outline marks the constraining box in the screenshot.
  await breadcrumb.itemView.expectItemVisibleCount(5);

  await breadcrumb.itemView.overflowItem.locator(breadcrumb.classes['overflow']).click();
  await breadcrumb.overflowMenu.expectItemCount(5);

  await expectScreenshot(page, testInfo, 'overflow-open');
});

test('accessibility (axe)', async ({ page }) => {
  // Overflowing breadcrumb (constrained width, all 10 items): the visible
  // overflow toggle is a real focusable control and must not be trapped inside
  // an aria-hidden container. item-view only marks the offscreen measurement
  // copy aria-hidden, not the visible indicator.
  await prepareTest(page);
  await expectNoA11yViolations(page);
});
