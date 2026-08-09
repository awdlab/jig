import test, { expect } from '@playwright/test';
import { loadComponent } from '../helper/load-component';
import { JigItemViewHarness } from '@awdlab/jig-playwright';
import { expectScreenshot } from '../helper/screenshot';
import { expectNoA11yViolations } from '../helper/axe';

test('base', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<jig-item-view
        [items]="inputs().items"
        [idField]="'id'"
        style="width: {{inputs().width}}; outline: 1px solid red;"
      >
        <ng-template #item let-item>
          <span style="padding: 8px; background: {{item.color}}">{{item.label}}</span>
        </ng-template>
      </jig-item-view>`,
      imports: ['itemView'],
    },
    {
      inputs: {
        items: [
          { id: 1, label: 'Item 1', color: 'red' },
          { id: 2, label: 'Item 2', color: 'green' },
          { id: 3, label: 'Item 3', color: 'blue' },
        ],
        width: '220px',
      },
    }
  );

  const itemView = new JigItemViewHarness(page.locator('jig-item-view'));

  await itemView.expectItemCount(3);
  await itemView.expectItemTexts(['Item 1', 'Item 2', 'Item 3']);
  await itemView.expectItemVisibleCount(3);
  await itemView.expectItemVisibleTexts(['Item 1', 'Item 2', 'Item 3']);
  await itemView.expectItemOverflowingCount(0);

  // The widths are chosen around the rendered item width (~57px at the theme's control
  // font size), so each step below crosses one overflow threshold. The outline marks the
  // constraining box in the screenshot.
  handle.setInputs({
    items: [
      { id: 1, label: 'Item 1', color: 'red' },
      { id: 2, label: 'Item 2', color: 'green' },
      { id: 3, label: 'Item 3', color: 'blue' },
      { id: 4, label: 'Item 4', color: 'yellow' },
    ],
    width: '180px',
  });

  await itemView.expectItemCount(4);
  await itemView.expectItemTexts(['Item 1', 'Item 2', 'Item 3', 'Item 4']);
  await itemView.expectItemVisibleCount(2);
  await itemView.expectItemVisibleTexts(['Item 1', 'Item 2']);
  await itemView.expectItemOverflowingCount(2);
  await expect(itemView.overflowItem).toHaveCount(1);

  handle.setInputs({
    width: '300px',
  });

  await itemView.expectItemVisibleCount(4);
  await itemView.expectItemVisibleTexts(['Item 1', 'Item 2', 'Item 3', 'Item 4']);
  await itemView.expectItemOverflowingCount(0);

  handle.setInputs({
    width: '225px',
  });

  await itemView.expectItemVisibleCount(3);
  await itemView.expectItemVisibleTexts(['Item 1', 'Item 2', 'Item 3']);
  await itemView.expectItemOverflowingCount(1);
  await expect(itemView.overflowItem).toHaveCount(1);

  await expectScreenshot(page, testInfo);
});

test('accessibility (axe)', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `<jig-item-view [items]="inputs().items" [idField]="'id'" style="width: 200px;">
        <ng-template #item let-item>
          <span>{{ item.label }}</span>
        </ng-template>
      </jig-item-view>`,
      imports: ['itemView'],
    },
    {
      inputs: {
        items: [
          { id: 1, label: 'Item 1' },
          { id: 2, label: 'Item 2' },
          { id: 3, label: 'Item 3' },
        ],
      },
    }
  );

  await expectNoA11yViolations(page);
});
