import test, { expect } from '@playwright/test';
import { loadComponent } from '../helper/load-component';
import { expectNoA11yViolations } from '../helper/axe';

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

const TABLE_TEMPLATE_WITH_SELECTION = `
  <ngn-table
    #table
    style="height: 400px"
    [rows]="inputs().rows"
    [fieldId]="'id'"
    [selectionMode]="inputs().selectionMode"
  >
    <ng-template #header>
      <tr ngnTableHeadTr>
        <th ngnTableSelectionColumn></th>
        <th [ngnTableTh]="table.column('id')">ID</th>
        <th [ngnTableTh]="table.column('name')">Name</th>
        <th [ngnTableTh]="table.column('dept')">Dept</th>
      </tr>
    </ng-template>
    <ng-template #body let-row [ngnTemplate]="table.templateTypes.body">
      <tr [ngnTableBodyTr]="row">
        <td ngnTableSelectionColumn></td>
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

  test('no checkbox column without selection directive', async ({ page }) => {
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
        template: TABLE_TEMPLATE_WITH_SELECTION,
        imports: ['tableModule', 'ngnTemplate', 'tableSelectionColumn'],
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
        template: TABLE_TEMPLATE_WITH_SELECTION,
        imports: ['tableModule', 'ngnTemplate', 'tableSelectionColumn'],
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
        template: TABLE_TEMPLATE_WITH_SELECTION,
        imports: ['tableModule', 'ngnTemplate', 'tableSelectionColumn'],
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
        template: TABLE_TEMPLATE_WITH_SELECTION,
        imports: ['tableModule', 'ngnTemplate', 'tableSelectionColumn'],
      },
      {
        inputs: { rows: TABLE_ROWS, selectionMode: 'multi' },
      }
    );

    // aria-multiselectable lives on the grid element (the <table role="grid">),
    // not the host, so it is valid ARIA for the grid role.
    await expect(page.locator('table[role="grid"]')).toHaveAttribute(
      'aria-multiselectable',
      'true'
    );
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

    await expect(page.locator('table[role="grid"]')).not.toHaveAttribute('aria-multiselectable');
  });
});

const TABLE_TEMPLATE_SORTABLE = `
  <ngn-table
    #table
    style="height: 400px"
    [rows]="inputs().rows"
    [fieldId]="'id'"
  >
    <ng-template #header>
      <tr ngnTableHeadTr>
        <th [ngnTableTh]="table.column('id')">ID</th>
        <th [ngnTableTh]="table.column('name')" [ngnTableSortableColumn]>Name</th>
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

test.describe('Table Accessibility - grid roles', () => {
  test('exposes grid/rowgroup/row/columnheader/gridcell roles', async ({ page }) => {
    // The theme applies `display: grid`, which strips native table semantics —
    // these explicit roles restore them for assistive tech.
    await loadComponent(
      page,
      { template: TABLE_TEMPLATE, imports: ['tableModule', 'ngnTemplate'] },
      { inputs: { rows: TABLE_ROWS, selectionMode: null } }
    );

    await expect(page.locator('table[role="grid"]')).toHaveCount(1);
    await expect(page.locator('thead[role="rowgroup"]')).toHaveCount(1);
    await expect(page.locator('tbody[role="rowgroup"]')).toHaveCount(1);
    await expect(page.locator('thead tr[role="row"]')).toHaveCount(1);
    // 3 declared header cells become columnheaders.
    await expect(page.locator('th[role="columnheader"]')).toHaveCount(3);
    // Every body data cell is a gridcell (5 rows x 3 columns).
    await expect(page.locator('td[role="gridcell"]')).toHaveCount(15);
  });
});

test.describe('Table Accessibility - aria-sort', () => {
  test('sortable header cycles aria-sort none -> ascending -> descending -> none', async ({
    page,
  }) => {
    await loadComponent(
      page,
      {
        template: TABLE_TEMPLATE_SORTABLE,
        imports: ['tableModule', 'ngnTemplate', 'tableSortableColumn'],
      },
      { inputs: { rows: TABLE_ROWS } }
    );

    // The sortable column is the only header carrying aria-sort. (The
    // `[ngnTableSortableColumn]` binding is a property, not a DOM attribute, so
    // it can't be used as a selector.)
    const sortable = page.locator('th[aria-sort]');
    await expect(sortable).toHaveAttribute('aria-sort', 'none');

    await sortable.click();
    await expect(sortable).toHaveAttribute('aria-sort', 'ascending');

    await sortable.click();
    await expect(sortable).toHaveAttribute('aria-sort', 'descending');

    await sortable.click();
    await expect(sortable).toHaveAttribute('aria-sort', 'none');
  });

  test('non-sortable header cells have no aria-sort', async ({ page }) => {
    await loadComponent(
      page,
      {
        template: TABLE_TEMPLATE_SORTABLE,
        imports: ['tableModule', 'ngnTemplate', 'tableSortableColumn'],
      },
      { inputs: { rows: TABLE_ROWS } }
    );

    // Only the single sortable column carries aria-sort.
    await expect(page.locator('th[aria-sort]')).toHaveCount(1);
  });
});

test.describe('Table Accessibility - axe', () => {
  test('accessibility (axe)', async ({ page }) => {
    await loadComponent(
      page,
      {
        template: TABLE_TEMPLATE_WITH_SELECTION,
        imports: ['tableModule', 'ngnTemplate', 'tableSelectionColumn'],
      },
      { inputs: { rows: TABLE_ROWS, selectionMode: 'multi' } }
    );
    await expectNoA11yViolations(page);
  });
});
