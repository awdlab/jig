import test, { expect, type Locator, type Page } from '@playwright/test';
import { JigTableHarness } from '@awdlab/jig-playwright';

import { loadComponent } from '../helper/load-component';
import { useRtl } from '../helper/direction';
import { expectScreenshot } from '../helper/screenshot';
import type { TemplateType } from '../../apps/test-wrapper/src/app/window.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

const STICKY_TABLE_TEMPLATE: TemplateType = {
  template: `
    <jig-table
      #table
      style="height: 400px; width: 600px"
      [rows]="inputs().rows"
      [fieldId]="'id'"
      [reorderable]="inputs().reorderable"
      [resizable]="inputs().resizable"
      [(columnOrder)]="inputs().columnOrder"
    >
      <ng-template #header>
        <tr jigTableHeadTr>
          <th [jigTableTh]="table.column('id')" [jigTableStickyColumn]="'start'" jigTableReorderableColumn [size]="'80px'">ID</th>
          <th [jigTableTh]="table.column('name')" [jigTableStickyColumn]="'start'" jigTableReorderableColumn [size]="'150px'">Name</th>
          <th [jigTableTh]="table.column('email')" jigTableReorderableColumn [size]="'200px'">Email</th>
          <th [jigTableTh]="table.column('department')" jigTableReorderableColumn [size]="'150px'">Department</th>
          <th [jigTableTh]="table.column('role')" jigTableReorderableColumn [size]="'130px'">Role</th>
          <th [jigTableTh]="table.column('salary')" [jigTableStickyColumn]="'end'" jigTableReorderableColumn [size]="'120px'">Salary</th>
        </tr>
      </ng-template>
      <ng-template #body let-row [jigTemplate]="table.templateTypes.body">
        <tr [jigTableBodyTr]="row">
          <td jigTableTd>{{ row.data.id }}</td>
          <td jigTableTd>{{ row.data.name }}</td>
          <td jigTableTd>{{ row.data.email }}</td>
          <td jigTableTd>{{ row.data.department }}</td>
          <td jigTableTd>{{ row.data.role }}</td>
          <td jigTableTd>{{ row.data.salary }}</td>
        </tr>
      </ng-template>
    </jig-table>`,
  imports: ['tableModule', 'tableStickyColumn', 'template'],
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

async function loadTable(page: Page, inputOverrides?: Partial<typeof DEFAULT_INPUTS>) {
  await loadComponent(page, STICKY_TABLE_TEMPLATE, {
    inputs: { ...DEFAULT_INPUTS, ...inputOverrides },
  });
  const table = new JigTableHarness(page.locator('jig-table'));
  await expect(table.locator).toBeVisible({ timeout: 10000 });
  await page.waitForTimeout(300);
  return table;
}

// Header order: ID, Name, Email, Department, Role, Salary.
const ID = 0;
const NAME = 1;
const EMAIL = 2;
const ROLE = 4;
const SALARY = 5;

function inset(cell: Locator) {
  return cell.evaluate(el => ({
    start: (el as HTMLElement).style.insetInlineStart,
    end: (el as HTMLElement).style.insetInlineEnd,
  }));
}

// ── Tests ────────────────────────────────────────────────────────────────────

test('sticky columns - start columns have position sticky', async ({ page }) => {
  const table = await loadTable(page);

  await expect(table.getHeaderCellByIndex(ID)).toHaveCSS('position', 'sticky');
  await expect(table.getHeaderCellByIndex(NAME)).toHaveCSS('position', 'sticky');
  await expect(table.getHeaderCellByIndex(EMAIL)).not.toHaveCSS('position', 'sticky');
});

test('sticky columns - end column has position sticky', async ({ page }) => {
  const table = await loadTable(page);

  await expect(table.getHeaderCellByIndex(SALARY)).toHaveCSS('position', 'sticky');
  await expect(table.getHeaderCellByIndex(ROLE)).not.toHaveCSS('position', 'sticky');
});

test('sticky columns - start columns have an inline-start offset', async ({ page }) => {
  const table = await loadTable(page);

  expect((await inset(table.getHeaderCellByIndex(ID))).start).toContain(
    '--jig-sticky-start-offset-0'
  );
  expect((await inset(table.getHeaderCellByIndex(NAME))).start).toContain(
    '--jig-sticky-start-offset-1'
  );
  expect((await inset(table.getHeaderCellByIndex(SALARY))).end).toContain(
    '--jig-sticky-end-offset-0'
  );
});

test('sticky columns - body cells inherit sticky positioning', async ({ page }) => {
  const table = await loadTable(page);

  // First two cells (ID, Name) should be sticky with left
  await expect(table.getCellByIndex(0, ID)).toHaveCSS('position', 'sticky');
  expect((await inset(table.getCellByIndex(0, ID))).start).toContain('--jig-sticky-start-offset-0');
  await expect(table.getCellByIndex(0, NAME)).toHaveCSS('position', 'sticky');
  expect((await inset(table.getCellByIndex(0, NAME))).start).toContain(
    '--jig-sticky-start-offset-1'
  );

  // Middle cells should not be sticky
  await expect(table.getCellByIndex(0, EMAIL)).not.toHaveCSS('position', 'sticky');

  // Last cell (Salary) should be sticky with right
  await expect(table.getCellByIndex(0, SALARY)).toHaveCSS('position', 'sticky');
  expect((await inset(table.getCellByIndex(0, SALARY))).end).toContain('--jig-sticky-end-offset-0');
});

test('sticky columns - sticky classes applied to edge cells', async ({ page }) => {
  const table = await loadTable(page);
  const { classes } = table;
  const id = table.getHeaderCellByIndex(ID);
  const name = table.getHeaderCellByIndex(NAME);
  const salary = table.getHeaderCellByIndex(SALARY);
  const email = table.getHeaderCellByIndex(EMAIL);

  await expect(id).toContainClass(classes['sticky-start'].slice(1));
  await expect(id).not.toContainClass(classes['sticky-start-edge'].slice(1));
  await expect(name).toContainClass(classes['sticky-start'].slice(1));
  await expect(name).toContainClass(classes['sticky-start-edge'].slice(1));
  await expect(salary).toContainClass(classes['sticky-end'].slice(1));
  await expect(salary).toContainClass(classes['sticky-end-edge'].slice(1));
  await expect(email).not.toContainClass(classes['sticky-start'].slice(1));
  await expect(email).not.toContainClass(classes['sticky-end'].slice(1));
});

test('sticky columns - z-index layering for sticky cells', async ({ page }) => {
  const table = await loadTable(page);
  const zIndex = (cell: Locator) => cell.evaluate(el => getComputedStyle(el).zIndex);

  // Sticky header cells should have z-index 3 (header + sticky)
  const idZIndex = await zIndex(table.getHeaderCellByIndex(ID));
  const emailZIndex = await zIndex(table.getHeaderCellByIndex(EMAIL));

  expect(Number(idZIndex)).toBeGreaterThanOrEqual(3);
  // Non-sticky header cells have lower or auto z-index
  expect(emailZIndex === 'auto' || Number(emailZIndex) < 3).toBe(true);
});

test('sticky columns - sticky columns remain visible during horizontal scroll', async ({
  page,
}) => {
  const table = await loadTable(page);
  const idHeader = table.getHeaderCellByIndex(ID);

  const idHeaderBefore = (await idHeader.boundingBox())!.x;

  await table.grid.evaluate(el => {
    el.scrollLeft = 200;
  });
  await page.waitForTimeout(100);

  // The sticky column should not have moved much (stays in place)
  const idHeaderAfter = (await idHeader.boundingBox())!.x;
  expect(Math.abs(idHeaderAfter - idHeaderBefore)).toBeLessThan(10);
});

test('sticky columns - reorder constrained within sticky group', async ({ page }) => {
  const table = await loadTable(page);
  const idHeader = table.getHeaderCellByIndex(ID);

  // Try to drag ID (sticky-start) onto Email (non-sticky)
  await table.reorderColumn(ID, EMAIL);
  await page.waitForTimeout(200);

  // ID should be clamped to max position 2 (the sticky-start group boundary)
  const idColIndex = await idHeader.evaluate(el =>
    parseInt((el as HTMLElement).style.getPropertyValue('--jig-table-column-index') || '0')
  );
  expect(idColIndex).toBeLessThanOrEqual(2);
});

test('rtl', async ({ page }, testInfo) => {
  await useRtl(page);
  await loadTable(page);
  await expectScreenshot(page, testInfo);
});
