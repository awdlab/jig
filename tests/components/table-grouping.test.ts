import test, { expect } from '@playwright/test';
import { JigTableHarness } from '@awdlab/jig-playwright';

import { expectNoA11yViolations } from '../helper/axe';
import { loadComponent } from '../helper/load-component';
import { useRtl } from '../helper/direction';
import { expectScreenshot } from '../helper/screenshot';
import type { TemplateType } from '../../apps/test-wrapper/src/app/window.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

const TABLE_TEMPLATE: TemplateType = {
  template: `
    <jig-table
      #table
      style="height: 400px; width: 100%"
      [rows]="inputs().rows"
      [fieldId]="'id'"
      [groupBy]="inputs().groupBy"
      [expandedGroups]="inputs().expandedGroups"
      [sort]="inputs().sort"
      [rowHeight]="40"
      (expandedGroupsChange)="output('expandedGroups', $event)"
    >
      <ng-template #header>
        <tr jigTableHeadTr>
          <th [jigTableTh]="table.column('id')">ID</th>
          <th [jigTableTh]="table.column('name')">Name</th>
          <th [jigTableTh]="table.column('department')">Department</th>
        </tr>
      </ng-template>
      <ng-template #body let-row [jigTemplate]="table.templateTypes.body">
        <tr [jigTableBodyTr]="row">
          <td jigTableTd>{{ row.data.id }}</td>
          <td jigTableTd>{{ row.data.name }}</td>
          <td jigTableTd>{{ row.data.department }}</td>
        </tr>
      </ng-template>
    </jig-table>`,
  imports: ['tableModule', 'jigTemplate'],
};

const ROWS = [
  { id: '1', name: 'Alice', department: 'Engineering' },
  { id: '2', name: 'Bob', department: 'Engineering' },
  { id: '3', name: 'Carol', department: 'Sales' },
  { id: '4', name: 'Dave', department: 'Sales' },
  { id: '5', name: 'Eve', department: 'Marketing' },
];

const ALL_GROUPS = ['Engineering', 'Sales', 'Marketing'];

const DEFAULT_INPUTS = {
  rows: ROWS,
  groupBy: 'department' as string | null,
  expandedGroups: ALL_GROUPS as string[],
  sort: null as { column: string; direction: 'asc' | 'desc' } | null,
};

async function loadTable(
  page: import('@playwright/test').Page,
  inputOverrides?: Partial<typeof DEFAULT_INPUTS>
) {
  const handle = await loadComponent(page, TABLE_TEMPLATE, {
    inputs: { ...DEFAULT_INPUTS, ...inputOverrides },
  });
  await expect(page.locator('jig-table')).toBeVisible({ timeout: 10000 });
  return handle;
}

function table(page: import('@playwright/test').Page) {
  return new JigTableHarness(page.locator('jig-table'));
}

function groupHeaders(page: import('@playwright/test').Page) {
  return table(page).groupHeaders.locator(table(page).classes['group-header-cell']);
}

function dataCells(page: import('@playwright/test').Page) {
  return table(page).cells;
}

// ── Tests ────────────────────────────────────────────────────────────────────

test('grouping renders group headers with correct values and counts', async ({ page }) => {
  await loadTable(page);

  const headers = groupHeaders(page);
  await expect(headers).toHaveCount(3);

  await expect(headers.nth(0)).toContainText('Engineering');
  await expect(headers.nth(0)).toContainText('(2)');
  await expect(headers.nth(1)).toContainText('Sales');
  await expect(headers.nth(1)).toContainText('(2)');
  await expect(headers.nth(2)).toContainText('Marketing');
  await expect(headers.nth(2)).toContainText('(1)');
});

test('all groups start collapsed when expandedGroups is empty', async ({ page }) => {
  await loadTable(page, { expandedGroups: [] });

  // No data cells visible — all collapsed
  await expect(dataCells(page)).toHaveCount(0);

  // 3 group headers still visible
  await expect(groupHeaders(page)).toHaveCount(3);
});

test('all groups expanded when all keys provided', async ({ page }) => {
  await loadTable(page);

  // 5 rows * 3 cols = 15 data cells
  await expect(dataCells(page)).toHaveCount(15);
});

test('clicking group header toggles expansion', async ({ page }) => {
  await loadTable(page);

  const headers = groupHeaders(page);

  // Collapse Engineering (2 rows)
  await headers.nth(0).click();

  // 3 data rows visible (Sales 2 + Marketing 1) * 3 cols
  await expect(dataCells(page)).toHaveCount(9);

  // Click again to expand
  await headers.nth(0).click();
  await expect(dataCells(page)).toHaveCount(15);
});

test('expandedGroups model reflects state changes', async ({ page }) => {
  const handle = await loadTable(page);

  const headers = groupHeaders(page);

  // Collapse Engineering
  await headers.nth(0).click();

  await expect(async () => {
    const log = await handle.getOutputLog();
    const lastValue = log['expandedGroups']?.at(-1);
    expect(lastValue).toBeDefined();
    expect(lastValue).not.toContain('Engineering');
    expect(lastValue).toContain('Sales');
    expect(lastValue).toContain('Marketing');
  }).toPass();
});

test('groupBy null disables grouping (passthrough)', async ({ page }) => {
  await loadTable(page, { groupBy: null });

  await expect(groupHeaders(page)).toHaveCount(0);
  await expect(page.locator('td[class*="jig-table-cell"]')).toHaveCount(15);
});

test('group headers span all columns', async ({ page }) => {
  await loadTable(page);

  const headerCell = groupHeaders(page).first();
  const headerWidth = await headerCell.evaluate(el => el.getBoundingClientRect().width);
  const tableWidth = await page
    .locator('jig-table table')
    .evaluate(el => el.getBoundingClientRect().width);

  expect(headerWidth).toBeGreaterThan(tableWidth - 10);
});

test('collapsing all groups shows only headers', async ({ page }) => {
  await loadTable(page);

  const headers = groupHeaders(page);

  await headers.nth(0).click();
  await headers.nth(1).click();
  await headers.nth(2).click();

  await expect(dataCells(page)).toHaveCount(0);
  await expect(headers).toHaveCount(3);
});

test('pre-set expandedGroups controls initial state', async ({ page }) => {
  await loadTable(page, { expandedGroups: ['Sales'] });

  await expect(groupHeaders(page)).toHaveCount(3);
  // Only Sales data rows (2 rows * 3 cols = 6 cells)
  await expect(dataCells(page)).toHaveCount(6);
});

test('aria-expanded reflects group state', async ({ page }) => {
  await loadTable(page, { expandedGroups: ['Engineering'] });

  // aria-expanded lives on the group cell — on a row it is treegrid-only.
  const grid = table(page);
  await grid.expectGroupCount(3);
  await grid.expectGroupExpanded(0, true);
  await grid.expectGroupExpanded(1, false);
});

test('sorting applies within groups', async ({ page }) => {
  await loadTable(page, {
    expandedGroups: ['Engineering'],
    sort: { column: 'name', direction: 'desc' },
  });

  // Engineering has Alice (id=1) and Bob (id=2). Sorted desc by name: Bob, Alice
  const cells = dataCells(page);
  await expect(cells.nth(0)).toContainText('2'); // Bob's id
  await expect(cells.nth(1)).toContainText('Bob');
});

test('group headers expand/collapse from the keyboard', async ({ page }) => {
  const handle = await loadTable(page, { expandedGroups: [] });
  const grid = page.locator('table[role="grid"]');
  await grid.focus();

  // First row is the Engineering group header; Space expands it.
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press(' ');
  await expect(groupHeaders(page).and(page.locator('[aria-expanded="true"]'))).toHaveCount(1);
  await expect(async () => {
    const log = await handle.getOutputLog();
    expect(log['expandedGroups']?.at(-1)).toEqual(['Engineering']);
  }).toPass();

  // Enter collapses it again.
  await page.keyboard.press('Enter');
  await expect(groupHeaders(page).and(page.locator('[aria-expanded="true"]'))).toHaveCount(0);
  await expect(async () => {
    const log = await handle.getOutputLog();
    expect(log['expandedGroups']?.at(-1)).toEqual([]);
  }).toPass();
});

test('accessibility (axe)', async ({ page }) => {
  await loadTable(page);
  await expect(groupHeaders(page)).toHaveCount(ALL_GROUPS.length);
  await expectNoA11yViolations(page);
});

test('rtl', async ({ page }, testInfo) => {
  await useRtl(page);
  await loadTable(page);
  await expectScreenshot(page, testInfo);
});
