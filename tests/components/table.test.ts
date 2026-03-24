import test, { expect } from '@playwright/test';
import { loadComponent } from '../helper/load-component';

const TABLE_ROWS = [
  { id: 1, name: 'Alice', dept: 'Engineering' },
  { id: 2, name: 'Bob', dept: 'Design' },
  { id: 3, name: 'Carol', dept: 'Engineering' },
  { id: 4, name: 'Dave', dept: 'Marketing' },
  { id: 5, name: 'Eve', dept: 'Design' },
];

const TABLE_TEMPLATE = `
  <ngn-table
    #table
    style="height: 400px"
    [rows]="inputs().rows"
    [fieldId]="'id'"
    [selectionMode]="inputs().selectionMode"
  >
    <ng-template #header>
      <tr ngnTableHeadTr>
        <th [ngnTableTh]="table.column('id')">ID</th>
        <th [ngnTableTh]="table.column('name')">Name</th>
        <th [ngnTableTh]="table.column('dept')">Dept</th>
      </tr>
    </ng-template>
    <ng-template #body let-row [ngnTemplate]="table.templateTypes.body">
      <tr [ngnTableBodyTr]="row">
        <td ngnTableTd>{{ row.data.id }}</td>
        <td ngnTableTd>{{ row.data.name }}</td>
        <td ngnTableTd>{{ row.data.dept }}</td>
      </tr>
    </ng-template>
  </ngn-table>
`;

function getBodyRows(page: import('@playwright/test').Page) {
  return page.locator('tbody tr[role="row"]');
}

test.describe('Table Selection - Single Mode', () => {
  test('click row selects it', async ({ page }) => {
    await loadComponent(
      page,
      {
        template: TABLE_TEMPLATE,
        imports: ['tableModule', 'ngnTemplate'],
      },
      {
        inputs: { rows: TABLE_ROWS, selectionMode: 'single' },
      }
    );

    const rows = getBodyRows(page);
    await rows.nth(1).click();

    await expect(rows.nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect(rows.nth(0)).toHaveAttribute('aria-selected', 'false');
    await expect(rows.nth(2)).toHaveAttribute('aria-selected', 'false');
  });

  test('click different row replaces selection', async ({ page }) => {
    await loadComponent(
      page,
      {
        template: TABLE_TEMPLATE,
        imports: ['tableModule', 'ngnTemplate'],
      },
      {
        inputs: { rows: TABLE_ROWS, selectionMode: 'single' },
      }
    );

    const rows = getBodyRows(page);
    await rows.nth(0).click();
    await expect(rows.nth(0)).toHaveAttribute('aria-selected', 'true');

    await rows.nth(2).click();
    await expect(rows.nth(2)).toHaveAttribute('aria-selected', 'true');
    await expect(rows.nth(0)).toHaveAttribute('aria-selected', 'false');
  });

  test('no checkbox column in single mode', async ({ page }) => {
    await loadComponent(
      page,
      {
        template: TABLE_TEMPLATE,
        imports: ['tableModule', 'ngnTemplate'],
      },
      {
        inputs: { rows: TABLE_ROWS, selectionMode: 'single' },
      }
    );

    const checkboxes = page.locator('ngn-checkbox');
    await expect(checkboxes).toHaveCount(0);
  });
});

test.describe('Table Selection - Multi Mode', () => {
  test('checkbox column is rendered', async ({ page }) => {
    await loadComponent(
      page,
      {
        template: TABLE_TEMPLATE,
        imports: ['tableModule', 'ngnTemplate'],
      },
      {
        inputs: { rows: TABLE_ROWS, selectionMode: 'multi' },
      }
    );

    // Header checkbox + 5 row checkboxes
    const checkboxes = page.locator('ngn-checkbox');
    await expect(checkboxes).toHaveCount(6);
  });

  test('click row toggles selection', async ({ page }) => {
    await loadComponent(
      page,
      {
        template: TABLE_TEMPLATE,
        imports: ['tableModule', 'ngnTemplate'],
      },
      {
        inputs: { rows: TABLE_ROWS, selectionMode: 'multi' },
      }
    );

    const rows = getBodyRows(page);
    await rows.nth(0).click();
    await rows.nth(2).click();

    await expect(rows.nth(0)).toHaveAttribute('aria-selected', 'true');
    await expect(rows.nth(1)).toHaveAttribute('aria-selected', 'false');
    await expect(rows.nth(2)).toHaveAttribute('aria-selected', 'true');
  });

  test('click same row twice deselects it', async ({ page }) => {
    await loadComponent(
      page,
      {
        template: TABLE_TEMPLATE,
        imports: ['tableModule', 'ngnTemplate'],
      },
      {
        inputs: { rows: TABLE_ROWS, selectionMode: 'multi' },
      }
    );

    const rows = getBodyRows(page);
    await rows.nth(0).click();
    await expect(rows.nth(0)).toHaveAttribute('aria-selected', 'true');

    await rows.nth(0).click();
    await expect(rows.nth(0)).toHaveAttribute('aria-selected', 'false');
  });

  test('aria-multiselectable is set on table', async ({ page }) => {
    await loadComponent(
      page,
      {
        template: TABLE_TEMPLATE,
        imports: ['tableModule', 'ngnTemplate'],
      },
      {
        inputs: { rows: TABLE_ROWS, selectionMode: 'multi' },
      }
    );

    await expect(page.locator('ngn-table')).toHaveAttribute('aria-multiselectable', 'true');
  });
});

test.describe('Table Selection - No Selection Mode', () => {
  test('no aria-selected when selection is disabled', async ({ page }) => {
    await loadComponent(
      page,
      {
        template: TABLE_TEMPLATE,
        imports: ['tableModule', 'ngnTemplate'],
      },
      {
        inputs: { rows: TABLE_ROWS, selectionMode: null },
      }
    );

    await expect(page.locator('ngn-table')).toBeVisible();
    const firstRow = page.locator('tbody tr').first();
    await expect(firstRow).toBeVisible();
    await expect(firstRow).not.toHaveAttribute('aria-selected');
  });

  test('no aria-multiselectable when selection is disabled', async ({ page }) => {
    await loadComponent(
      page,
      {
        template: TABLE_TEMPLATE,
        imports: ['tableModule', 'ngnTemplate'],
      },
      {
        inputs: { rows: TABLE_ROWS, selectionMode: null },
      }
    );

    await expect(page.locator('ngn-table')).not.toHaveAttribute('aria-multiselectable');
  });
});
