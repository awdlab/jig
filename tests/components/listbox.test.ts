import { JigListBoxHarness } from '@awdlab/jig-playwright';
import test, { expect } from '@playwright/test';
import { loadComponent } from '../helper/load-component';
import { exampleData } from '../helper/data';
import { expectNoA11yViolations } from '../helper/axe';
import { expectScreenshot } from '../helper/screenshot';

test('scrolls when a flex parent bounds its height', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `
      <div style="display: flex; flex-direction: column; height: 200px; width: 200px;">
        <jig-list-box style="flex: 1; min-height: 0;" [items]="inputs().items" />
      </div>
    `,
      imports: ['listBox'],
    },
    { inputs: { items: exampleData.items.flatPreformatted } }
  );

  // The list box itself is the scroll port — role="listbox" has to be both the
  // scrollable region and the direct parent of its options.
  const metrics = await page.locator('jig-list-box').evaluate(el => {
    el.scrollTop = 80;
    return {
      portHeight: el.clientHeight,
      contentHeight: el.scrollHeight,
      scrollTop: el.scrollTop,
    };
  });

  expect(metrics.contentHeight).toBeGreaterThan(metrics.portHeight);
  expect(metrics.portHeight).toBeLessThanOrEqual(200);
  expect(metrics.scrollTop).toBe(80);
});

test('separator draws a divider above every group but the first', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `
      <jig-list-box
        aria-label="Options"
        style="width: 200px; height: 400px; display: block;"
        [items]="inputs().items"
        [separator]="inputs().separator"
      />
    `,
      imports: ['listBox'],
    },
    {
      inputs: { items: exampleData.items.groupedPreformatted, separator: false },
    }
  );

  const groups = page.locator('[role="group"]');
  const borderWidth = (index: number) =>
    groups.nth(index).evaluate(el => getComputedStyle(el).borderTopWidth);

  expect(await borderWidth(1)).toBe('0px');

  await handle.setInputs({ items: exampleData.items.groupedPreformatted, separator: true });

  expect(await borderWidth(0)).toBe('0px');
  expect(await borderWidth(1)).toBe('1px');
});

test('home, end and paging move the highlight', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `
      <jig-list-box
        aria-label="Options"
        style="width: 200px; height: 200px; display: block;"
        [items]="inputs().items"
      />
    `,
      imports: ['listBox'],
    },
    { inputs: { items: exampleData.items.flatPreformatted } }
  );

  const listbox = page.locator('jig-list-box');
  const items = exampleData.items.flatPreformatted;
  const listboxId = await listbox.getAttribute('id');
  const optionId = (index: number) => `${listboxId}_option_${items[index]!.value}`;
  const expectHighlighted = (index: number) =>
    expect(listbox).toHaveAttribute('aria-activedescendant', optionId(index));

  await listbox.focus();
  await page.keyboard.press('End');
  await expectHighlighted(items.length - 1);

  await page.keyboard.press('Home');
  await expectHighlighted(0);

  // A 200px port fits fewer rows than the list has, so paging lands mid-list.
  await page.keyboard.press('PageDown');
  await expect(listbox).not.toHaveAttribute('aria-activedescendant', optionId(0));
  expect(await listbox.getAttribute('aria-activedescendant')).not.toBe(optionId(items.length - 1));

  // Paging stops at the ends instead of wrapping, unlike the arrows.
  await page.keyboard.press('PageUp');
  await expectHighlighted(0);
  await page.keyboard.press('PageUp');
  await expectHighlighted(0);
});

test('base', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `
      <jig-list-box style="width: 200px; height: 400px; display: block;" [items]="inputs().items" />
    `,
      imports: ['listBox'],
    },
    {
      inputs: {
        items: exampleData.items.flatPreformatted,
      },
    }
  );

  const listbox = new JigListBoxHarness(page.locator('jig-list-box').first());
  await listbox.expectItemsCount(exampleData.items.flatPreformatted.length);
});

test('accessibility (axe)', async ({ page }) => {
  // role="listbox" requires an accessible name (aria-input-field-name). It comes from
  // `label`, which drives the host's aria-label — a bare aria-label attribute is
  // overwritten by that binding.
  await loadComponent(
    page,
    {
      template: `
      <jig-list-box
        [label]="'Options'"
        style="width: 200px; height: 400px; display: block;"
        [items]="inputs().items"
      />
    `,
      imports: ['listBox'],
    },
    {
      inputs: {
        items: exampleData.items.flatPreformatted,
      },
    }
  );

  const listbox = new JigListBoxHarness(page.locator('jig-list-box').first());
  await listbox.expectItemsCount(exampleData.items.flatPreformatted.length);
  await expectNoA11yViolations(page);
});

test('visual', async ({ page }, testInfo) => {
  await loadComponent(
    page,
    {
      template: `
      <jig-list-box
        class="page-center"
        aria-label="Options"
        style="width: 240px; height: 320px; display: block;"
        [items]="inputs().items"
        [separator]="true"
      />
    `,
      imports: ['listBox'],
    },
    { inputs: { items: exampleData.items.groupedPreformatted } }
  );

  await expectScreenshot(page.locator('jig-list-box'), testInfo, 'grouped');
});
