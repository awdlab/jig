import test, { expect } from '@playwright/test';
import { loadComponent } from '../helper/load-component';
import { useRtl } from '../helper/direction';
import { JigFilterFieldHarness, JigSelectHarness } from '@awdlab/jig-playwright';
import { expectNoA11yViolations } from '../helper/axe';
import { expectScreenshot } from '../helper/screenshot';

test('base (string contains) emits filtered result', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `
        <jig-filter-field
          [data]="inputs().data"
          dataType="string"
          (filterChange)="output('config', $event)"
          (filterResultChange)="output('filtered', $event)"
          style="width: 320px"
        />
      `,
      imports: ['filterField'],
    },
    {
      inputs: {
        data: ['Nigeria', 'Algeria', 'Germany', 'France'],
      },
    }
  );

  const filter = new JigFilterFieldHarness(page.locator('jig-filter-field'));
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

test('string notContains excludes matching values', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `
        <jig-filter-field
          [data]="inputs().data"
          dataType="string"
          (filterResultChange)="output('filtered', $event)"
          style="width: 320px"
        />
      `,
      imports: ['filterField'],
    },
    {
      inputs: {
        data: ['Nigeria', 'Algeria', 'Germany', 'France'],
      },
    }
  );

  const filter = new JigFilterFieldHarness(page.locator('jig-filter-field'));
  await filter.open();

  const op1 = filter.operatorSelect(0);
  await op1.open();
  await op1.clickItemByText('Does not contain');
  await filter.valueInput(0).fill('ger');

  await expect(async () => {
    const log = await handle.getOutputLog();
    const last = log['filtered']?.at(-1);
    expect(last).toEqual(['France']);
  }).toPass();
});

test('inline mode renders without popover', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `
        <jig-filter-field
          mode="inline"
          [data]="inputs().data"
          dataType="string"
          (filterChange)="output('config', $event)"
          (filterResultChange)="output('filtered', $event)"
          style="width: 400px"
        />
      `,
      imports: ['filterField'],
    },
    {
      inputs: {
        data: ['Apple', 'Banana', 'Cherry'],
      },
    }
  );

  const filter = new JigFilterFieldHarness(page.locator('jig-filter-field'));

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
        <jig-filter-field
          mode="inline"
          [data]="inputs().data"
          dataType="string"
          [allowMultiple]="true"
          (filterChange)="output('config', $event)"
          (filterResultChange)="output('filtered', $event)"
          style="width: 400px"
        />
      `,
      imports: ['filterField'],
    },
    {
      inputs: {
        data: ['Apple', 'Apricot', 'Banana', 'Blueberry'],
      },
    }
  );

  const filter = new JigFilterFieldHarness(page.locator('jig-filter-field'));

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
        <jig-filter-field
          mode="inline"
          [data]="inputs().data"
          dataType="string"
          [allowMultiple]="true"
          (filterChange)="output('config', $event)"
          (filterResultChange)="output('filtered', $event)"
          style="width: 400px"
        />
      `,
      imports: ['filterField'],
    },
    {
      inputs: {
        data: ['Apple', 'Banana'],
      },
    }
  );

  const filter = new JigFilterFieldHarness(page.locator('jig-filter-field'));

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
        <jig-filter-field
          mode="inline"
          [autoApply]="false"
          [data]="inputs().data"
          dataType="string"
          (filterChange)="output('config', $event)"
          (filterResultChange)="output('filtered', $event)"
          style="width: 400px"
        />
      `,
      imports: ['filterField'],
    },
    {
      inputs: {
        data: ['Apple', 'Apricot', 'Banana', 'Cherry'],
      },
    }
  );

  const filter = new JigFilterFieldHarness(page.locator('jig-filter-field'));

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
        <jig-filter-field
          mode="inline"
          [data]="inputs().data"
          dataType="boolean"
          (filterChange)="output('config', $event)"
          (filterResultChange)="output('filtered', $event)"
          style="width: 400px"
        />
      `,
      imports: ['filterField'],
    },
    {
      inputs: {
        data: [true, false, true, false, true],
      },
    }
  );

  const filter = new JigFilterFieldHarness(page.locator('jig-filter-field'));

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
        <jig-filter-field
          [data]="inputs().data"
          dataType="string"
          (filterChange)="output('config', $event)"
          (filterResultChange)="output('filtered', $event)"
          style="width: 320px"
        />
      `,
      imports: ['filterField'],
    },
    {
      inputs: {
        data: ['Apple', 'Banana'],
      },
    }
  );

  const filter = new JigFilterFieldHarness(page.locator('jig-filter-field'));

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
        <jig-filter-field
          [data]="inputs().data"
          dataType="list"
          (filterChange)="output('config', $event)"
          (filterResultChange)="output('filtered', $event)"
          style="width: 360px"
        />
      `,
      imports: ['filterField'],
    },
    {
      inputs: {
        data: ['Nigeria', 'Algeria', 'Germany', 'France'],
      },
    }
  );

  const filter = new JigFilterFieldHarness(page.locator('jig-filter-field'));
  await filter.open();

  const select = new JigSelectHarness(
    page.locator('jig-filter-field [data-testid="filter-row-list"] jig-select')
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

test('operators restricts the list and defaultOperator seeds new conditions', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `
        <jig-filter-field
          mode="inline"
          allowMultiple
          [data]="inputs().data"
          [operators]="inputs().operators"
          defaultOperator="contains"
          dataType="string"
          style="width: 400px"
        />
      `,
      imports: ['filterField'],
    },
    {
      inputs: {
        data: ['Apple', 'Banana', 'Cherry'],
        operators: ['startsWith', 'contains', 'bogus'],
      },
    }
  );

  const filter = new JigFilterFieldHarness(page.locator('jig-filter-field'));
  const op = filter.operatorSelect(0);
  await op.expectSelectedItemText('Contains');

  await op.open();
  await op.listBox.scroller.expectItemsTexts(['Starts with', 'Contains']);
  await op.close();

  await filter.addConditionButton().click();
  await filter.operatorSelect(1).expectSelectedItemText('Contains');
});

test('accessibility (axe)', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `
        <jig-filter-field mode="inline" [data]="inputs().data" dataType="string" style="width: 400px" />
      `,
      imports: ['filterField'],
    },
    { inputs: { data: ['Apple', 'Banana', 'Cherry'] } }
  );

  const filter = new JigFilterFieldHarness(page.locator('jig-filter-field'));
  await expect(filter.operatorSelect(0).locator).toBeVisible();

  await expectNoA11yViolations(page);
});

test('visual', async ({ page }, testInfo) => {
  await loadComponent(
    page,
    {
      template: `
        <jig-filter-field
          class="page-center"
          mode="inline"
          [data]="inputs().data"
          dataType="string"
          style="width: 400px"
        />
      `,
      imports: ['filterField'],
    },
    { inputs: { data: ['Apple', 'Banana', 'Cherry'] } }
  );

  const filter = new JigFilterFieldHarness(page.locator('jig-filter-field'));
  await expect(filter.operatorSelect(0).locator).toBeVisible();

  await expectScreenshot(page, testInfo, 'inline');
});

test('rtl', async ({ page }, testInfo) => {
  await useRtl(page);
  await loadComponent(
    page,
    {
      template: `
        <jig-filter-field
          [data]="inputs().data"
          dataType="string"
          (filterChange)="output('config', $event)"
          (filterResultChange)="output('filtered', $event)"
          style="width: 320px"
        />
      `,
      imports: ['filterField'],
    },
    {
      inputs: {
        data: ['Nigeria', 'Algeria', 'Germany', 'France'],
      },
    }
  );
  await expectScreenshot(page, testInfo);
});

test('a custom filter template replaces the rows and filters through setValue', async ({
  page,
}) => {
  const handle = await loadComponent(
    page,
    {
      template: `
        <jig-filter-field
          mode="inline"
          dataType="number"
          [data]="inputs().data"
          (filterResultChange)="output('filtered', $event)"
          style="width: 320px"
        >
          <ng-template #filter let-config let-setValue="setValue">
            <button
              type="button"
              data-testid="at-least-30"
              (click)="
                setValue({
                  dataType: 'number',
                  matchMode: 'all',
                  conditions: [{ operator: 'greaterThanOrEqual', rawValue: '30' }]
                })
              "
            >
              At least 30
            </button>
            <span data-testid="condition-count">{{ config?.conditions?.length ?? 0 }}</span>
          </ng-template>
        </jig-filter-field>
      `,
      imports: ['filterField'],
    },
    { inputs: { data: [10, 20, 30, 40] } }
  );

  // The built-in rows are gone; the custom editor is what renders.
  await expect(page.getByTestId('at-least-30')).toBeVisible();
  await expect(page.locator('jig-filter-field jig-select')).toHaveCount(0);

  await page.getByTestId('at-least-30').click();
  await expect(page.getByTestId('condition-count')).toHaveText('1');
  await expect(async () => {
    const log = await handle.getOutputLog();
    expect(log['filtered']?.at(-1)).toEqual([30, 40]);
  }).toPass();
});

test('the input-mode summary is a labelled, focusable button', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `
        <button>before</button>
        <jig-filter-field label="Fruit" [data]="inputs().data" dataType="string" style="width: 320px" />
      `,
      imports: ['filterField'],
    },
    { inputs: { data: ['Apple', 'Banana'] } }
  );

  const summary = page.locator('jig-filter-field [role="button"]');
  await expect(summary).toHaveAccessibleName(/^Fruit\s+\S/);

  await page.getByRole('button', { name: 'before' }).focus();
  await page.keyboard.press('Tab');
  await expect(summary).toBeFocused();

  await page.keyboard.press(' ');
  await new JigFilterFieldHarness(page.locator('jig-filter-field')).expectOpened();
});
