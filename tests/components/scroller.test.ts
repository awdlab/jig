import { NgnScrollerHarness } from '@ngneers/controls-playwright';
import test, { expect } from '@playwright/test';
import { loadComponent } from '../helper/load-component';
import { expectScreenshot } from '../helper/screenshot';

test('regular scrolling with 50 elements', async ({ page }, testInfo) => {
  // Generate 50 items
  const items = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    label: `Item ${i + 1}`,
  }));

  const handle = await loadComponent(
    page,
    {
      template: `
        <ngn-scroller #scroller style="height: 300px; width: 300px;" [items]="inputs().items">
          <ng-template #item let-item>
            <div [ngnScrollerItem]="item" style="padding: 8px; border-bottom: 1px solid #ccc;">
              {{ item.label }}
            </div>
          </ng-template>
        </ngn-scroller>
      `,
      imports: ['scroller'],
    },
    {
      inputs: {
        items,
      },
    }
  );

  const scroller = new NgnScrollerHarness(page.locator('ngn-scroller'));

  // All items should be rendered
  await scroller.expectItemsCount(50);

  // Verify first few items
  const firstItems = await scroller.item.first().textContent();
  expect(firstItems).toContain('Item 1');

  // Scroll down and verify scrolling works
  await scroller.scrollarea.evaluate(el => {
    el.scrollTop = 500;
  });

  await page.waitForTimeout(100);

  // Take screenshot
  await expectScreenshot(page, testInfo);
});

test('virtual scrolling with 5000 elements', async ({ page }, testInfo) => {
  // Generate 5000 items for virtual scrolling
  const items = Array.from({ length: 5000 }, (_, i) => ({
    id: i,
    label: `Item ${i + 1}`,
  }));

  const itemHeight = 40;

  const handle = await loadComponent(
    page,
    {
      template: `
        <ngn-scroller 
          #scroller 
          style="height: 400px; width: 300px;" 
          [items]="inputs().items"
          [virtual]="true"
          [itemHeight]="inputs().itemHeight">
          <ng-template #item let-item>
            <div [ngnScrollerItem]="item" style="height: 40px; padding: 8px; border-bottom: 1px solid #ccc; box-sizing: border-box;">
              {{ item.label }}
            </div>
          </ng-template>
        </ngn-scroller>
      `,
      imports: ['scroller'],
    },
    {
      inputs: {
        items,
        itemHeight,
      },
    }
  );

  const scroller = new NgnScrollerHarness(page.locator('ngn-scroller'));

  // Only visible items should be rendered (not all 5000)
  // With 400px height and 40px item height, we should see ~10 items + padding
  await scroller.expectItemsCountBetween(10, 20);

  // Verify first visible item
  const firstItemText = await scroller.item.first().textContent();
  expect(firstItemText).toContain('Item 1');

  // Scroll to middle
  await scroller.scrollarea.evaluate(el => {
    el.scrollTop = 100000; // Middle of 5000 * 40 = 200000px
  });

  await page.waitForTimeout(200);

  // Should still only render visible items
  await scroller.expectItemsCountBetween(10, 20);

  // Verify we're seeing items from the middle
  const middleItemText = await scroller.item.first().textContent();
  expect(parseInt(middleItemText!.match(/\d+/)![0])).toBeGreaterThan(2000);

  // Scroll to bottom
  await scroller.scrollarea.evaluate(el => {
    el.scrollTop = el.scrollHeight;
  });

  await page.waitForTimeout(200);

  // Verify last items are visible
  const lastItemText = await scroller.item.last().textContent();
  expect(lastItemText).toContain('Item 5000');

  // Take screenshot
  await expectScreenshot(page, testInfo);
});

test('regular scrolling with sticky items', async ({ page }, testInfo) => {
  // Generate items with groups (sticky headers)
  const items = [
    { id: 'group1', label: 'Group 1', items: true },
    { id: 'item1', label: 'Item 1-1', items: false },
    { id: 'item2', label: 'Item 1-2', items: false },
    { id: 'item3', label: 'Item 1-3', items: false },
    { id: 'group2', label: 'Group 2', items: true },
    { id: 'item4', label: 'Item 2-1', items: false },
    { id: 'item5', label: 'Item 2-2', items: false },
    { id: 'item6', label: 'Item 2-3', items: false },
    { id: 'group3', label: 'Group 3', items: true },
    { id: 'item7', label: 'Item 3-1', items: false },
    { id: 'item8', label: 'Item 3-2', items: false },
    { id: 'item9', label: 'Item 3-3', items: false },
  ];

  const handle = await loadComponent(
    page,
    {
      template: `
        <ngn-scroller 
          #scroller 
          style="height: 250px; width: 300px;" 
          [items]="inputs().items"
          [fieldSticky]="'items'">
          <ng-template #item let-item>
            <div [ngnScrollerItem]="item"
                 [style.padding]="item.items ? '12px 8px' : '8px 8px'"
                 [style.background]="item.items ? '#e0e0e0' : 'white'"
                 [style.font-weight]="item.items ? 'bold' : 'normal'"
                 [style.border-bottom]="'1px solid #ccc'">
              {{ item.label }}
            </div>
          </ng-template>
        </ngn-scroller>
      `,
      imports: ['scroller'],
    },
    {
      inputs: {
        items,
      },
    }
  );

  const scroller = new NgnScrollerHarness(page.locator('ngn-scroller'));

  // All non-sticky items should be rendered (regular scrolling)
  await scroller.expectItemsCount(9);

  // Sticky items should be present
  await scroller.expectStickyItemsCount(3);

  // Verify sticky items
  await scroller.expectStickyItemsTexts(['Group 1', 'Group 2', 'Group 3']);

  // Scroll down to test sticky behavior
  await scroller.scrollarea.evaluate(el => {
    el.scrollTop = 150;
  });

  await page.waitForTimeout(100);

  // Take screenshot showing sticky behavior
  await expectScreenshot(page, testInfo);
});

test('virtual scrolling with sticky items', async ({ page }, testInfo) => {
  // Generate many items with sticky group headers
  const items: Array<{ id: string; label: string; items: boolean }> = [];
  for (let g = 1; g <= 50; g++) {
    items.push({ id: `group${g}`, label: `Group ${g}`, items: true });
    for (let i = 1; i <= 20; i++) {
      items.push({ id: `item${g}-${i}`, label: `Item ${g}-${i}`, items: false });
    }
  }

  const itemHeight = 40;

  const handle = await loadComponent(
    page,
    {
      template: `
        <ngn-scroller 
          #scroller 
          style="height: 400px; width: 300px;" 
          [items]="inputs().items"
          [virtual]="true"
          [itemHeight]="inputs().itemHeight"
          [fieldSticky]="'items'">
          <ng-template #item let-item>
            <div [ngnScrollerItem]="item"
                 [style.height.px]="40"
                 [style.padding]="item.items ? '12px 8px' : '8px 8px'"
                 [style.background]="item.items ? '#e0e0e0' : 'white'"
                 [style.font-weight]="item.items ? 'bold' : 'normal'"
                 [style.border-bottom]="'1px solid #ccc'"
                 [style.box-sizing]="'border-box'">
              {{ item.label }}
            </div>
          </ng-template>
        </ngn-scroller>
      `,
      imports: ['scroller'],
    },
    {
      inputs: {
        items,
        itemHeight,
      },
    }
  );

  const scroller = new NgnScrollerHarness(page.locator('ngn-scroller'));

  // Only visible items should be rendered
  await scroller.expectItemsCountBetween(10, 20);

  // Initially, first group should be sticky
  const firstStickyText = await scroller.itemSticky.first().textContent();
  expect(firstStickyText).toContain('Group 1');

  // Scroll down
  await scroller.scrollarea.evaluate(el => {
    el.scrollTop = 5000;
  });

  await page.waitForTimeout(200);

  // Should still only render visible items
  await scroller.expectItemsCountBetween(10, 20);

  // Verify sticky header changed
  const stickyText = await scroller.itemSticky.first().textContent();
  expect(parseInt(stickyText!.match(/\d+/)![0])).toBeGreaterThan(1);

  // Take screenshot
  await expectScreenshot(page, testInfo);
});

test('fixed scrolling with scroll to index', async ({ page }, testInfo) => {
  const items = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    label: `Item ${i + 1}`,
  }));

  const handle = await loadComponent(
    page,
    {
      template: `
        <div>
          <input 
            #scrollInput 
            type="number" 
            style="margin-bottom: 8px;"
            (blur)="scrollerRef.scrollToIndex($any($event.target).valueAsNumber)" />
          <ngn-scroller 
            #scrollerRef 
            style="height: 300px; width: 300px;" 
            [items]="inputs().items">
            <ng-template #item let-item>
              <div [ngnScrollerItem]="item"style="padding: 8px; border-bottom: 1px solid #ccc;">
                {{ item.label }}
              </div>
            </ng-template>
          </ngn-scroller>
        </div>
      `,
      imports: ['scroller'],
    },
    {
      inputs: {
        items,
      },
    }
  );

  const scroller = new NgnScrollerHarness(page.locator('ngn-scroller'));
  const scrollInput = page.locator('input[type="number"]');

  // All items should be rendered
  await scroller.expectItemsCount(100);

  // Initially at top
  const scrollTop = await scroller.scrollarea.evaluate(el => el.scrollTop);
  expect(scrollTop).toBe(0);

  // Scroll to index 50 using the component method
  await scrollInput.fill('50');
  await scrollInput.blur();

  await page.waitForTimeout(100);

  // Verify item 50 is visible (0-based index)
  const item50 = scroller.getItemByText('Item 51');
  await expect(item50).toBeInViewport();

  // Scroll to index 90
  await scrollInput.fill('90');
  await scrollInput.blur();

  await page.waitForTimeout(100);

  // Verify item 90 is visible
  const item90 = scroller.getItemByText('Item 91');
  await expect(item90).toBeInViewport();

  // Take screenshot
  await expectScreenshot(page, testInfo);
});

test('virtual scrolling with scroll to index', async ({ page }, testInfo) => {
  const items = Array.from({ length: 5000 }, (_, i) => ({
    id: i,
    label: `Item ${i + 1}`,
  }));

  const itemHeight = 40;

  const handle = await loadComponent(
    page,
    {
      template: `
        <div>
          <input 
            #scrollInput 
            type="number" 
            style="margin-bottom: 8px;"
            (blur)="scrollerRef.scrollToIndex($any($event.target).valueAsNumber)" />
          <ngn-scroller 
            #scrollerRef 
            style="height: 400px; width: 300px;" 
            [items]="inputs().items"
            [virtual]="true"
            [itemHeight]="inputs().itemHeight">
            <ng-template #item let-item>
              <div [ngnScrollerItem]="item" style="height: 40px; padding: 8px; border-bottom: 1px solid #ccc; box-sizing: border-box;">
                {{ item.label }}
              </div>
            </ng-template>
          </ngn-scroller>
        </div>
      `,
      imports: ['scroller'],
    },
    {
      inputs: {
        items,
        itemHeight,
      },
    }
  );

  const scroller = new NgnScrollerHarness(page.locator('ngn-scroller'));
  const scrollInput = page.locator('input[type="number"]');

  // Only visible items should be rendered
  await scroller.expectItemsCountBetween(10, 20);

  // Scroll to index 2500 (middle) using the component method
  await scrollInput.fill('2500');
  await scrollInput.blur();

  await page.waitForTimeout(200);

  // Should still only render visible items
  await scroller.expectItemsCountBetween(10, 20);

  // Verify item 2500 is visible
  const item2500 = scroller.getItemByText('Item 2501');
  await expect(item2500).toBeInViewport();

  // Scroll to index 4990 (near end)
  await scrollInput.fill('4990');
  await scrollInput.blur();

  await page.waitForTimeout(200);

  // Verify item 4990 is visible
  const item4990 = scroller.getItemByText('Item 4991');
  await expect(item4990).toBeInViewport();

  // Take screenshot
  await expectScreenshot(page, testInfo);
});

test('virtual scrolling with padding of 5 and assertions', async ({ page }, testInfo) => {
  const items = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    label: `Item ${i + 1}`,
  }));

  const itemHeight = 40;
  const padding = 5;

  const handle = await loadComponent(
    page,
    {
      template: `
        <ngn-scroller
          #scroller 
          style="height: 400px; width: 300px;" 
          [items]="inputs().items"
          [virtual]="true"
          [itemHeight]="inputs().itemHeight"
          [padding]="inputs().padding">
          <ng-template #item let-item>
            <div [ngnScrollerItem]="item" style="height: 40px; padding: 8px; border-bottom: 1px solid #ccc; box-sizing: border-box;">
              {{ item.label }}
            </div>
          </ng-template>
        </ngn-scroller>
      `,
      imports: ['scroller'],
    },
    {
      inputs: {
        items,
        itemHeight,
        padding,
      },
    }
  );

  const scroller = new NgnScrollerHarness(page.locator('ngn-scroller'));

  // With 400px height, 40px item height = 10 visible items
  // With padding of 5, we should have 10 + (5 * 2) = 20 items rendered
  await scroller.expectItemsCountBetween(15, 25);

  // Verify first item
  const firstItemText = await scroller.item.first().textContent();
  expect(firstItemText).toContain('Item 1');

  // Scroll down to position where we can test padding
  await scroller.scrollarea.evaluate(el => {
    el.scrollTop = 2000; // Scroll to item ~50
  });

  await page.waitForTimeout(200);

  // Should still render items with padding
  await scroller.expectItemsCountBetween(15, 25);

  // The rendered items should include padding above and below visible area
  const renderedItemsCount = await scroller.item.count();
  // Expected: ~10 visible + 10 padding (5 above + 5 below)
  expect(renderedItemsCount).toBeGreaterThan(15);
  expect(renderedItemsCount).toBeLessThan(25);

  // Scroll to a specific position and verify items around it
  await scroller.scrollarea.evaluate(el => {
    el.scrollTop = 20000; // Item 500
  });

  await page.waitForTimeout(200);

  // Check that items include padding
  const items_rendered = await scroller.item.allTextContents();
  const itemNumbers = items_rendered.map(text => parseInt(text.match(/\d+/)![0]));

  // Should have items around position 500
  const minItem = Math.min(...itemNumbers);
  const maxItem = Math.max(...itemNumbers);

  // Verify padding: we should have items before and after the visible range
  expect(maxItem - minItem).toBeGreaterThan(10); // More than just visible items

  // Take screenshot
  await expectScreenshot(page, testInfo);
});
