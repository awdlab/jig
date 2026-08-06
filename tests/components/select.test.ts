import { NgnSelectHarness } from '@ngneers/controls-playwright';
import test, { expect } from '@playwright/test';

import { exampleData } from '../helper/data';
import { expectNoA11yViolations } from '../helper/axe';
import { loadComponent } from '../helper/load-component';
import { expectScreenshot } from '../helper/screenshot';

import type { NgnItem } from '@ngneers/controls/api';
import type { PopoverOptions } from '@ngneers/controls/popover';

test('editable: field padding belongs to the input', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `
      <ngn-input-field style="width: 300px;">
        <ngn-select [options]="inputs().options" [editable]="true" />
      </ngn-input-field>
    `,
      imports: ['select', 'inputField'],
    },
    { inputs: { options: ['Alpha', 'Bravo', 'Charlie'] } }
  );

  const input = page.locator('input').first();
  await input.evaluate((el: HTMLInputElement) => (el.value = 'Alpha'));
  const box = (await page.locator('ngn-input-field > div').first().boundingBox())!;
  const midY = box.y + box.height / 2;
  const caret = () => input.evaluate((el: HTMLInputElement) => el.selectionStart);

  // The input is nested two levels down (ngn-select > .select-input > input) and
  // still claims the field's padding; the dropdown icon keeps the trailing strip.
  await page.mouse.click(box.x + 3, midY);
  expect(await input.evaluate(el => document.activeElement === el)).toBe(true);
  expect(await caret()).toBe(0);

  await page.mouse.click(box.x + box.width - 60, midY);
  expect(await caret()).toBe(5);

  await page.mouse.click(box.x + box.width / 2, box.y + box.height - 2);
  expect(await caret()).toBe(5);
});

test('base', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `
      <ngn-input-field style="width: 200px;">
        <ngn-select [options]="inputs().options" [popoverOptions]="inputs().popoverOptions" />
      </ngn-input-field>
    `,
      imports: ['select', 'inputField'],
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
  await scroller.expectItemsTexts(
    exampleData.items.flatPreformatted.map(item => item.label) as string[]
  );
  await expectScreenshot(page, testInfo, 'opened');
  await select.clickItemByText(exampleData.items.flatPreformatted[0].label as string);
  await expectScreenshot(page, testInfo, 'selected');

  await select.open();
  await select.clickItemByText(exampleData.items.flatPreformatted[15].label as string);
  await select.open();
  await expect(
    scroller.getItemByText(exampleData.items.flatPreformatted[15].label as string)
  ).toBeInViewport({ ratio: 1 });
  await expectScreenshot(page, testInfo, 'auto-scrolled');
});

test('virtual', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `
      <ngn-input-field style="width: 200px;">
        <ngn-select
          [virtual]="true"
          [itemHeight]="34"
          [options]="inputs().options"
          [popoverOptions]="inputs().popoverOptions" />
      </ngn-input-field>
    `,
      imports: ['select', 'inputField'],
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
  await select.clickItemByText(exampleData.items.flatPreformatted[0].label as string);
  await expectScreenshot(page, testInfo, 'selected');

  await select.open();
  await expect(
    scroller.getItemByText(exampleData.items.flatPreformatted[15].label as string)
  ).not.toBeVisible();
  await scroller.scrollToIndex(15, 34);
  await expect(
    scroller.getItemByText(exampleData.items.flatPreformatted[15].label as string)
  ).toBeInViewport();
  await select.clickItemByText(exampleData.items.flatPreformatted[15].label as string);
  await select.open();
  await expect(
    scroller.getItemByText(exampleData.items.flatPreformatted[15].label as string)
  ).toBeInViewport({ ratio: 1 });
  await expectScreenshot(page, testInfo, 'auto-scrolled');
});

test('grouped', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `
      <ngn-input-field style="width: 200px;">
        <ngn-select
          [options]="inputs().options"
          [popoverOptions]="inputs().popoverOptions" />
      </ngn-input-field>
    `,
      imports: ['select', 'inputField'],
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
  await select.clickItemByText(exampleData.items.flatPreformatted[0].label as string);
  await select.expectSelectedItemText(exampleData.items.flatPreformatted[0].label as string);
});

test('templates', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `
      <ngn-input-field style="width: 200px;">
        <ngn-select
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
      </ngn-input-field>
    `,
      imports: ['select', 'inputField'],
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
  await select.clickItemByText(`👀${exampleData.items.flatPreformatted[0].label as string}`);
  await select.expectSelectedItemText(`✅${exampleData.items.flatPreformatted[0].label as string}`);
});

test('filter', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `
      <ngn-input-field style="width: 200px;">
        <ngn-select
          [options]="inputs().options"
          [popoverOptions]="inputs().popoverOptions"
          [filter]="inputs().filter"
        />
      </ngn-input-field>
    `,
      imports: ['select', 'inputField'],
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
      <ngn-input-field style="width: 200px;">
        <ngn-select
          [options]="inputs().options"
          [popoverOptions]="inputs().popoverOptions"
          [editable]="true"
          (valueChange)="output('value', $event)"
        />
      </ngn-input-field>
    `,
      imports: ['select', 'inputField'],
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
      <ngn-input-field style="width: 200px;">
        <ngn-select
          [multiple]="true"
          [options]="inputs().options"
          [popoverOptions]="inputs().popoverOptions" />
      </ngn-input-field>
    `,
      imports: ['select', 'inputField'],
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
  await select.clickItemByText(exampleData.items.flatPreformatted[0].label as string, false);
  await select.expectSelectedItemText(exampleData.items.flatPreformatted[0].label as string);

  await expectScreenshot(page, testInfo, 'selected-1');
  await select.clickItemByText(exampleData.items.flatPreformatted[1].label as string, false);
  await select.clickItemByText(exampleData.items.flatPreformatted[2].label as string, false);
  await select.clickItemByText(exampleData.items.flatPreformatted[3].label as string, false);
  await select.clickItemByText(exampleData.items.flatPreformatted[4].label as string, false);
  await select.multipleItemView.expectItemVisibleCount(2);
  await select.multipleItemView.expectItemOverflowingCount(3);
  await select.multipleItemView.expectItemVisibleTexts([
    `${exampleData.items.flatPreformatted[0].label}, `,
    `${exampleData.items.flatPreformatted[1].label}, `,
  ]);

  await expectScreenshot(page, testInfo, 'selected-4');
  await select.clickItemByText(exampleData.items.flatPreformatted[5].label as string, false);
  await select.clickItemByText(exampleData.items.flatPreformatted[6].label as string, false);
  await select.clickItemByText(exampleData.items.flatPreformatted[7].label as string, false);
  await select.clickItemByText(exampleData.items.flatPreformatted[8].label as string, false);
  await select.multipleItemView.expectItemVisibleCount(2);
  await select.multipleItemView.expectItemOverflowingCount(7);
  await select.multipleItemView.expectItemVisibleTexts([
    `${exampleData.items.flatPreformatted[0].label}, `,
    `${exampleData.items.flatPreformatted[1].label}, `,
  ]);

  await select.close();
  await expectScreenshot(page, testInfo, 'closed');
});

test('invalid', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `
      <ngn-input-field style="width: 200px;">
        <ngn-select [invalid]="inputs().invalid" [touched]="inputs().touched" [options]="inputs().options" [popoverOptions]="inputs().popoverOptions" />
      </ngn-input-field>
    `,
      imports: ['select', 'inputField'],
    },
    {
      inputs: {
        options: exampleData.items.flatPreformatted,
        popoverOptions: <PopoverOptions>{ sizeConstraints: { maxHeight: '300px' } },
        invalid: true,
        touched: true,
      },
    }
  );

  const select = new NgnSelectHarness(page.locator('ngn-select').first());

  await select.expectOpened(false);
  await expectScreenshot(page, testInfo, 'invalid');
  await select.open();
  await expectScreenshot(page, testInfo, 'invalid-open');
  await select.clickItemByText(exampleData.items.flatPreformatted[0].label as string);
  await select.expectOpened(false);
  await expectScreenshot(page, testInfo, 'invalid-selected');
  await handle.setInputs({
    invalid: false,
  });
  await expectScreenshot(page, testInfo, 'valid');
});

test.describe('keyboard navigation', () => {
  function setupKeyboard(page: import('@playwright/test').Page) {
    return loadComponent(
      page,
      {
        template: `
        <ngn-input-field style="width: 200px;">
          <ngn-select
            [options]="inputs().options"
            [popoverOptions]="inputs().popoverOptions"
            (valueChange)="output('value', $event)"
          />
        </ngn-input-field>
      `,
        imports: ['select', 'inputField'],
      },
      {
        inputs: {
          options: exampleData.items.flatPreformatted,
          popoverOptions: <PopoverOptions>{ sizeConstraints: { maxHeight: '300px' } },
        },
      }
    );
  }

  test('Enter opens and closes popover', async ({ page }) => {
    await setupKeyboard(page);
    const select = new NgnSelectHarness(page.locator('ngn-select').first());

    await select.input.focus();
    await select.expectOpened(false);

    await page.keyboard.press('Enter');
    await select.expectOpened(true);

    await page.keyboard.press('Escape');
    await select.expectOpened(false);
  });

  test('arrow keys do not change value when popover is closed', async ({ page }) => {
    await setupKeyboard(page);
    const select = new NgnSelectHarness(page.locator('ngn-select').first());

    await select.input.focus();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowUp');

    await select.expectOpened(false);
    await expect(select.input).toHaveText(/^[\s​]*$/);
  });

  test('arrow keys navigate and Enter selects when popover is open', async ({ page }) => {
    const handle = await setupKeyboard(page);
    const select = new NgnSelectHarness(page.locator('ngn-select').first());

    await select.input.focus();
    await page.keyboard.press('Enter');
    await select.expectOpened(true);

    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    await select.expectOpened(false);
    await select.expectSelectedItemText('Nigeria');
    expect(await handle.getOutputLog()).toEqual({ value: ['ng'] });
  });

  test('Enter re-opens popover after selecting an item', async ({ page }) => {
    await setupKeyboard(page);
    const select = new NgnSelectHarness(page.locator('ngn-select').first());

    await select.input.focus();
    await page.keyboard.press('Enter');
    await select.expectOpened(true);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await select.expectOpened(false);

    await page.keyboard.press('Enter');
    await select.expectOpened(true);
  });

  test('arrow keys do not change value when popover is closed after prior selection', async ({
    page,
  }) => {
    await setupKeyboard(page);
    const select = new NgnSelectHarness(page.locator('ngn-select').first());

    await select.input.focus();
    await page.keyboard.press('Enter');
    await select.expectOpened(true);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await select.expectSelectedItemText('Nigeria');

    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await select.expectSelectedItemText('Nigeria');
  });
});

test.describe('disabled items', () => {
  const disabledOptions: NgnItem<unknown, string>[] = [
    { label: 'Alpha', value: 'a' },
    { label: 'Bravo', value: 'b', disabled: true },
    { label: 'Charlie', value: 'c' },
    { label: 'Delta', value: 'd', disabled: true },
    { label: 'Echo', value: 'e' },
  ];

  function setupDisabled(page: import('@playwright/test').Page) {
    return loadComponent(
      page,
      {
        template: `
        <ngn-input-field style="width: 200px;">
          <ngn-select
            [options]="inputs().options"
            [popoverOptions]="inputs().popoverOptions"
            (valueChange)="output('value', $event)"
          />
        </ngn-input-field>
      `,
        imports: ['select', 'inputField'],
      },
      {
        inputs: {
          options: disabledOptions,
          popoverOptions: <PopoverOptions>{ sizeConstraints: { maxHeight: '300px' } },
        },
      }
    );
  }

  test('keyboard navigation skips disabled items', async ({ page }) => {
    const handle = await setupDisabled(page);
    const select = new NgnSelectHarness(page.locator('ngn-select').first());

    await select.input.focus();
    await page.keyboard.press('Enter');
    await select.expectOpened(true);

    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await select.expectSelectedItemText('Alpha');

    await select.input.focus();
    await page.keyboard.press('Enter');
    await select.expectOpened(true);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await select.expectSelectedItemText('Charlie');
    expect(await handle.getOutputLog()).toEqual({ value: ['a', 'c'] });
  });

  test('clicking disabled item does not select it', async ({ page }) => {
    await setupDisabled(page);
    const select = new NgnSelectHarness(page.locator('ngn-select').first());

    await select.open();
    const disabledItem = select.listBox.scroller.getItemByText('Bravo');
    await expect(disabledItem).toHaveAttribute('aria-disabled', 'true');
    await disabledItem.click({ force: true });
    await select.expectOpened(true);
    await expect(select.input).toHaveText(/^[\s​]*$/);
  });
});

// A select whose trigger is taken out of the tab order (tabindex="-1", as an editable
// select does internally) still has to open from a click on the wrapping field, so the
// field can't rely on a focusable trigger to delegate to.
test('opens from the wrapping field padding with tabindex -1', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `
      <ngn-input-field style="width: 200px;">
        <ngn-select [tabindex]="-1" [options]="inputs().options" />
      </ngn-input-field>
    `,
      imports: ['select', 'inputField'],
    },
    {
      inputs: {
        options: exampleData.items.flatPreformatted,
      },
    }
  );

  const select = new NgnSelectHarness(page.locator('ngn-select').first());
  const field = page.locator('ngn-input-field > div').first();

  await expect(field).toHaveCSS('cursor', 'pointer');
  await select.expectOpened(false);

  const box = (await field.boundingBox())!;
  await page.mouse.click(box.x + 3, box.y + box.height / 2);
  await select.expectOpened(true);
  // Focus must land on the select's own field, so keyboard navigation continues from the click.
  expect(await page.evaluate(() => document.activeElement?.closest('ngn-select') !== null)).toBe(
    true
  );
});

// TODO(a11y): the open dropdown uses a virtualized ngn-list-box, so the scroller
// wrapper sits between role="listbox" and its options (aria-required-children) and
// the scroll region isn't keyboard-focusable (scrollable-region-focusable). Needs
// the same ARIA + virtual-scroll design pass as list-box/tree. Tracked.
test.fixme('accessibility (axe)', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `
      <ngn-input-field style="width: 200px;">
        <label id="select-a11y-label">Country</label>
        <ngn-select
          [labelledBy]="'select-a11y-label'"
          [options]="inputs().options"
          [popoverOptions]="inputs().popoverOptions" />
      </ngn-input-field>
    `,
      imports: ['select', 'inputField'],
    },
    {
      inputs: {
        options: exampleData.items.flatPreformatted,
        popoverOptions: <PopoverOptions>{ sizeConstraints: { maxHeight: '300px' } },
      },
    }
  );

  const select = new NgnSelectHarness(page.locator('ngn-select').first());
  // The listbox surface only exists once the popover is open.
  await select.open();

  await expectNoA11yViolations(page);
});

test('filter input keeps Home and End for the caret', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `
      <ngn-input-field style="width: 200px;">
        <ngn-select [options]="inputs().options" [filter]="true" />
      </ngn-input-field>
    `,
      imports: ['select', 'inputField'],
    },
    { inputs: { options: exampleData.items.groupedPreformatted } }
  );

  const select = new NgnSelectHarness(page.locator('ngn-select').first());
  await select.open();

  const input = select.filter.children.input;
  await input.fill('ger');
  const caret = () => input.locator.evaluate((el: HTMLInputElement) => el.selectionStart);

  await input.press('Home');
  expect(await caret()).toBe(0);
  await input.press('End');
  expect(await caret()).toBe(3);
});
