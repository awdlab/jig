import test, { expect } from '@playwright/test';
import { loadComponent } from '../helper/load-component';
import { JigFilterHarness, JigSelectHarness } from '@awdlab/jig-playwright';
import { expectNoA11yViolations } from '../helper/axe';
import { expectScreenshot } from '../helper/screenshot';

test('base (string contains) emits filtered result', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `
        <jig-filter
          [data]="inputs().data"
          dataType="string"
          (filterChange)="output('config', $event)"
          (filterResultChange)="output('filtered', $event)"
          style="width: 320px"
        />
      `,
      imports: ['filter'],
    },
    {
      inputs: {
        data: ['Nigeria', 'Algeria', 'Germany', 'France'],
      },
    }
  );

  const filter = new JigFilterHarness(page.locator('jig-filter'));
  await filter.open();

  const op1 = filter.operatorSelect(0);
  await op1.open();
  await op1.clickItemByText('Contains');
  await filter.valueInput(0).fill('ger');

  await expect(async () => {
    const log = await handle.getOutputLog();
    const last = log['filtered']?.at(-1);
    expect(last).toEqual(['Nigeria', 'Algeria', 'Germany']);
  }).toPass();
});

test('inline mode renders without popover', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `
        <jig-filter
          mode="inline"
          [data]="inputs().data"
          dataType="string"
          (filterChange)="output('config', $event)"
          (filterResultChange)="output('filtered', $event)"
          style="width: 400px"
        />
      `,
      imports: ['filter'],
    },
    {
      inputs: {
        data: ['Apple', 'Banana', 'Cherry'],
      },
    }
  );

  const filter = new JigFilterHarness(page.locator('jig-filter'));

  // Inline mode: operator select and value input should be visible without opening
  const op = filter.operatorSelect(0);
  await expect(op.locator).toBeVisible();

  // Select "Contains" and type value
  await op.open();
  await op.clickItemByText('Contains');
  await filter.valueInput(0).fill('an');

  await expect(async () => {
    const log = await handle.getOutputLog();
    const last = log['filtered']?.at(-1);
    expect(last).toEqual(['Banana']);
  }).toPass();

  // Clear button should be visible and work
  await filter.clearButton().click();

  await expect(async () => {
    const log = await handle.getOutputLog();
    const last = log['filtered']?.at(-1);
    expect(last).toEqual(['Apple', 'Banana', 'Cherry']);
  }).toPass();
});

test('multiple conditions with AND/OR divider toggle', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `
        <jig-filter
          mode="inline"
          [data]="inputs().data"
          dataType="string"
          [allowMultiple]="true"
          (filterChange)="output('config', $event)"
          (filterResultChange)="output('filtered', $event)"
          style="width: 400px"
        />
      `,
      imports: ['filter'],
    },
    {
      inputs: {
        data: ['Apple', 'Apricot', 'Banana', 'Blueberry'],
      },
    }
  );

  const filter = new JigFilterHarness(page.locator('jig-filter'));

  // Set first condition: contains "ap"
  const op1 = filter.operatorSelect(0);
  await op1.open();
  await op1.clickItemByText('Contains');
  await filter.valueInput(0).fill('ap');

  // Add second condition: contains "bl"
  await filter.addConditionButton().click();
  const op2 = filter.operatorSelect(1);
  await op2.open();
  await op2.clickItemByText('Contains');
  await filter.valueInput(1).fill('bl');

  // Default is "all" (AND) — nothing matches both "ap" AND "bl"
  await expect(async () => {
    const log = await handle.getOutputLog();
    const config = log['config']?.at(-1);
    expect(config.matchMode).toBe('all');
    const filtered = log['filtered']?.at(-1);
    expect(filtered).toEqual([]);
  }).toPass();

  // Divider should show AND, click to toggle to OR
  const divider = filter.matchModeDivider();
  await expect(divider).toBeVisible();
  await divider.click();

  // Now matches "ap" OR "bl"
  await expect(async () => {
    const log = await handle.getOutputLog();
    const config = log['config']?.at(-1);
    expect(config.matchMode).toBe('any');
    const filtered = log['filtered']?.at(-1);
    expect(filtered).toEqual(['Apple', 'Apricot', 'Blueberry']);
  }).toPass();
});

test('remove condition button works', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `
        <jig-filter
          mode="inline"
          [data]="inputs().data"
          dataType="string"
          [allowMultiple]="true"
          (filterChange)="output('config', $event)"
          (filterResultChange)="output('filtered', $event)"
          style="width: 400px"
        />
      `,
      imports: ['filter'],
    },
    {
      inputs: {
        data: ['Apple', 'Banana'],
      },
    }
  );

  const filter = new JigFilterHarness(page.locator('jig-filter'));

  // Add a second condition
  await filter.addConditionButton().click();
  await expect(filter.row(1)).toBeVisible();

  // Remove first condition
  await filter.removeButton(0).click();

  // Should only have one row now
  await expect(filter.row(1)).not.toBeVisible();
  await expect(filter.row(0)).toBeVisible();
});

test('manual apply mode: apply commits, cancel restores', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `
        <jig-filter
          mode="inline"
          [autoApply]="false"
          [data]="inputs().data"
          dataType="string"
          (filterChange)="output('config', $event)"
          (filterResultChange)="output('filtered', $event)"
          style="width: 400px"
        />
      `,
      imports: ['filter'],
    },
    {
      inputs: {
        data: ['Apple', 'Apricot', 'Banana', 'Cherry'],
      },
    }
  );

  const filter = new JigFilterHarness(page.locator('jig-filter'));

  // Apply and Cancel buttons should be visible
  await expect(filter.applyButton()).toBeVisible();
  await expect(filter.cancelButton()).toBeVisible();
  // Clear button should NOT be visible (auto-apply is off)
  await expect(filter.clearButton()).not.toBeVisible();

  // Set operator and value
  const op = filter.operatorSelect(0);
  await op.open();
  await op.clickItemByText('Contains');
  await filter.valueInput(0).fill('ap');

  // Filter should NOT be applied yet (still showing all items)
  await expect(async () => {
    const log = await handle.getOutputLog();
    const filtered = log['filtered']?.at(-1);
    expect(filtered).toEqual(['Apple', 'Apricot', 'Banana', 'Cherry']);
  }).toPass();

  // Click Apply
  await filter.applyButton().click();

  // Now filter should be applied
  await expect(async () => {
    const log = await handle.getOutputLog();
    const filtered = log['filtered']?.at(-1);
    expect(filtered).toEqual(['Apple', 'Apricot']);
  }).toPass();

  // Change value to something else
  await filter.valueInput(0).fill('ban');

  // Click Cancel — should restore to previously applied state ("ap")
  await filter.cancelButton().click();

  // The value input should show "ap" again
  await expect(async () => {
    const log = await handle.getOutputLog();
    const filtered = log['filtered']?.at(-1);
    expect(filtered).toEqual(['Apple', 'Apricot']);
  }).toPass();
});

test('boolean filter uses Yes/No labels', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `
        <jig-filter
          mode="inline"
          [data]="inputs().data"
          dataType="boolean"
          (filterChange)="output('config', $event)"
          (filterResultChange)="output('filtered', $event)"
          style="width: 400px"
        />
      `,
      imports: ['filter'],
    },
    {
      inputs: {
        data: [true, false, true, false, true],
      },
    }
  );

  const filter = new JigFilterHarness(page.locator('jig-filter'));

  // Boolean uses valueSelect (operator with value ptClass since no value input)
  const boolSelect = filter.valueSelect(0);
  await expect(boolSelect.locator).toBeVisible();

  // Select "No" to trigger the filter (initial state has no filter applied yet)
  await boolSelect.open();
  await boolSelect.clickItemByText('No');

  await expect(async () => {
    const log = await handle.getOutputLog();
    const filtered = log['filtered']?.at(-1);
    expect(filtered).toEqual([false, false]);
  }).toPass();

  // Switch to "Yes"
  await boolSelect.open();
  await boolSelect.clickItemByText('Yes');

  await expect(async () => {
    const log = await handle.getOutputLog();
    const filtered = log['filtered']?.at(-1);
    expect(filtered).toEqual([true, true, true]);
  }).toPass();
});

test('popover mode summary text shows quoted value', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `
        <jig-filter
          [data]="inputs().data"
          dataType="string"
          (filterChange)="output('config', $event)"
          (filterResultChange)="output('filtered', $event)"
          style="width: 320px"
        />
      `,
      imports: ['filter'],
    },
    {
      inputs: {
        data: ['Apple', 'Banana'],
      },
    }
  );

  const filter = new JigFilterHarness(page.locator('jig-filter'));

  // Summary should show "No filter" initially
  await expect(filter.trigger).toContainText('No filter');

  // Open, set filter, close
  await filter.open();
  const op = filter.operatorSelect(0);
  await op.open();
  await op.clickItemByText('Contains');
  await filter.valueInput(0).fill('app');

  // Close the popover by clicking Clear won't work since that clears;
  // The summary text updates after debounce, let's just check the trigger text
  await expect(async () => {
    const text = await filter.trigger.textContent();
    expect(text).toContain('"app"');
  }).toPass();
});

test('list kind (multi select) filters by membership', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `
        <jig-filter
          [data]="inputs().data"
          dataType="list"
          (filterChange)="output('config', $event)"
          (filterResultChange)="output('filtered', $event)"
          style="width: 360px"
        />
      `,
      imports: ['filter'],
    },
    {
      inputs: {
        data: ['Nigeria', 'Algeria', 'Germany', 'France'],
      },
    }
  );

  const filter = new JigFilterHarness(page.locator('jig-filter'));
  await filter.open();

  const select = new JigSelectHarness(
    page.locator('jig-filter [data-testid="filter-row-list"] jig-select')
  );
  await select.open();
  await select.clickItemByText('Germany', false);
  await select.clickItemByText('France', false);
  await select.close();

  await expect(async () => {
    const log = await handle.getOutputLog();
    const config = log['config']?.at(-1);
    const filtered = log['filtered']?.at(-1);

    expect(config.dataType).toBe('list');
    expect(config.matchMode).toBe('all');
    expect(config.conditions[0].operator).toBe('in');
    expect(JSON.parse(config.conditions[0].rawValue)).toEqual(['Germany', 'France']);

    expect(filtered).toEqual(['Germany', 'France']);
  }).toPass();
});

test('accessibility (axe)', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `
        <jig-filter mode="inline" [data]="inputs().data" dataType="string" style="width: 400px" />
      `,
      imports: ['filter'],
    },
    { inputs: { data: ['Apple', 'Banana', 'Cherry'] } }
  );

  const filter = new JigFilterHarness(page.locator('jig-filter'));
  await expect(filter.operatorSelect(0).locator).toBeVisible();

  await expectNoA11yViolations(page);
});

test('visual', async ({ page }, testInfo) => {
  await loadComponent(
    page,
    {
      template: `
        <jig-filter
          class="page-center"
          mode="inline"
          [data]="inputs().data"
          dataType="string"
          style="width: 400px"
        />
      `,
      imports: ['filter'],
    },
    { inputs: { data: ['Apple', 'Banana', 'Cherry'] } }
  );

  const filter = new JigFilterHarness(page.locator('jig-filter'));
  await expect(filter.operatorSelect(0).locator).toBeVisible();

  await expectScreenshot(page, testInfo, 'inline');
});
