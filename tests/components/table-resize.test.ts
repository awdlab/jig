import test, { expect } from '@playwright/test';

import { loadComponent } from '../helper/load-component';
import type { TemplateType } from '../../apps/test-wrapper/src/app/window.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

const TABLE_TEMPLATE: TemplateType = {
  template: `
    <jig-table
      #table
      style="height: 400px; width: 100%"
      [rows]="inputs().rows"
      [fieldId]="'id'"
      [resizable]="true"
      [resizeMode]="inputs().resizeMode"
      [lockSizes]="inputs().lockSizes"
    >
      <ng-template #header>
        <tr ngnTableHeadTr>
          <th [ngnTableTh]="table.column('id')" [size]="'100px'">ID</th>
          <th [ngnTableTh]="table.column('name')" [size]="'2fr'">Name</th>
          <th [ngnTableTh]="table.column('department')" [size]="'1fr'">Department</th>
          <th [ngnTableTh]="table.column('location')" [size]="'1fr'">Location</th>
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
    </jig-table>`,
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
  resizeMode: 'adjacent' as string,
  lockSizes: true,
};

async function loadTable(
  page: import('@playwright/test').Page,
  inputOverrides?: Partial<typeof DEFAULT_INPUTS>
) {
  const handle = await loadComponent(page, TABLE_TEMPLATE, {
    inputs: { ...DEFAULT_INPUTS, ...inputOverrides },
  });
  await expect(page.locator('jig-table')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('[class*="resize-handle"]').first()).toBeAttached({ timeout: 5000 });
  return handle;
}

async function dragHandle(
  page: import('@playwright/test').Page,
  handle: import('@playwright/test').Locator,
  deltaX: number
) {
  await handle.scrollIntoViewIfNeeded();
  await page.waitForTimeout(100);

  const handleBox = await handle.boundingBox();
  expect(handleBox).not.toBeNull();
  const startX = handleBox!.x + handleBox!.width / 2;
  const startY = handleBox!.y + handleBox!.height / 2;

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  const steps = 10;
  for (let i = 1; i <= steps; i++) {
    await page.mouse.move(startX + (deltaX * i) / steps, startY);
    await page.waitForTimeout(10);
  }
  await page.mouse.up();
  await page.waitForTimeout(100);
}

async function getColumnWidths(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const table = document.querySelector('jig-table table');
    if (!table) return [];
    const headers = table.querySelectorAll('th');
    return Array.from(headers).map(h => Math.round(h.getBoundingClientRect().width));
  });
}

// ── Tests ────────────────────────────────────────────────────────────────────

test('table column resize - adjacent mode', async ({ page }) => {
  await loadTable(page);

  const resizeHandles = page.locator('[class*="resize-handle"]');
  const initialWidths = await getColumnWidths(page);
  expect(initialWidths[0]).toBeCloseTo(100, -1);
  expect(initialWidths.length).toBe(4);

  // Drag ID column handle 100px right
  await dragHandle(page, resizeHandles.first(), 100);

  const newWidths = await getColumnWidths(page);
  expect(newWidths[0]!).toBeGreaterThan(initialWidths[0]! + 80);
  expect(newWidths[1]!).toBeLessThan(initialWidths[1]! - 80);
  // Department and Location unchanged (adjacent mode)
  expect(newWidths[2]).toBeCloseTo(initialWidths[2]!, -1);
  expect(newWidths[3]).toBeCloseTo(initialWidths[3]!, -1);

  // Total width stays the same
  const totalBefore = initialWidths.reduce((a, b) => a + b, 0);
  const totalAfter = newWidths.reduce((a, b) => a + b, 0);
  expect(totalAfter).toBeCloseTo(totalBefore, -1);
});

test('table column resize - min constraint prevents collapse', async ({ page }) => {
  await loadTable(page);

  const resizeHandles = page.locator('[class*="resize-handle"]');

  // Drag Name handle far right to push Department to its min
  await dragHandle(page, resizeHandles.nth(1), 200);

  const newWidths = await getColumnWidths(page);
  // Department should not go below 40px (default minSize)
  expect(newWidths[2]!).toBeGreaterThanOrEqual(38); // 2px tolerance
});

test('table column resize - push mode grows total width', async ({ page }) => {
  const handle = await loadTable(page, { resizeMode: 'push' });

  const resizeHandles = page.locator('[class*="resize-handle"]');
  const initialWidths = await getColumnWidths(page);

  // Drag ID handle 150px right
  await dragHandle(page, resizeHandles.first(), 150);

  const newWidths = await getColumnWidths(page);
  // ID grew ~150px
  expect(newWidths[0]!).toBeGreaterThan(initialWidths[0]! + 120);
  // Other columns unchanged
  expect(newWidths[1]).toBeCloseTo(initialWidths[1]!, -1);
  expect(newWidths[2]).toBeCloseTo(initialWidths[2]!, -1);
  expect(newWidths[3]).toBeCloseTo(initialWidths[3]!, -1);

  // The table element itself should have overflow: auto
  const overflowX = await page.evaluate(() => {
    const table = document.querySelector('jig-table > table');
    return table ? getComputedStyle(table).overflowX : '';
  });
  expect(overflowX).toBe('auto');
});

test('table column resize - multiple sequential drags work correctly', async ({ page }) => {
  await loadTable(page);

  const resizeHandles = page.locator('[class*="resize-handle"]');
  const initialWidths = await getColumnWidths(page);
  const initialTotal = initialWidths.reduce((a, b) => a + b, 0);

  // First drag: ID +50px
  await dragHandle(page, resizeHandles.first(), 50);
  // Second drag: Name +30px
  await dragHandle(page, resizeHandles.nth(1), 30);

  const finalWidths = await getColumnWidths(page);
  const finalTotal = finalWidths.reduce((a, b) => a + b, 0);

  expect(finalTotal).toBeCloseTo(initialTotal, -1);
  expect(finalWidths[0]!).toBeGreaterThan(initialWidths[0]!);
});

test('table column resize - proportional mode locks resized column', async ({ page }) => {
  await loadTable(page, { resizeMode: 'proportional' });

  const resizeHandles = page.locator('[class*="resize-handle"]');
  const initialWidths = await getColumnWidths(page);

  // Drag ID handle +100px
  await dragHandle(page, resizeHandles.first(), 100);

  const newWidths = await getColumnWidths(page);
  expect(newWidths[0]!).toBeGreaterThan(initialWidths[0]! + 80);
  expect(newWidths[1]!).toBeLessThan(initialWidths[1]!);
  expect(newWidths[1]!).toBeGreaterThan(0);

  // Grid template should show ID as px, others as minmax(50px, Xfr)
  const gridCols = await page.evaluate(() => {
    const table = document.querySelector('jig-table table') as HTMLElement | null;
    return table?.style.gridTemplateColumns || getComputedStyle(table!).gridTemplateColumns;
  });
  expect(gridCols).toMatch(/^\d+(\.\d+)?px/); // ID is px
  expect(gridCols).toContain('minmax(50px,'); // Others use minmax
});

test('table column resize - proportional mode min width floor', async ({ page }) => {
  await loadTable(page, { resizeMode: 'proportional' });

  const resizeHandles = page.locator('[class*="resize-handle"]');

  // Drag ID handle very far right to push others to minimum
  await dragHandle(page, resizeHandles.first(), 700);

  const widths = await getColumnWidths(page);
  // All other columns should be >= 50px (the default min)
  expect(widths[1]!).toBeGreaterThanOrEqual(48); // 2px tolerance
  expect(widths[2]!).toBeGreaterThanOrEqual(48);
  expect(widths[3]!).toBeGreaterThanOrEqual(48);

  // No overflow
  const overflow = await page.evaluate(() => {
    const el = document.querySelector('jig-table');
    return el ? el.scrollWidth > el.clientWidth : false;
  });
  expect(overflow).toBe(false);
});

test('table column resize - proportional mode restores proportions on shrink back', async ({
  page,
}) => {
  await loadTable(page, { resizeMode: 'proportional' });

  const resizeHandles = page.locator('[class*="resize-handle"]');
  const initialWidths = await getColumnWidths(page);

  // Grow ID far, then shrink back the same amount
  await dragHandle(page, resizeHandles.first(), 400);
  await dragHandle(page, page.locator('[class*="resize-handle"]').first(), -400);

  const restoredWidths = await getColumnWidths(page);
  expect(restoredWidths[0]).toBeCloseTo(initialWidths[0]!, -1);
  expect(restoredWidths[1]).toBeCloseTo(initialWidths[1]!, -1);
  expect(restoredWidths[2]).toBeCloseTo(initialWidths[2]!, -1);
  expect(restoredWidths[3]).toBeCloseTo(initialWidths[3]!, -1);
});

test('table column resize - adjacent mode no overflow even with extreme drag', async ({ page }) => {
  await loadTable(page);

  const resizeHandles = page.locator('[class*="resize-handle"]');
  const initialWidths = await getColumnWidths(page);
  const initialTotal = initialWidths.reduce((a, b) => a + b, 0);

  await dragHandle(page, resizeHandles.first(), 800);

  const widths = await getColumnWidths(page);
  const total = widths.reduce((a, b) => a + b, 0);
  expect(total).toBeCloseTo(initialTotal, -1);

  const overflow = await page.evaluate(() => {
    const el = document.querySelector('jig-table');
    return el ? el.scrollWidth > el.clientWidth : false;
  });
  expect(overflow).toBe(false);
});

test('table column resize - proportional mode no overflow even with extreme drag', async ({
  page,
}) => {
  await loadTable(page, { resizeMode: 'proportional' });

  const resizeHandles = page.locator('[class*="resize-handle"]');

  await dragHandle(page, resizeHandles.first(), 800);

  const overflow = await page.evaluate(() => {
    const el = document.querySelector('jig-table');
    return el ? el.scrollWidth > el.clientWidth : false;
  });
  expect(overflow).toBe(false);

  const widths = await getColumnWidths(page);
  for (const w of widths) {
    expect(w).toBeGreaterThanOrEqual(48); // 2px tolerance
  }
});

test('table column resize - last column has no handle in adjacent and proportional modes', async ({
  page,
}) => {
  await loadTable(page);

  // Adjacent mode: last column handle hidden
  const adjacentHandles = await page.evaluate(() => {
    const handles = document.querySelectorAll('[class*="resize-handle"]');
    return Array.from(handles).map(h => getComputedStyle(h).display !== 'none');
  });
  expect(adjacentHandles).toEqual([true, true, true, false]);

  // Proportional mode: last column handle also hidden
  await loadTable(page, { resizeMode: 'proportional' });

  const proportionalHandles = await page.evaluate(() => {
    const handles = document.querySelectorAll('[class*="resize-handle"]');
    return Array.from(handles).map(h => getComputedStyle(h).display !== 'none');
  });
  expect(proportionalHandles).toEqual([true, true, true, false]);

  // Push mode: ALL handles visible
  await loadTable(page, { resizeMode: 'push' });

  const pushHandles = await page.evaluate(() => {
    const handles = document.querySelectorAll('[class*="resize-handle"]');
    return Array.from(handles).map(h => getComputedStyle(h).display !== 'none');
  });
  expect(pushHandles).toEqual([true, true, true, true]);
});

test('table column resize - push mode no overflow on initial render', async ({ page }) => {
  await loadTable(page, { resizeMode: 'push' });

  const overflow = await page.evaluate(() => {
    const el = document.querySelector('jig-table');
    return el ? el.scrollWidth > el.clientWidth : false;
  });
  expect(overflow).toBe(false);
});

test('table column resize - no-op click does not trigger resize state', async ({ page }) => {
  await loadTable(page, { resizeMode: 'push' });

  const initialWidths = await getColumnWidths(page);

  // Click handle without dragging
  const handle = page.locator('[class*="resize-handle"]').first();
  await handle.scrollIntoViewIfNeeded();
  const box = await handle.boundingBox();
  await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
  await page.mouse.down();
  await page.mouse.up();
  await page.waitForTimeout(200);

  const widths = await getColumnWidths(page);
  expect(widths[0]).toBeCloseTo(initialWidths[0]!, -1);
  expect(widths[1]).toBeCloseTo(initialWidths[1]!, -1);

  const overflow = await page.evaluate(() => {
    const el = document.querySelector('jig-table');
    return el ? el.scrollWidth > el.clientWidth : false;
  });
  expect(overflow).toBe(false);
});

// ── Double-click auto-size ────────────────────────────────────────────────

test('table column resize - double-click auto-sizes column to content', async ({ page }) => {
  await loadTable(page);

  const resizeHandles = page.locator('[class*="resize-handle"]');
  const initialWidths = await getColumnWidths(page);

  // The ID column is set to 100px, but its content ("1", "2", ..., "20") is much narrower.
  // The Name column has "Person 1" .. "Person 20" content with a 2fr size — it's wider than needed.
  // Double-clicking the Name column's resize handle should shrink it to fit content.
  const nameHandle = resizeHandles.nth(1);
  await nameHandle.dblclick();
  await page.waitForTimeout(200);

  const newWidths = await getColumnWidths(page);
  // Name column should have changed from its initial width
  expect(newWidths[1]).not.toBeCloseTo(initialWidths[1]!, -1);
  // Name column should be at least 50px (min constraint)
  expect(newWidths[1]!).toBeGreaterThanOrEqual(48);
});

test('table column resize - double-click respects min size constraint', async ({ page }) => {
  await loadTable(page);

  const resizeHandles = page.locator('[class*="resize-handle"]');

  // Double-click ID column handle — content is very narrow ("1".."20")
  // but should not go below 50px minimum
  await resizeHandles.first().dblclick();
  await page.waitForTimeout(200);

  const widths = await getColumnWidths(page);
  expect(widths[0]!).toBeGreaterThanOrEqual(48); // 2px tolerance for 50px min
});

test('table column resize - double-click works in push mode', async ({ page }) => {
  await loadTable(page, { resizeMode: 'push' });

  const resizeHandles = page.locator('[class*="resize-handle"]');
  const initialWidths = await getColumnWidths(page);

  // Double-click the Name column handle
  await resizeHandles.nth(1).dblclick();
  await page.waitForTimeout(200);

  const newWidths = await getColumnWidths(page);
  // Name column should have auto-sized
  expect(newWidths[1]).not.toBeCloseTo(initialWidths[1]!, -1);
  expect(newWidths[1]!).toBeGreaterThanOrEqual(48);
});
