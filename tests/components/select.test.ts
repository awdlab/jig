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
  await select.clickItemByText(exampleData.items.flatPreformatted[0].label);
  await expectScreenshot(page, testInfo, 'selected');

  await select.open();
  await select.clickItemByText(exampleData.items.flatPreformatted[15].label);
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
  await select.clickItemByText(exampleData.items.flatPreformatted[0].label);
  await expectScreenshot(page, testInfo, 'selected');

  await select.open();
  await expect(
    scroller.getItemByText(exampleData.items.flatPreformatted[15].label)
  ).not.toBeVisible();
  await scroller.scrollToIndex(15, 34);
  await expect(
    scroller.getItemByText(exampleData.items.flatPreformatted[15].label)
  ).toBeInViewport();
  await select.clickItemByText(exampleData.items.flatPreformatted[15].label);
  await select.open();
  await expect(scroller.getItemByText(exampleData.items.flatPreformatted[15].label)).toBeInViewport(
    { ratio: 1 }
  );
  await expectScreenshot(page, testInfo, 'auto-scrolled');
});

test('grouped', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `
      <ngn-select
        style="width: 200px;"
        [options]="inputs().options"
        [popoverOptions]="inputs().popoverOptions" />
    `,
      imports: ['select'],
    },
    {
      inputs: {
        options: exampleData.items.groupedPreformatted,
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
  await scroller.expectStickyItemsCount(exampleData.items.groupedPreformatted.length);
  await expectScreenshot(page, testInfo, 'opened');
  await select.clickItemByText(exampleData.items.flatPreformatted[0].label);
  await select.expectSelectedItemText(exampleData.items.flatPreformatted[0].label);
});

test('templates', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `
      <ngn-select
      style="width: 200px;"
      [options]="inputs().options"
      [popoverOptions]="inputs().popoverOptions">
        <ng-template #item let-item>
          👀{{ item?.label }}
        </ng-template>
        <ng-template #selectedItem let-item>
          ✅{{ item?.label }}
        </ng-template>
        <ng-template #group let-item>
          ⭐{{ item?.label }}
        </ng-template>
      </ngn-select>
    `,
      imports: ['select'],
    },
    {
      inputs: {
        options: exampleData.items.groupedPreformatted,
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
  await scroller.expectStickyItemsCount(exampleData.items.groupedPreformatted.length);
  await expectScreenshot(page, testInfo, 'opened');
  await select.clickItemByText('👀' + exampleData.items.flatPreformatted[0].label);
  await select.expectSelectedItemText('✅' + exampleData.items.flatPreformatted[0].label);
});

test('fields', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `
      <ngn-select
        style="width: 200px;"
        [options]="inputs().options"
        [popoverOptions]="inputs().popoverOptions"
        [fields]="inputs().fields"
      />
    `,
      imports: ['select'],
    },
    {
      inputs: {
        options: exampleData.items.grouped,
        popoverOptions: <PopoverOptions>{ sizeConstraints: { maxHeight: '300px' } },
        fields: {
          label: 'label',
          value: 'id',
          groupItems: 'items',
        },
      },
    }
  );

  const select = new NgnSelectHarness(page.locator('ngn-select').first());

  await select.expectOpened(false);
  await select.open();
  const listBox = select.listBox;
  const scroller = listBox.scroller;

  await scroller.expectItemsCount(exampleData.items.flatPreformatted.length);
  await scroller.expectStickyItemsCount(exampleData.items.groupedPreformatted.length);
  await expectScreenshot(page, testInfo, 'opened');
  await select.clickItemByText(exampleData.items.flatPreformatted[0].label);
  await select.expectSelectedItemText(exampleData.items.flatPreformatted[0].label);
});

test('filter', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `
      <ngn-select
        style="width: 200px;"
        [options]="inputs().options"
        [popoverOptions]="inputs().popoverOptions"
        [filter]="inputs().filter"
      />
    `,
      imports: ['select'],
    },
    {
      inputs: {
        options: exampleData.items.groupedPreformatted,
        popoverOptions: <PopoverOptions>{ sizeConstraints: { maxHeight: '300px' } },
        filter: true,
      },
    }
  );

  const select = new NgnSelectHarness(page.locator('ngn-select').first());

  await select.expectOpened(false);
  await select.open();
  const listBox = select.listBox;
  const scroller = listBox.scroller;

  await scroller.expectItemsCount(exampleData.items.flatPreformatted.length);
  await scroller.expectStickyItemsCount(exampleData.items.groupedPreformatted.length);

  await select.filter.children.input.fill('ger');
  await scroller.expectItemsTexts(['Nigeria', 'Algeria', 'Germany']);
  await scroller.expectStickyItemsTexts(['Africa', 'Europe']);
  await expectScreenshot(page, testInfo, 'filtered');

  await select.filter.children.input.fill('Ocea');
  await scroller.expectItemsTexts([
    'Australia',
    'New Zealand',
    'Fiji',
    'Papua New Guinea',
    'Solomon Islands',
  ]);
  await scroller.expectStickyItemsTexts(['Oceania']);
});

test('editable', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `
      <ngn-select
        style="width: 200px;"
        [options]="inputs().options"
        [popoverOptions]="inputs().popoverOptions"
        [editable]="true"
        (valueChange)="output('value', $event)"
      />
    `,
      imports: ['select'],
    },
    {
      inputs: {
        options: exampleData.items.groupedPreformatted,
        popoverOptions: <PopoverOptions>{ sizeConstraints: { maxHeight: '300px' } },
        fields: {
          label: 'label',
          value: 'id',
          groupItems: 'items',
        },
      },
    }
  );

  const select = new NgnSelectHarness(page.locator('ngn-select').first());

  await select.expectOpened(false);
  await select.open();
  const listBox = select.listBox;
  const scroller = listBox.scroller;

  await scroller.expectItemsCount(exampleData.items.flatPreformatted.length);
  await scroller.expectStickyItemsCount(exampleData.items.groupedPreformatted.length);

  await select.inputEditable.fill('ger');

  expect(await handle.getOutputLog()).toEqual({ value: ['ger'] });

  await scroller.expectItemsTexts(['Nigeria', 'Algeria', 'Germany']);
  await scroller.expectStickyItemsTexts(['Africa', 'Europe']);
  await expectScreenshot(page, testInfo, 'filtered');

  await select.clickItemByText('Germany');

  expect(await handle.getOutputLog()).toEqual({ value: ['ger', 'Germany'] });
});

test('multiple', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `
      <ngn-select
        style="width: 200px;"
        [multiple]="true"
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
  await scroller.expectItemsCount(exampleData.items.flatPreformatted.length);
  await expectScreenshot(page, testInfo, 'opened');
  await select.clickItemByText(exampleData.items.flatPreformatted[0].label, false);
  await select.expectSelectedItemText(exampleData.items.flatPreformatted[0].label);

  await expectScreenshot(page, testInfo, 'selected-1');
  await select.clickItemByText(exampleData.items.flatPreformatted[1].label, false);
  await select.clickItemByText(exampleData.items.flatPreformatted[2].label, false);
  await select.clickItemByText(exampleData.items.flatPreformatted[3].label, false);
  await select.clickItemByText(exampleData.items.flatPreformatted[4].label, false);
  await select.multipleItemView.expectItemVisibleCount(2);
  await select.multipleItemView.expectItemOverflowingCount(3);
  await select.multipleItemView.expectItemVisibleTexts([
    exampleData.items.flatPreformatted[0].label + ', ',
    exampleData.items.flatPreformatted[1].label + ', ',
  ]);

  await expectScreenshot(page, testInfo, 'selected-4');
  await select.clickItemByText(exampleData.items.flatPreformatted[5].label, false);
  await select.clickItemByText(exampleData.items.flatPreformatted[6].label, false);
  await select.clickItemByText(exampleData.items.flatPreformatted[7].label, false);
  await select.clickItemByText(exampleData.items.flatPreformatted[8].label, false);
  await select.multipleItemView.expectItemVisibleCount(2);
  await select.multipleItemView.expectItemOverflowingCount(7);
  await select.multipleItemView.expectItemVisibleTexts([
    exampleData.items.flatPreformatted[0].label + ', ',
    exampleData.items.flatPreformatted[1].label + ', ',
  ]);

  await select.close();
  await expectScreenshot(page, testInfo, 'closed');
});

test('invalid', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `
      <ngn-select style="width: 200px;" [invalid]="inputs().invalid" [options]="inputs().options" [popoverOptions]="inputs().popoverOptions" />
    `,
      imports: ['select'],
    },
    {
      inputs: {
        options: exampleData.items.flatPreformatted,
        popoverOptions: <PopoverOptions>{ sizeConstraints: { maxHeight: '300px' } },
        invalid: true,
      },
    }
  );

  const select = new NgnSelectHarness(page.locator('ngn-select').first());

  await select.expectOpened(false);
  await expectScreenshot(page, testInfo, 'invalid');
  await select.open();
  await expectScreenshot(page, testInfo, 'invalid-open');
  await select.clickItemByText(exampleData.items.flatPreformatted[0].label);
  await select.expectOpened(false);
  await expectScreenshot(page, testInfo, 'invalid-selected');
  await handle.setInputs({
    invalid: false,
  });
  await expectScreenshot(page, testInfo, 'valid');
});
