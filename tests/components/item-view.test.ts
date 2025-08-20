import test, { expect } from '@playwright/test';
import { loadComponent } from '../helper/load-component';
import { NgnItemViewHarness } from '@ngneers/controls-playwright';
import { expectScreenshot } from '../helper/screenshot';

test('base', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<ngn-item-view [items]="inputs().items" style="width: {{inputs().width}};">
        <ng-template #item let-item>
          <span style="padding: 8px; background: {{item.color}}">{{item.label}}</span>
        </ng-template>
      </ngn-item-view>`,
      imports: ['itemView'],
    },
    {
      inputs: {
        items: [
          { label: 'Item 1', color: 'red' },
          { label: 'Item 2', color: 'green' },
          { label: 'Item 3', color: 'blue' },
        ],
        width: '200px',
      },
    }
  );

  const itemView = new NgnItemViewHarness(page.locator('ngn-item-view'));

  await itemView.expectItemCount(3);
  await itemView.expectItemTexts(['Item 1', 'Item 2', 'Item 3']);
  await itemView.expectItemVisibleCount(3);
  await itemView.expectItemVisibleTexts(['Item 1', 'Item 2', 'Item 3']);
  await itemView.expectItemOverflowingCount(0);

  handle.setInputs({
    items: [
      { label: 'Item 1', color: 'red' },
      { label: 'Item 2', color: 'green' },
      { label: 'Item 3', color: 'blue' },
      { label: 'Item 4', color: 'yellow' },
    ],
  });

  await itemView.expectItemCount(4);
  await itemView.expectItemTexts(['Item 1', 'Item 2', 'Item 3', 'Item 4']);
  await itemView.expectItemVisibleCount(2);
  await itemView.expectItemVisibleTexts(['Item 1', 'Item 2']);
  await itemView.expectItemOverflowingCount(2);

  handle.setInputs({
    width: '300px',
  });

  await itemView.expectItemVisibleCount(4);
  await itemView.expectItemVisibleTexts(['Item 1', 'Item 2', 'Item 3', 'Item 4']);
  await itemView.expectItemOverflowingCount(0);

  handle.setInputs({
    width: '220px',
  });

  await itemView.expectItemVisibleCount(3);
  await itemView.expectItemVisibleTexts(['Item 1', 'Item 2', 'Item 3']);
  await itemView.expectItemOverflowingCount(1);

  await expectScreenshot(page, testInfo);
});
