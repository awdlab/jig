import test, { expect } from '@playwright/test';

import { loadComponent } from '../helper/load-component';
import type { TemplateType } from '../../apps/test-wrapper/src/app/window.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

const TABLE_TEMPLATE: TemplateType = {
  template: `
    <ngn-table
      #table
      style="height: 400px; width: 100%"
      [rows]="inputs().rows"
      [fieldId]="'id'"
      [reorderable]="inputs().reorderable"
      [(columnOrder)]="inputs().columnOrder"
    >
      <ng-template #header>
        <tr ngnTableHeadTr>
          <th [ngnTableTh]="table.column('id')" ngnTableReorderableColumn>ID</th>
          <th [ngnTableTh]="table.column('name')" ngnTableReorderableColumn>Name</th>
          <th [ngnTableTh]="table.column('department')" ngnTableReorderableColumn>Department</th>
          <th [ngnTableTh]="table.column('location')" ngnTableReorderableColumn>Location</th>
        </tr>
      </ng-template>
      <ng-template #body let-row [ngnTemplate]="table.templateTypes.body">
        <tr [ngnTableBodyTr]="row">
          <td ngnTableTd>{{ row.data.id }}</td>
          <td ngnTableTd>{{ row.data.name }}</td>
          <td ngnTableTd>{{ row.data.department }}</td>
          <td ngnTableTd>{{ row.data.location }}</td>
        </tr>
      </ng-template>
    </ngn-table>`,
  imports: ['tableModule', 'ngnTemplate'],
};

function generateRows(count: number) {
  const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'];
  const locations = ['NYC', 'LA', 'Chicago', 'Austin', 'Seattle'];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Person ${i + 1}`,
    department: departments[i % departments.length],
    location: locations[i % locations.length],
  }));
}

const DEFAULT_INPUTS = {
  rows: generateRows(20),
  reorderable: true,
  columnOrder: [] as string[],
};

async function loadTable(
  page: import('@playwright/test').Page,
  inputOverrides?: Partial<typeof DEFAULT_INPUTS>
) {
  const handle = await loadComponent(page, TABLE_TEMPLATE, {
    inputs: { ...DEFAULT_INPUTS, ...inputOverrides },
  });
  await expect(page.locator('ngn-table')).toBeVisible({ timeout: 10000 });
  await page.waitForTimeout(200);
  return handle;
}

async function getHeaderTexts(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const table = document.querySelector('ngn-table table');
    if (!table) return [];
    const headers = table.querySelectorAll('th');
    // Sort by computed grid-column-start to get visual order
    const headerData = Array.from(headers).map(h => ({
      text: h.textContent?.trim() || '',
      colStart: parseInt(getComputedStyle(h).getPropertyValue('--ngn-table-column-index') || '0'),
    }));
    headerData.sort((a, b) => a.colStart - b.colStart);
    return headerData.map(h => h.text);
  });
}

async function getColumnStarts(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const table = document.querySelector('ngn-table table');
    if (!table) return [];
    const headers = table.querySelectorAll('th');
    return Array.from(headers).map(h => {
      const style = h.style.getPropertyValue('--ngn-table-column-index');
      return parseInt(style || '0');
    });
  });
}

async function dragHeader(
  page: import('@playwright/test').Page,
  fromIndex: number,
  toIndex: number
) {
  const headers = page.locator('ngn-table th');
  const fromHeader = headers.nth(fromIndex);
  const toHeader = headers.nth(toIndex);

  await fromHeader.scrollIntoViewIfNeeded();
  await page.waitForTimeout(100);

  const fromBox = await fromHeader.boundingBox();
  const toBox = await toHeader.boundingBox();
  expect(fromBox).not.toBeNull();
  expect(toBox).not.toBeNull();

  const startX = fromBox!.x + fromBox!.width / 2;
  const startY = fromBox!.y + fromBox!.height / 2;
  // Target the left edge of the destination to place before it
  const endX = toBox!.x + 5;
  const endY = toBox!.y + toBox!.height / 2;

  await page.mouse.move(startX, startY);
  await page.mouse.down();

  // Move in steps to pass the dead zone and trigger drag
  const steps = 15;
  for (let i = 1; i <= steps; i++) {
    await page.mouse.move(
      startX + ((endX - startX) * i) / steps,
      startY + ((endY - startY) * i) / steps
    );
    await page.waitForTimeout(10);
  }

  await page.mouse.up();
  await page.waitForTimeout(200);
}

// ── Tests ────────────────────────────────────────────────────────────────────

test('table column reorder - basic drag reorders columns', async ({ page }) => {
  await loadTable(page);

  // Drag "department" (index 2) before "name" (index 1)
  await dragHeader(page, 2, 1);

  const colStarts = await getColumnStarts(page);
  // ID=1, Name should shift right, Department should be at 2
  // th[0]=id, th[1]=name, th[2]=department, th[3]=location
  // After reorder: id(1), department(2), name(3), location(4)
  expect(colStarts[0]).toBe(1); // id
  expect(colStarts[2]).toBe(2); // department moved to position 2
  expect(colStarts[1]).toBe(3); // name shifted to position 3
  expect(colStarts[3]).toBe(4); // location unchanged
});

test('table column reorder - drop indicator visible during drag', async ({ page }) => {
  await loadTable(page);

  const headers = page.locator('ngn-table th');
  const fromHeader = headers.nth(2); // Department

  const fromBox = await fromHeader.boundingBox();
  expect(fromBox).not.toBeNull();

  const startX = fromBox!.x + fromBox!.width / 2;
  const startY = fromBox!.y + fromBox!.height / 2;

  await page.mouse.move(startX, startY);
  await page.mouse.down();

  // Move enough to pass dead zone
  for (let i = 1; i <= 10; i++) {
    await page.mouse.move(startX - i * 10, startY);
    await page.waitForTimeout(10);
  }

  // Check that drop indicator exists
  const indicator = page.locator('[class*="drop-indicator"]');
  await expect(indicator).toBeAttached();

  await page.mouse.up();
  await page.waitForTimeout(100);

  // Indicator should be gone after drop
  await expect(indicator).not.toBeAttached();
});

test('table column reorder - cancel via Escape', async ({ page }) => {
  await loadTable(page);

  const initialColStarts = await getColumnStarts(page);

  const headers = page.locator('ngn-table th');
  const fromHeader = headers.nth(2); // Department

  const fromBox = await fromHeader.boundingBox();
  expect(fromBox).not.toBeNull();

  const startX = fromBox!.x + fromBox!.width / 2;
  const startY = fromBox!.y + fromBox!.height / 2;

  await page.mouse.move(startX, startY);
  await page.mouse.down();

  // Move enough to start drag
  for (let i = 1; i <= 10; i++) {
    await page.mouse.move(startX - i * 10, startY);
    await page.waitForTimeout(10);
  }

  // Press Escape to cancel
  await page.keyboard.press('Escape');
  await page.mouse.up();
  await page.waitForTimeout(200);

  // Column order should be unchanged
  const afterColStarts = await getColumnStarts(page);
  expect(afterColStarts).toEqual(initialColStarts);
});

test('table column reorder - no reorder when disabled', async ({ page }) => {
  await loadTable(page, { reorderable: false });

  const initialColStarts = await getColumnStarts(page);

  // Try to drag
  await dragHeader(page, 2, 0);

  const afterColStarts = await getColumnStarts(page);
  expect(afterColStarts).toEqual(initialColStarts);
});

test('table column reorder - dead zone prevents accidental drag', async ({ page }) => {
  await loadTable(page);

  const initialColStarts = await getColumnStarts(page);

  const headers = page.locator('ngn-table th');
  const fromHeader = headers.nth(1);

  const fromBox = await fromHeader.boundingBox();
  expect(fromBox).not.toBeNull();

  const startX = fromBox!.x + fromBox!.width / 2;
  const startY = fromBox!.y + fromBox!.height / 2;

  await page.mouse.move(startX, startY);
  await page.mouse.down();

  // Move less than 5px (dead zone)
  await page.mouse.move(startX + 3, startY);
  await page.waitForTimeout(50);
  await page.mouse.up();
  await page.waitForTimeout(200);

  // Column order unchanged
  const afterColStarts = await getColumnStarts(page);
  expect(afterColStarts).toEqual(initialColStarts);
});

test('table column reorder - body cells follow header order', async ({ page }) => {
  await loadTable(page);

  // Drag "department" (index 2) before "id" (index 0)
  await dragHeader(page, 2, 0);

  // Check that body cells also have reordered column indices
  const bodyCellStarts = await page.evaluate(() => {
    const table = document.querySelector('ngn-table table');
    if (!table) return [];
    const firstRow = table.querySelector('tbody tr');
    if (!firstRow) return [];
    const cells = firstRow.querySelectorAll('td');
    return Array.from(cells).map(c => {
      const style = c.style.getPropertyValue('--ngn-table-column-index');
      return parseInt(style || '0');
    });
  });

  // td[0]=id, td[1]=name, td[2]=department, td[3]=location
  // After reorder: department(1), id(2), name(3), location(4)
  expect(bodyCellStarts[2]).toBe(1); // department cell at visual position 1
  expect(bodyCellStarts[0]).toBe(2); // id cell at visual position 2
  expect(bodyCellStarts[1]).toBe(3); // name cell at visual position 3
  expect(bodyCellStarts[3]).toBe(4); // location cell at visual position 4
});

test('table column reorder - body cells stay vertically aligned after reorder', async ({
  page,
}) => {
  await loadTable(page);

  // Move "id" (index 0) one position to the right (past "name").
  await dragHeader(page, 0, 2);

  // After a reorder the DOM order of the cells (id, name, …) no longer matches
  // their visual column order. Each cell must still render on the same row — a
  // missing explicit grid-row let CSS grid auto-placement push the mis-ordered
  // cell onto an implicit extra row, offsetting it vertically.
  const tops = await page.evaluate(() => {
    const table = document.querySelector('ngn-table table');
    if (!table) return [];
    const firstRow = Array.from(table.querySelectorAll('tbody tr')).find(tr =>
      tr.querySelector('td')
    );
    if (!firstRow) return [];
    return Array.from(firstRow.querySelectorAll('td')).map(c =>
      Math.round(c.getBoundingClientRect().top)
    );
  });

  expect(tops.length).toBe(4);
  // All cells of the row share a single vertical position.
  expect(new Set(tops).size).toBe(1);
});

test('table column reorder - empty columnOrder uses natural order', async ({ page }) => {
  await loadTable(page, { columnOrder: [] });

  const colStarts = await getColumnStarts(page);
  // Natural registration order: id(1), name(2), department(3), location(4)
  expect(colStarts).toEqual([1, 2, 3, 4]);
});
