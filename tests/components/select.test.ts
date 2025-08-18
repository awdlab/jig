import { NgnSelectHarness } from '@ngneers/controls-playwright';
import test, { expect } from '@playwright/test';
import { loadComponent } from '../helper/load-component';
import { expectScreenshot } from '../helper/screenshot';
import { exampleData } from '../helper/data';
import type { PopoverOptions } from '@ngneers/controls/popover';

test('base', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `
      <ngn-select style="width: 200px;" [options]="inputs().options" [popoverOptions]="inputs().popoverOptions" />
    `,
      imports: ['select'],
    },
    {
      inputs: {
        options: exampleData.items.flatPreformatted,
        popoverOptions: <PopoverOptions>{ sizeConstraints: { maxHeight: '300px' } },
      },
    }
  );

  const select = new NgnSelectHarness(page.locator('ngn-select').first());

  await select.expectOpened(false);
  await select.open();
  const listBox = select.listBox;
  const scroller = listBox.scroller;

  await scroller.expectItemsCount(exampleData.items.flatPreformatted.length);
  await scroller.expectItemsTexts(exampleData.items.flatPreformatted.map(item => item.label));
  await expectScreenshot(page, testInfo, 'opened');
  await scroller.clickItemByText(exampleData.items.flatPreformatted[0].label);
  await expectScreenshot(page, testInfo, 'selected');

  await select.open();
  await scroller.clickItemByText(exampleData.items.flatPreformatted[15].label);
  await select.open();
  await expect(scroller.getItemByText(exampleData.items.flatPreformatted[15].label)).toBeInViewport(
    { ratio: 1 }
  );
  await expectScreenshot(page, testInfo, 'auto-scrolled');
});

test('virtual', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `
      <ngn-select
        style="width: 200px;"
        [virtual]="true"
        [itemHeight]="34"
        [options]="inputs().options"
        [popoverOptions]="inputs().popoverOptions" />
    `,
      imports: ['select'],
    },
    {
      inputs: {
        options: exampleData.items.flatPreformatted,
        popoverOptions: <PopoverOptions>{ sizeConstraints: { maxHeight: '300px' } },
      },
    }
  );

  const select = new NgnSelectHarness(page.locator('ngn-select').first());

  await select.expectOpened(false);
  await select.open();
  const listBox = select.listBox;
  const scroller = listBox.scroller;

  await scroller.expectItemsCountBetween(12, 15);
  await expectScreenshot(page, testInfo, 'opened');
  await scroller.clickItemByText(exampleData.items.flatPreformatted[0].label);
  await expectScreenshot(page, testInfo, 'selected');

  await select.open();
  await expect(
    scroller.getItemByText(exampleData.items.flatPreformatted[15].label)
  ).not.toBeVisible();
  await scroller.scrollToIndex(15, 34);
  await expect(
    scroller.getItemByText(exampleData.items.flatPreformatted[15].label)
  ).toBeInViewport();
  await scroller.getItemByText(exampleData.items.flatPreformatted[15].label).click();
  await select.open();
  await expect(scroller.getItemByText(exampleData.items.flatPreformatted[15].label)).toBeInViewport(
    { ratio: 1 }
  );
  await expectScreenshot(page, testInfo, 'auto-scrolled');
});
