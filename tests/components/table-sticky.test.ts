import test, { expect } from '@playwright/test';

import { loadComponent } from '../helper/load-component';
import type { TemplateType } from '../../apps/test-wrapper/src/app/window.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

const STICKY_TABLE_TEMPLATE: TemplateType = {
  template: `
    <ngn-table
      #table
      style="height: 400px; width: 600px"
      [rows]="inputs().rows"
      [fieldId]="'id'"
      [reorderable]="inputs().reorderable"
      [resizable]="inputs().resizable"
      [(columnOrder)]="inputs().columnOrder"
    >
      <ng-template #header>
        <tr ngnTableHeadTr>
          <th [ngnTableTh]="table.column('id')" [ngnTableStickyColumn]="'start'" ngnTableReorderableColumn [size]="'80px'">ID</th>
          <th [ngnTableTh]="table.column('name')" [ngnTableStickyColumn]="'start'" ngnTableReorderableColumn [size]="'150px'">Name</th>
          <th [ngnTableTh]="table.column('email')" ngnTableReorderableColumn [size]="'200px'">Email</th>
          <th [ngnTableTh]="table.column('department')" ngnTableReorderableColumn [size]="'150px'">Department</th>
          <th [ngnTableTh]="table.column('role')" ngnTableReorderableColumn [size]="'130px'">Role</th>
          <th [ngnTableTh]="table.column('salary')" [ngnTableStickyColumn]="'end'" ngnTableReorderableColumn [size]="'120px'">Salary</th>
        </tr>
      </ng-template>
      <ng-template #body let-row [ngnTemplate]="table.templateTypes.body">
        <tr [ngnTableBodyTr]="row">
          <td ngnTableTd>{{ row.data.id }}</td>
          <td ngnTableTd>{{ row.data.name }}</td>
          <td ngnTableTd>{{ row.data.email }}</td>
          <td ngnTableTd>{{ row.data.department }}</td>
          <td ngnTableTd>{{ row.data.role }}</td>
          <td ngnTableTd>{{ row.data.salary }}</td>
        </tr>
      </ng-template>
    </ngn-table>`,
  imports: ['tableModule', 'tableStickyColumn', 'ngnTemplate'],
};

function generateRows(count: number) {
  const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'];
  const roles = ['Manager', 'Senior', 'Junior', 'Lead', 'Director'];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Person ${i + 1}`,
    email: `person${i + 1}@example.com`,
    department: departments[i % departments.length],
    role: roles[i % roles.length],
    salary: 50000 + i * 1000,
  }));
}

const DEFAULT_INPUTS = {
  rows: generateRows(20),
  reorderable: true,
  resizable: true,
  columnOrder: [] as string[],
};

async function loadTable(
  page: import('@playwright/test').Page,
  inputOverrides?: Partial<typeof DEFAULT_INPUTS>
) {
  const handle = await loadComponent(page, STICKY_TABLE_TEMPLATE, {
    inputs: { ...DEFAULT_INPUTS, ...inputOverrides },
  });
  await expect(page.locator('ngn-table')).toBeVisible({ timeout: 10000 });
  await page.waitForTimeout(300);
  return handle;
}

// ── Tests ────────────────────────────────────────────────────────────────────

test('sticky columns - start columns have position sticky', async ({ page }) => {
  await loadTable(page);

  const stickyInfo = await page.evaluate(() => {
    const headers = document.querySelectorAll('ngn-table th');
    return Array.from(headers).map(h => ({
      text: h.textContent?.trim() || '',
      position: getComputedStyle(h).position,
    }));
  });

  const idHeader = stickyInfo.find(h => h.text === 'ID');
  const nameHeader = stickyInfo.find(h => h.text === 'Name');
  const emailHeader = stickyInfo.find(h => h.text === 'Email');

  expect(idHeader?.position).toBe('sticky');
  expect(nameHeader?.position).toBe('sticky');
  expect(emailHeader?.position).not.toBe('sticky');
});

test('sticky columns - end column has position sticky', async ({ page }) => {
  await loadTable(page);

  const stickyInfo = await page.evaluate(() => {
    const headers = document.querySelectorAll('ngn-table th');
    return Array.from(headers).map(h => ({
      text: h.textContent?.trim() || '',
      position: getComputedStyle(h).position,
    }));
  });

  const salaryHeader = stickyInfo.find(h => h.text === 'Salary');
  const roleHeader = stickyInfo.find(h => h.text === 'Role');

  expect(salaryHeader?.position).toBe('sticky');
  expect(roleHeader?.position).not.toBe('sticky');
});

test('sticky columns - start columns have left offset', async ({ page }) => {
  await loadTable(page);

  const offsets = await page.evaluate(() => {
    const headers = document.querySelectorAll('ngn-table th') as NodeListOf<HTMLElement>;
    return Array.from(headers).map(h => ({
      text: h.textContent?.trim() || '',
      left: h.style.left,
      right: h.style.right,
    }));
  });

  const idHeader = offsets.find(h => h.text === 'ID');
  const nameHeader = offsets.find(h => h.text === 'Name');
  const salaryHeader = offsets.find(h => h.text === 'Salary');

  expect(idHeader?.left).toContain('--ngn-sticky-start-offset-0');
  expect(nameHeader?.left).toContain('--ngn-sticky-start-offset-1');
  expect(salaryHeader?.right).toContain('--ngn-sticky-end-offset-0');
});

test('sticky columns - body cells inherit sticky positioning', async ({ page }) => {
  await loadTable(page);

  const bodyStickyInfo = await page.evaluate(() => {
    const cells = document.querySelectorAll('ngn-table td') as NodeListOf<HTMLElement>;
    if (!cells.length) return [];
    // Get the first 6 cells (one row's worth)
    return Array.from(cells)
      .slice(0, 6)
      .map(c => ({
        position: getComputedStyle(c).position,
        left: c.style.left,
        right: c.style.right,
      }));
  });

  // First two cells (ID, Name) should be sticky with left
  expect(bodyStickyInfo[0]?.position).toBe('sticky');
  expect(bodyStickyInfo[0]?.left).toContain('--ngn-sticky-start-offset-0');
  expect(bodyStickyInfo[1]?.position).toBe('sticky');
  expect(bodyStickyInfo[1]?.left).toContain('--ngn-sticky-start-offset-1');

  // Middle cells should not be sticky
  expect(bodyStickyInfo[2]?.position).not.toBe('sticky');

  // Last cell (Salary) should be sticky with right
  expect(bodyStickyInfo[5]?.position).toBe('sticky');
  expect(bodyStickyInfo[5]?.right).toContain('--ngn-sticky-end-offset-0');
});

test('sticky columns - sticky classes applied to edge cells', async ({ page }) => {
  await loadTable(page);

  const classInfo = await page.evaluate(() => {
    const headers = document.querySelectorAll('ngn-table th') as NodeListOf<HTMLElement>;
    return Array.from(headers).map(h => ({
      text: h.textContent?.trim() || '',
      hasStickyStart: h.className.includes('sticky-start'),
      hasStickyEnd: h.className.includes('sticky-end'),
      hasStickyStartEdge: h.className.includes('sticky-start-edge'),
      hasStickyEndEdge: h.className.includes('sticky-end-edge'),
    }));
  });

  const id = classInfo.find(h => h.text === 'ID')!;
  const name = classInfo.find(h => h.text === 'Name')!;
  const salary = classInfo.find(h => h.text === 'Salary')!;
  const email = classInfo.find(h => h.text === 'Email')!;

  expect(id.hasStickyStart).toBe(true);
  expect(id.hasStickyStartEdge).toBe(false);
  expect(name.hasStickyStart).toBe(true);
  expect(name.hasStickyStartEdge).toBe(true);
  expect(salary.hasStickyEnd).toBe(true);
  expect(salary.hasStickyEndEdge).toBe(true);
  expect(email.hasStickyStart).toBe(false);
  expect(email.hasStickyEnd).toBe(false);
});

test('sticky columns - z-index layering for sticky cells', async ({ page }) => {
  await loadTable(page);

  const zIndexInfo = await page.evaluate(() => {
    const headers = document.querySelectorAll('ngn-table th') as NodeListOf<HTMLElement>;
    return Array.from(headers).map(h => ({
      text: h.textContent?.trim() || '',
      zIndex: getComputedStyle(h).zIndex,
    }));
  });

  // Sticky header cells should have z-index 3 (header + sticky)
  const idHeader = zIndexInfo.find(h => h.text === 'ID');
  const emailHeader = zIndexInfo.find(h => h.text === 'Email');

  expect(Number(idHeader?.zIndex)).toBeGreaterThanOrEqual(3);
  // Non-sticky header cells have lower or auto z-index
  expect(emailHeader?.zIndex === 'auto' || Number(emailHeader?.zIndex) < 3).toBe(true);
});

test('sticky columns - sticky columns remain visible during horizontal scroll', async ({
  page,
}) => {
  await loadTable(page);

  const tableContainer = page.locator('ngn-table table');

  // Get initial bounding box of ID header
  const idHeaderBefore = await page.evaluate(() => {
    const th = document.querySelector('ngn-table th');
    return th?.getBoundingClientRect().left ?? -1;
  });

  // Scroll horizontally
  await tableContainer.evaluate(el => {
    el.scrollLeft = 200;
  });
  await page.waitForTimeout(100);

  // ID header should still be visible (near the same position due to sticky)
  const idHeaderAfter = await page.evaluate(() => {
    const th = document.querySelector('ngn-table th');
    return th?.getBoundingClientRect().left ?? -1;
  });

  // The sticky column should not have moved much (stays in place)
  expect(Math.abs(idHeaderAfter - idHeaderBefore)).toBeLessThan(10);
});

test('sticky columns - reorder constrained within sticky group', async ({ page }) => {
  await loadTable(page);

  // Get initial column order
  const initialStarts = await page.evaluate(() => {
    const headers = document.querySelectorAll('ngn-table th') as NodeListOf<HTMLElement>;
    return Array.from(headers).map(h => ({
      text: h.textContent?.trim() || '',
      colIndex: h.style.getPropertyValue('--ngn-table-column-index'),
    }));
  });

  const idStart = initialStarts.find(h => h.text === 'ID')!;
  const emailStart = initialStarts.find(h => h.text === 'Email')!;

  // Try to drag ID (sticky-start) to Email's position (non-sticky)
  const headers = page.locator('ngn-table th');
  const idHeader = headers.first();
  const emailHeader = headers.nth(2);

  const idBox = await idHeader.boundingBox();
  const emailBox = await emailHeader.boundingBox();
  expect(idBox).not.toBeNull();
  expect(emailBox).not.toBeNull();

  const startX = idBox!.x + idBox!.width / 2;
  const startY = idBox!.y + idBox!.height / 2;
  const endX = emailBox!.x + emailBox!.width / 2;
  const endY = emailBox!.y + emailBox!.height / 2;

  await page.mouse.move(startX, startY);
  await page.mouse.down();
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

  // ID should stay within sticky group (max position 2, not move to email's position 3)
  const afterStarts = await page.evaluate(() => {
    const headers = document.querySelectorAll('ngn-table th') as NodeListOf<HTMLElement>;
    return Array.from(headers).map(h => ({
      text: h.textContent?.trim() || '',
      colIndex: parseInt(h.style.getPropertyValue('--ngn-table-column-index') || '0'),
    }));
  });

  const idAfter = afterStarts.find(h => h.text === 'ID')!;
  // ID should be clamped to max position 2 (the sticky-start group boundary)
  expect(idAfter.colIndex).toBeLessThanOrEqual(2);
});
