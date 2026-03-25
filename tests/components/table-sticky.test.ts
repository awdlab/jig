import test, { expect } from '@playwright/test';

import { loadComponent } from '../helper/load-component';
import type { TemplateType } from '../../apps/test-wrapper/src/app/window.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

function generateRows(count: number) {
  const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'];
  const locations = ['NYC', 'LA', 'Chicago', 'Austin', 'Seattle'];
  const roles = ['Manager', 'Senior', 'Junior', 'Lead', 'Director'];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Person ${i + 1}`,
    email: `person${i + 1}@example.com`,
    department: departments[i % departments.length],
    role: roles[i % roles.length],
    location: locations[i % locations.length],
    salary: `$${50000 + i * 1000}`,
    startDate: `2024-01-${String((i % 28) + 1).padStart(2, '0')}`,
  }));
}

// Use resizable + push mode with explicit column widths to force horizontal overflow
const STICKY_TEMPLATE: TemplateType = {
  template: `
    <ngn-table
      #table
      style="height: 400px; width: 600px"
      [rows]="inputs().rows"
      [fieldId]="'id'"
      [resizable]="true"
      [resizeMode]="'push'"
    >
      <ng-template #header>
        <tr ngnTableHeadTr>
          <th [ngnTableTh]="'name'" [size]="'150px'" ngnTableStickyColumn="left">Name</th>
          <th [ngnTableTh]="'email'" [size]="'200px'">Email</th>
          <th [ngnTableTh]="'department'" [size]="'150px'">Department</th>
          <th [ngnTableTh]="'role'" [size]="'150px'">Role</th>
          <th [ngnTableTh]="'location'" [size]="'150px'">Location</th>
          <th [ngnTableTh]="'salary'" [size]="'150px'">Salary</th>
          <th [ngnTableTh]="'startDate'" [size]="'150px'">Start Date</th>
          <th [ngnTableTh]="'actions'" [size]="'120px'" ngnTableStickyColumn="right">Actions</th>
        </tr>
      </ng-template>
      <ng-template #body let-row [ngnTemplate]="table.templateTypes.body">
        <tr [ngnTableBodyTr]="row">
          <td ngnTableTd ngnTableStickyColumn="left">{{ row.data.name }}</td>
          <td ngnTableTd>{{ row.data.email }}</td>
          <td ngnTableTd>{{ row.data.department }}</td>
          <td ngnTableTd>{{ row.data.role }}</td>
          <td ngnTableTd>{{ row.data.location }}</td>
          <td ngnTableTd>{{ row.data.salary }}</td>
          <td ngnTableTd>{{ row.data.startDate }}</td>
          <td ngnTableTd ngnTableStickyColumn="right">Edit</td>
        </tr>
      </ng-template>
    </ngn-table>`,
  imports: ['tableModule', 'ngnTemplate'],
};

const DEFAULT_INPUTS = {
  rows: generateRows(30),
};

async function loadTable(
  page: import('@playwright/test').Page,
  template?: TemplateType,
  inputOverrides?: Partial<typeof DEFAULT_INPUTS>
) {
  const handle = await loadComponent(page, template ?? STICKY_TEMPLATE, {
    inputs: { ...DEFAULT_INPUTS, ...inputOverrides },
  });
  await expect(page.locator('ngn-table')).toBeVisible({ timeout: 10000 });
  await page.waitForTimeout(500);
  return handle;
}

async function scrollTableHorizontally(page: import('@playwright/test').Page, pixels: number) {
  await page.evaluate(px => {
    const table = document.querySelector('ngn-table table');
    if (table) table.scrollLeft += px;
  }, pixels);
  await page.waitForTimeout(200);
}

async function getScrollLeft(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const table = document.querySelector('ngn-table table');
    return table?.scrollLeft ?? 0;
  });
}

// ── Tests ────────────────────────────────────────────────────────────────────

test('sticky left column stays visible on horizontal scroll', async ({ page }) => {
  await loadTable(page);

  // Verify table can scroll (total column width > 600px container)
  await scrollTableHorizontally(page, 500);
  const scrollLeft = await getScrollLeft(page);
  expect(scrollLeft).toBeGreaterThan(0);

  // Name header (sticky-left) should still be visible within the table viewport
  const nameVisible = await page.evaluate(() => {
    const ths = document.querySelectorAll('ngn-table thead th');
    // Find the first th (Name - sticky left)
    const nameTh = ths[0];
    if (!nameTh) return false;
    const rect = nameTh.getBoundingClientRect();
    const tableRect = nameTh.closest('table')!.getBoundingClientRect();
    return rect.left >= tableRect.left - 1 && rect.left < tableRect.right;
  });
  expect(nameVisible).toBe(true);
});

test('sticky right column stays visible on horizontal scroll', async ({ page }) => {
  await loadTable(page);

  // Actions header (sticky-right) should be visible at start
  const actionsVisibleInitially = await page.evaluate(() => {
    const ths = document.querySelectorAll('ngn-table thead th');
    const actionsTh = ths[ths.length - 1];
    if (!actionsTh) return false;
    const rect = actionsTh.getBoundingClientRect();
    const tableRect = actionsTh.closest('table')!.getBoundingClientRect();
    return rect.right <= tableRect.right + 1 && rect.right > tableRect.left;
  });
  expect(actionsVisibleInitially).toBe(true);

  // Scroll right and check it's still visible
  await scrollTableHorizontally(page, 300);
  const actionsStillVisible = await page.evaluate(() => {
    const ths = document.querySelectorAll('ngn-table thead th');
    const actionsTh = ths[ths.length - 1];
    if (!actionsTh) return false;
    const rect = actionsTh.getBoundingClientRect();
    const tableRect = actionsTh.closest('table')!.getBoundingClientRect();
    return rect.right <= tableRect.right + 1 && rect.right > tableRect.left;
  });
  expect(actionsStillVisible).toBe(true);
});

test('multiple sticky-left columns maintain correct offsets', async ({ page }) => {
  const multiLeftTemplate: TemplateType = {
    template: `
      <ngn-table
        #table
        style="height: 400px; width: 600px"
        [rows]="inputs().rows"
        [fieldId]="'id'"
        [resizable]="true"
        [resizeMode]="'push'"
      >
        <ng-template #header>
          <tr ngnTableHeadTr>
            <th [ngnTableTh]="'id'" [size]="'80px'" ngnTableStickyColumn="left">ID</th>
            <th [ngnTableTh]="'name'" [size]="'150px'" ngnTableStickyColumn="left">Name</th>
            <th [ngnTableTh]="'email'" [size]="'200px'">Email</th>
            <th [ngnTableTh]="'department'" [size]="'200px'">Department</th>
            <th [ngnTableTh]="'role'" [size]="'200px'">Role</th>
            <th [ngnTableTh]="'location'" [size]="'200px'">Location</th>
          </tr>
        </ng-template>
        <ng-template #body let-row [ngnTemplate]="table.templateTypes.body">
          <tr [ngnTableBodyTr]="row">
            <td ngnTableTd ngnTableStickyColumn="left">{{ row.data.id }}</td>
            <td ngnTableTd ngnTableStickyColumn="left">{{ row.data.name }}</td>
            <td ngnTableTd>{{ row.data.email }}</td>
            <td ngnTableTd>{{ row.data.department }}</td>
            <td ngnTableTd>{{ row.data.role }}</td>
            <td ngnTableTd>{{ row.data.location }}</td>
          </tr>
        </ng-template>
      </ngn-table>`,
    imports: ['tableModule', 'ngnTemplate'],
  };

  await loadTable(page, multiLeftTemplate);

  // Scroll right
  await scrollTableHorizontally(page, 400);

  // Both sticky columns should be visible and offset correctly
  const offsets = await page.evaluate(() => {
    const ths = document.querySelectorAll('ngn-table thead th');
    const th0 = ths[0] as HTMLElement; // ID
    const th1 = ths[1] as HTMLElement; // Name
    if (!th0 || !th1) return null;
    return {
      idLeft: parseFloat(th0.style.left || '0'),
      nameLeft: parseFloat(th1.style.left || '0'),
      idWidth: th0.getBoundingClientRect().width,
    };
  });

  expect(offsets).not.toBeNull();
  // First sticky column should have left: 0
  expect(offsets!.idLeft).toBe(0);
  // Second sticky column's left offset should be >= first column's width
  expect(offsets!.nameLeft).toBeGreaterThanOrEqual(offsets!.idWidth - 1);
});

test('sticky columns with checkbox selection', async ({ page }) => {
  const selectionTemplate: TemplateType = {
    template: `
      <ngn-table
        #table
        style="height: 400px; width: 600px"
        [rows]="inputs().rows"
        [fieldId]="'id'"
        [selectionMode]="'multi'"
        [resizable]="true"
        [resizeMode]="'push'"
      >
        <ng-template #header>
          <tr ngnTableHeadTr>
            <th ngnTableSelectionColumn ngnTableStickyColumn="left"></th>
            <th [ngnTableTh]="'name'" [size]="'150px'" ngnTableStickyColumn="left">Name</th>
            <th [ngnTableTh]="'email'" [size]="'200px'">Email</th>
            <th [ngnTableTh]="'department'" [size]="'200px'">Department</th>
            <th [ngnTableTh]="'role'" [size]="'150px'">Role</th>
            <th [ngnTableTh]="'location'" [size]="'150px'">Location</th>
            <th [ngnTableTh]="'salary'" [size]="'150px'">Salary</th>
          </tr>
        </ng-template>
        <ng-template #body let-row [ngnTemplate]="table.templateTypes.body">
          <tr [ngnTableBodyTr]="row">
            <td ngnTableSelectionColumn ngnTableStickyColumn="left"></td>
            <td ngnTableTd ngnTableStickyColumn="left">{{ row.data.name }}</td>
            <td ngnTableTd>{{ row.data.email }}</td>
            <td ngnTableTd>{{ row.data.department }}</td>
            <td ngnTableTd>{{ row.data.role }}</td>
            <td ngnTableTd>{{ row.data.location }}</td>
            <td ngnTableTd>{{ row.data.salary }}</td>
          </tr>
        </ng-template>
      </ngn-table>`,
    imports: ['tableModule', 'ngnTemplate', 'tableSelectionColumn'],
  };

  await loadTable(page, selectionTemplate);

  // Checkbox column should exist
  const checkboxCount = await page.locator('ngn-checkbox').count();
  expect(checkboxCount).toBeGreaterThan(0);

  // Scroll right and verify sticky name column accounts for checkbox width
  await scrollTableHorizontally(page, 400);

  const stickyNameOffset = await page.evaluate(() => {
    const ths = document.querySelectorAll('ngn-table thead th');
    for (const th of ths) {
      const htmlTh = th as HTMLElement;
      if (htmlTh.style.left && htmlTh.textContent?.trim() === 'Name') {
        return parseFloat(htmlTh.style.left);
      }
    }
    return -1;
  });

  // The sticky name column should have a non-zero left offset (accounting for checkbox column)
  expect(stickyNameOffset).toBeGreaterThan(0);
});

test('sticky columns prevent reorder drag', async ({ page }) => {
  const reorderTemplate: TemplateType = {
    template: `
      <ngn-table
        #table
        style="height: 400px; width: 600px"
        [rows]="inputs().rows"
        [fieldId]="'id'"
        [reorderable]="true"
        [resizable]="true"
        [resizeMode]="'push'"
      >
        <ng-template #header>
          <tr ngnTableHeadTr>
            <th [ngnTableTh]="'name'" [size]="'150px'" ngnTableStickyColumn="left" ngnTableReorderableColumn>Name</th>
            <th [ngnTableTh]="'email'" [size]="'200px'" ngnTableReorderableColumn>Email</th>
            <th [ngnTableTh]="'department'" [size]="'200px'" ngnTableReorderableColumn>Department</th>
            <th [ngnTableTh]="'role'" [size]="'200px'" ngnTableReorderableColumn>Role</th>
          </tr>
        </ng-template>
        <ng-template #body let-row [ngnTemplate]="table.templateTypes.body">
          <tr [ngnTableBodyTr]="row">
            <td ngnTableTd ngnTableStickyColumn="left">{{ row.data.name }}</td>
            <td ngnTableTd>{{ row.data.email }}</td>
            <td ngnTableTd>{{ row.data.department }}</td>
            <td ngnTableTd>{{ row.data.role }}</td>
          </tr>
        </ng-template>
      </ngn-table>`,
    imports: ['tableModule', 'ngnTemplate'],
  };

  await loadTable(page, reorderTemplate);

  // Get initial column order
  const initialStarts = await page.evaluate(() => {
    const headers = document.querySelectorAll('ngn-table th');
    return Array.from(headers).map(h =>
      (h as HTMLElement).style.getPropertyValue('--ngn-table-column-index')
    );
  });

  // Try to drag the sticky Name column (should be prevented)
  const headers = page.locator('ngn-table th');
  const nameHeader = headers.nth(0);
  const emailHeader = headers.nth(1);

  const nameBox = await nameHeader.boundingBox();
  const emailBox = await emailHeader.boundingBox();
  expect(nameBox).not.toBeNull();
  expect(emailBox).not.toBeNull();

  const startX = nameBox!.x + nameBox!.width / 2;
  const startY = nameBox!.y + nameBox!.height / 2;
  const endX = emailBox!.x + emailBox!.width / 2;

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  for (let i = 1; i <= 15; i++) {
    await page.mouse.move(startX + ((endX - startX) * i) / 15, startY);
    await page.waitForTimeout(10);
  }
  await page.mouse.up();
  await page.waitForTimeout(200);

  // Column order should be unchanged
  const afterStarts = await page.evaluate(() => {
    const headers = document.querySelectorAll('ngn-table th');
    return Array.from(headers).map(h =>
      (h as HTMLElement).style.getPropertyValue('--ngn-table-column-index')
    );
  });
  expect(afterStarts).toEqual(initialStarts);
});

test('sticky columns with column resizing - offsets recalculate', async ({ page }) => {
  const resizableTemplate: TemplateType = {
    template: `
      <ngn-table
        #table
        style="height: 400px; width: 800px"
        [rows]="inputs().rows"
        [fieldId]="'id'"
        [resizable]="true"
        [resizeMode]="'push'"
      >
        <ng-template #header>
          <tr ngnTableHeadTr>
            <th [ngnTableTh]="'id'" [size]="'80px'" ngnTableStickyColumn="left">ID</th>
            <th [ngnTableTh]="'name'" [size]="'150px'" ngnTableStickyColumn="left">Name</th>
            <th [ngnTableTh]="'email'" [size]="'200px'">Email</th>
            <th [ngnTableTh]="'department'" [size]="'200px'">Department</th>
            <th [ngnTableTh]="'role'" [size]="'200px'">Role</th>
            <th [ngnTableTh]="'location'" [size]="'200px'">Location</th>
          </tr>
        </ng-template>
        <ng-template #body let-row [ngnTemplate]="table.templateTypes.body">
          <tr [ngnTableBodyTr]="row">
            <td ngnTableTd ngnTableStickyColumn="left">{{ row.data.id }}</td>
            <td ngnTableTd ngnTableStickyColumn="left">{{ row.data.name }}</td>
            <td ngnTableTd>{{ row.data.email }}</td>
            <td ngnTableTd>{{ row.data.department }}</td>
            <td ngnTableTd>{{ row.data.role }}</td>
            <td ngnTableTd>{{ row.data.location }}</td>
          </tr>
        </ng-template>
      </ngn-table>`,
    imports: ['tableModule', 'ngnTemplate'],
  };

  await loadTable(page, resizableTemplate);

  // Get initial offset of second sticky column
  const initialNameLeft = await page.evaluate(() => {
    const ths = document.querySelectorAll('ngn-table thead th');
    return parseFloat((ths[1] as HTMLElement)?.style.left || '0');
  });

  // Resize the first column (ID) by dragging its resize handle
  const resizeHandle = page.locator('[class*="resize-handle"]').first();
  const handleBox = await resizeHandle.boundingBox();
  if (handleBox) {
    await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
    await page.mouse.down();
    // Drag 100px to the right (large drag to ensure visible change)
    for (let i = 1; i <= 20; i++) {
      await page.mouse.move(
        handleBox.x + handleBox.width / 2 + i * 5,
        handleBox.y + handleBox.height / 2
      );
      await page.waitForTimeout(10);
    }
    await page.mouse.up();
    // Wait for ResizeObserver to fire and recalculate offsets
    await page.waitForTimeout(1000);
  }

  // After resize, the second sticky column's left offset should have changed
  const afterNameLeft = await page.evaluate(() => {
    const ths = document.querySelectorAll('ngn-table thead th');
    return parseFloat((ths[1] as HTMLElement)?.style.left || '0');
  });

  // The offset should have increased after resize (first column grew)
  expect(afterNameLeft).toBeGreaterThan(initialNameLeft);
});

test('shadow classes toggle on scroll', async ({ page }) => {
  await loadTable(page);

  // Initially, should not have left shadow class (at scroll position 0)
  const initialLeftShadow = await page.evaluate(() => {
    const root = document.querySelector('ngn-table');
    return root?.className.includes('sticky-scrolled-left') ?? false;
  });
  expect(initialLeftShadow).toBe(false);

  // Scroll right
  await scrollTableHorizontally(page, 200);

  // Should now have left shadow class
  const afterScrollLeftShadow = await page.evaluate(() => {
    const root = document.querySelector('ngn-table');
    return root?.className.includes('sticky-scrolled-left') ?? false;
  });
  expect(afterScrollLeftShadow).toBe(true);
});

test('sticky columns with virtual scrolling', async ({ page }) => {
  const virtualTemplate: TemplateType = {
    template: `
      <ngn-table
        #table
        style="height: 400px; width: 600px"
        [rows]="inputs().rows"
        [fieldId]="'id'"
        [virtual]="true"
        [rowHeight]="40"
        [resizable]="true"
        [resizeMode]="'push'"
      >
        <ng-template #header>
          <tr ngnTableHeadTr>
            <th [ngnTableTh]="'name'" [size]="'150px'" ngnTableStickyColumn="left">Name</th>
            <th [ngnTableTh]="'email'" [size]="'200px'">Email</th>
            <th [ngnTableTh]="'department'" [size]="'200px'">Department</th>
            <th [ngnTableTh]="'role'" [size]="'150px'">Role</th>
            <th [ngnTableTh]="'location'" [size]="'150px'">Location</th>
            <th [ngnTableTh]="'salary'" [size]="'150px'">Salary</th>
          </tr>
        </ng-template>
        <ng-template #body let-row [ngnTemplate]="table.templateTypes.body">
          <tr [ngnTableBodyTr]="row">
            <td ngnTableTd ngnTableStickyColumn="left">{{ row.data.name }}</td>
            <td ngnTableTd>{{ row.data.email }}</td>
            <td ngnTableTd>{{ row.data.department }}</td>
            <td ngnTableTd>{{ row.data.role }}</td>
            <td ngnTableTd>{{ row.data.location }}</td>
            <td ngnTableTd>{{ row.data.salary }}</td>
          </tr>
        </ng-template>
      </ngn-table>`,
    imports: ['tableModule', 'ngnTemplate'],
  };

  await loadTable(page, virtualTemplate, { rows: generateRows(500) });

  // Scroll down vertically
  await page.evaluate(() => {
    const table = document.querySelector('ngn-table table');
    if (table) table.scrollTop = 2000;
  });
  await page.waitForTimeout(300);

  // Scroll right
  await scrollTableHorizontally(page, 400);

  // Sticky column should still be visible
  const nameVisible = await page.evaluate(() => {
    const tds = document.querySelectorAll('ngn-table tbody td');
    // Find a sticky td
    for (const td of tds) {
      if ((td as HTMLElement).style.left !== undefined && (td as HTMLElement).style.left !== '') {
        const rect = td.getBoundingClientRect();
        const tableRect = td.closest('table')!.getBoundingClientRect();
        return rect.left >= tableRect.left - 1 && rect.left < tableRect.right;
      }
    }
    return false;
  });
  expect(nameVisible).toBe(true);
});

test('sticky columns with grouping - group headers span full width', async ({ page }) => {
  const groupingTemplate: TemplateType = {
    template: `
      <ngn-table
        #table
        style="height: 400px; width: 600px"
        [rows]="inputs().rows"
        [fieldId]="'id'"
        [groupBy]="'department'"
        [expandedGroups]="['Engineering', 'Sales']"
        [resizable]="true"
        [resizeMode]="'push'"
      >
        <ng-template #header>
          <tr ngnTableHeadTr>
            <th [ngnTableTh]="'name'" [size]="'150px'" ngnTableStickyColumn="left">Name</th>
            <th [ngnTableTh]="'email'" [size]="'200px'">Email</th>
            <th [ngnTableTh]="'department'" [size]="'200px'">Department</th>
            <th [ngnTableTh]="'role'" [size]="'150px'">Role</th>
            <th [ngnTableTh]="'location'" [size]="'150px'">Location</th>
            <th [ngnTableTh]="'salary'" [size]="'150px'">Salary</th>
          </tr>
        </ng-template>
        <ng-template #body let-row [ngnTemplate]="table.templateTypes.body">
          <tr [ngnTableBodyTr]="row">
            <td ngnTableTd ngnTableStickyColumn="left">{{ row.data.name }}</td>
            <td ngnTableTd>{{ row.data.email }}</td>
            <td ngnTableTd>{{ row.data.department }}</td>
            <td ngnTableTd>{{ row.data.role }}</td>
            <td ngnTableTd>{{ row.data.location }}</td>
            <td ngnTableTd>{{ row.data.salary }}</td>
          </tr>
        </ng-template>
      </ngn-table>`,
    imports: ['tableModule', 'ngnTemplate'],
  };

  await loadTable(page, groupingTemplate);

  // Group headers should exist
  const groupHeaders = page.locator('[class*="group-header-cell"]');
  await expect(groupHeaders.first()).toBeVisible();

  // Group header should span all columns (grid-column: 1 / -1)
  const groupHeaderSpansAll = await page.evaluate(() => {
    const groupHeader = document.querySelector('[class*="group-header-cell"]');
    if (!groupHeader) return false;
    const style = getComputedStyle(groupHeader);
    return style.gridColumn === '1 / -1' || style.gridColumnStart === '1';
  });
  expect(groupHeaderSpansAll).toBe(true);

  // Scroll right and verify sticky columns still work in data rows
  await scrollTableHorizontally(page, 300);

  const stickyDataCellVisible = await page.evaluate(() => {
    const dataCells = document.querySelectorAll('ngn-table tbody td');
    for (const cell of dataCells) {
      const htmlCell = cell as HTMLElement;
      if (htmlCell.style.left) {
        const rect = cell.getBoundingClientRect();
        const tableRect = cell.closest('table')!.getBoundingClientRect();
        return rect.left >= tableRect.left - 1 && rect.left < tableRect.right;
      }
    }
    return false;
  });
  expect(stickyDataCellVisible).toBe(true);
});
