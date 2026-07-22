import test, { expect } from '@playwright/test';
import { loadComponent, evalValue } from '../helper/load-component';
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

const LAZY_TABLE_TEMPLATE = `
  <ngn-table
    #table
    style="height: 300px"
    [fieldId]="'id'"
    [paginator]="true"
    [dataSource]="inputs().dataSource"
  >
    <ng-template #header>
      <tr ngnTableHeadTr>
        <th [ngnTableTh]="table.column('id')">ID</th>
      </tr>
    </ng-template>
    <ng-template #body let-row [ngnTemplate]="table.templateTypes.body">
      <tr [ngnTableBodyTr]="row">
        <td ngnTableTd>{{ row.data.id }}</td>
      </tr>
    </ng-template>
  </ngn-table>
`;

const LAZY_TABLE_TEMPLATE_SORT = `
  <ngn-table
    #table
    style="height: 300px"
    [fieldId]="'id'"
    [paginator]="true"
    [dataSource]="inputs().dataSource"
    [sort]="inputs().sort"
  >
    <ng-template #header>
      <tr ngnTableHeadTr>
        <th [ngnTableTh]="table.column('id')">ID</th>
      </tr>
    </ng-template>
    <ng-template #body let-row [ngnTemplate]="table.templateTypes.body">
      <tr [ngnTableBodyTr]="row">
        <td ngnTableTd>{{ row.data.id }}</td>
      </tr>
    </ng-template>
  </ngn-table>
`;

test.describe('Table Lazy - pagination', () => {
  test('lazy pagination loads the first page from dataSource', async ({ page }) => {
    await loadComponent(
      page,
      {
        template: LAZY_TABLE_TEMPLATE,
        imports: ['tableModule', 'ngnTemplate'],
      },
      {
        inputs: {
          dataSource: evalValue(
            `async (req) => { (window.__lazyPages ??= []).push(req.pagination.page.current); return { rows: [{ id: 1 }, { id: 2 }], total: 100, hasMore: true }; }`
          ),
        },
      }
    );

    const rows = getBodyRows(page);
    await expect(rows).toHaveCount(2);
    await expect(rows.nth(0).locator('td')).toHaveText('1');
    await expect(rows.nth(1).locator('td')).toHaveText('2');

    // The loader must have been called for the first page (zero-based).
    await expect
      .poll(async () => await page.evaluate(() => (window as any).__lazyPages ?? []))
      .toContain(0);
  });

  // A sort change invalidates the cache and refetches the current page.
  test('sort change refetches the current lazy page with the new sort', async ({ page }) => {
    const handle = await loadComponent(
      page,
      {
        template: LAZY_TABLE_TEMPLATE_SORT,
        imports: ['tableModule', 'ngnTemplate'],
      },
      {
        inputs: {
          sort: null,
          // Records every request (page + sort) and returns different rows once
          // a sort is active, so we can prove the refetch actually took effect.
          dataSource: evalValue(
            `async (req) => {
              (window.__lazyCalls ??= []).push({ page: req.pagination.page.current, sort: req.sort });
              return req.sort
                ? { rows: [{ id: 99 }], total: 100, hasMore: true }
                : { rows: [{ id: 1 }, { id: 2 }], total: 100, hasMore: true };
            }`
          ),
        },
      }
    );

    const rows = getBodyRows(page);
    await expect(rows).toHaveCount(2);
    await expect(rows.nth(0).locator('td')).toHaveText('1');

    const callCountBefore = await page.evaluate(
      () => ((window as any).__lazyCalls ?? []).length as number
    );

    // Flip the sort via the two-way-bound wrapper input.
    await handle.setInputs({ sort: { column: 'id', direction: 'desc' } });

    // (a) the loader is called AGAIN, with the new sort descriptor.
    await expect
      .poll(async () => await page.evaluate(() => ((window as any).__lazyCalls ?? []).length))
      .toBeGreaterThan(callCountBefore);
    const lastSort = await page.evaluate(() => {
      const calls = (window as any).__lazyCalls ?? [];
      return calls[calls.length - 1]?.sort;
    });
    expect(lastSort).toEqual({ column: 'id', direction: 'desc' });

    // (b) the table shows the refetched rows — not blank.
    await expect(rows).toHaveCount(1);
    await expect(rows.nth(0).locator('td')).toHaveText('99');
  });

  // Page navigation must not invalidate the cache — revisits serve from it.
  test('navigating back to a loaded page hits the cache (no refetch)', async ({ page }) => {
    await loadComponent(
      page,
      {
        template: LAZY_TABLE_TEMPLATE,
        imports: ['tableModule', 'ngnTemplate'],
      },
      {
        inputs: {
          dataSource: evalValue(
            `async (req) => { const p = req.pagination.page.current; (window.__lazyPages ??= []).push(p); return { rows: [{ id: p * 100 + 1 }], total: 100, hasMore: true }; }`
          ),
        },
      }
    );

    const rows = getBodyRows(page);
    await expect(rows.nth(0).locator('td')).toHaveText('1');

    // Go to page 2 (index 1), then back to page 1 (index 0).
    await page.getByRole('button', { name: '2', exact: true }).click();
    await expect(rows.nth(0).locator('td')).toHaveText('101');

    await page.getByRole('button', { name: '1', exact: true }).click();
    await expect(rows.nth(0).locator('td')).toHaveText('1');

    // Page 0 must have been fetched exactly once — the cache served the return trip.
    const pages = await page.evaluate(() => (window as any).__lazyPages ?? []);
    expect(pages.filter((p: number) => p === 0)).toHaveLength(1);
  });

  // The loader is held open via a window-hung resolver so the pending state stays.
  test('shows skeleton rows while the lazy page load is pending, then swaps to data', async ({
    page,
  }) => {
    await loadComponent(
      page,
      {
        template: LAZY_TABLE_TEMPLATE,
        imports: ['tableModule', 'ngnTemplate'],
      },
      {
        inputs: {
          dataSource: evalValue(
            `(req) => new Promise((resolve) => {
              (window.__resolveLazy = () => resolve({ rows: [{ id: 1 }, { id: 2 }], total: 100, hasMore: true }));
            })`
          ),
        },
      }
    );

    // No page-size is configured, so the paginator's default (first of
    // [5, 10, 25, 50]) applies — skeletonRows() falls back to that size.
    const skeletonRows = page.locator('tbody tr[class*="skeleton-row"]');
    await expect(skeletonRows).toHaveCount(5);
    for (const row of await skeletonRows.all()) {
      await expect(row).toHaveAttribute('aria-hidden', 'true');
      await expect(row).toHaveAttribute('role', 'row');
      await expect(row.locator('td[class*="skeleton-cell"]')).toHaveCount(1);
    }

    // The ghost bar must have a real, non-zero height in non-virtual mode
    // (regression: it previously collapsed because --ngn-table-row-height is
    // unset without [virtual], and the row height now falls back to
    // line-height + padding).
    const ghostBox = await skeletonRows.first().locator('td[class*="skeleton-cell"]').boundingBox();
    expect(ghostBox!.height).toBeGreaterThan(8);

    // Resolve the pending load — skeleton rows disappear, real data appears.
    await page.evaluate(() => (window as any).__resolveLazy());

    await expect(skeletonRows).toHaveCount(0);
    const rows = getBodyRows(page);
    await expect(rows).toHaveCount(2);
    await expect(rows.nth(0).locator('td')).toHaveText('1');
  });

  // While the next page loads, the previous page's rows must be gone (only skeletons).
  test('paginate mode clears stale rows while the next page is loading (no stale + skeleton overlap)', async ({
    page,
  }) => {
    await loadComponent(
      page,
      {
        template: LAZY_TABLE_TEMPLATE,
        imports: ['tableModule', 'ngnTemplate'],
      },
      {
        inputs: {
          dataSource: evalValue(
            `(req) => {
              const p = req.pagination.page.current;
              if (p === 0) {
                return Promise.resolve({ rows: [{ id: 1 }, { id: 2 }], total: 100, hasMore: true });
              }
              return new Promise((resolve) => {
                (window.__resolveLazyPage1 = () => resolve({ rows: [{ id: 101 }, { id: 102 }], total: 100, hasMore: true }));
              });
            }`
          ),
        },
      }
    );

    // `role="row"` is shared by data rows and skeleton rows (both host it),
    // so data rows are identified by excluding the skeleton-row class.
    const dataRows = page.locator('tbody tr[role="row"]:not([class*="skeleton-row"])');
    const skeletonRows = page.locator('tbody tr[class*="skeleton-row"]');
    await expect(dataRows).toHaveCount(2);
    await expect(dataRows.nth(0).locator('td')).toHaveText('1');

    // Navigate to page 2 (index 1) — its loader is pending.
    await page.getByRole('button', { name: '2', exact: true }).click();

    // While pending: skeleton rows are present AND the previous page's data
    // rows are gone (no stale rows stacked with skeletons) — only skeleton
    // rows render in tbody.
    await expect(skeletonRows).toHaveCount(5);
    await expect(dataRows).toHaveCount(0);

    // Resolve — page 1's rows appear, skeletons vanish.
    await page.evaluate(() => (window as any).__resolveLazyPage1());
    await expect(skeletonRows).toHaveCount(0);
    await expect(dataRows).toHaveCount(2);
    await expect(dataRows.nth(0).locator('td')).toHaveText('101');
  });
});

const LAZY_TABLE_TEMPLATE_CUSTOM_ERROR = `
  <ngn-table
    #table
    style="height: 300px"
    [fieldId]="'id'"
    [paginator]="true"
    [dataSource]="inputs().dataSource"
  >
    <ng-template #header>
      <tr ngnTableHeadTr>
        <th [ngnTableTh]="table.column('id')">ID</th>
      </tr>
    </ng-template>
    <ng-template #body let-row [ngnTemplate]="table.templateTypes.body">
      <tr [ngnTableBodyTr]="row">
        <td ngnTableTd>{{ row.data.id }}</td>
      </tr>
    </ng-template>
    <ng-template #error let-ctx>
      <tr>
        <td colspan="1" data-testid="custom-error">
          Custom error: {{ ctx.error.message }}
          <button data-testid="custom-retry" (click)="ctx.retry()">Go</button>
        </td>
      </tr>
    </ng-template>
  </ngn-table>
`;

// A rejecting dataSource renders an error row; Retry re-issues the loader.
test.describe('Table Lazy - error + retry', () => {
  test('shows an error row with a Retry button when the load rejects, and Retry re-issues the loader', async ({
    page,
  }) => {
    await loadComponent(
      page,
      {
        template: LAZY_TABLE_TEMPLATE,
        imports: ['tableModule', 'ngnTemplate'],
      },
      {
        inputs: {
          // First call rejects; every call after that resolves — this lets a
          // single test prove both "error row appears" and "retry loads data".
          dataSource: evalValue(
            `(req) => {
              const n = ((window.__lazyCalls ??= []).push(req.pagination.page.current));
              if (n === 1) return Promise.reject(new Error('boom'));
              return Promise.resolve({ rows: [{ id: 1 }], total: 1, hasMore: false });
            }`
          ),
        },
      }
    );

    const errorRow = page.locator('tbody tr[class*="error-row"]');
    const retryButton = errorRow.getByRole('button', { name: 'Retry' });
    await expect(errorRow).toHaveCount(1);
    await expect(retryButton).toBeVisible();
    // No data rows are rendered while the table is in the error state.
    await expect(getBodyRows(page).filter({ hasNotText: 'Retry' })).toHaveCount(0);

    const callCount = () => page.evaluate(() => (window as any).__lazyCalls?.length ?? 0);
    await expect.poll(callCount).toBe(1);

    await retryButton.click();

    // Retry re-issued the loader (spy count increased)...
    await expect.poll(callCount).toBe(2);
    // ...and since the retried call resolves, the error row is gone and the
    // loaded row renders.
    await expect(errorRow).toHaveCount(0);
    const rows = getBodyRows(page);
    await expect(rows).toHaveCount(1);
    await expect(rows.nth(0).locator('td')).toHaveText('1');
  });

  test('a custom #error template overrides the default row and receives { error, retry }', async ({
    page,
  }) => {
    await loadComponent(
      page,
      {
        template: LAZY_TABLE_TEMPLATE_CUSTOM_ERROR,
        imports: ['tableModule', 'ngnTemplate'],
      },
      {
        inputs: {
          dataSource: evalValue(
            `(req) => {
              const n = ((window.__lazyCalls2 ??= []).push(req.pagination.page.current));
              if (n === 1) return Promise.reject(new Error('boom'));
              return Promise.resolve({ rows: [{ id: 1 }], total: 1, hasMore: false });
            }`
          ),
        },
      }
    );

    const customError = page.getByTestId('custom-error');
    await expect(customError).toBeVisible();
    await expect(customError).toContainText('Custom error: boom');
    // The default error row must not also render.
    await expect(page.locator('tbody tr[class*="error-row"]')).toHaveCount(0);

    const callCount = () => page.evaluate(() => (window as any).__lazyCalls2?.length ?? 0);
    await expect.poll(callCount).toBe(1);

    await page.getByTestId('custom-retry').click();

    // The custom template's `ctx.retry()` calls through to reload(), which
    // re-issues the loader.
    await expect.poll(callCount).toBe(2);
    await expect(customError).toHaveCount(0);
    const rows = getBodyRows(page);
    await expect(rows).toHaveCount(1);
    await expect(rows.nth(0).locator('td')).toHaveText('1');
  });
});

const INFINITE_TABLE_TEMPLATE = `
  <ngn-table
    #table
    style="height: 300px"
    [fieldId]="'id'"
    [virtual]="true"
    [rowHeight]="40"
    [dataSource]="inputs().dataSource"
  >
    <ng-template #header>
      <tr ngnTableHeadTr>
        <th [ngnTableTh]="table.column('id')">ID</th>
      </tr>
    </ng-template>
    <ng-template #body let-row [ngnTemplate]="table.templateTypes.body">
      <tr [ngnTableBodyTr]="row">
        <td ngnTableTd>{{ row.data.id }}</td>
      </tr>
    </ng-template>
  </ngn-table>
`;

test.describe('Table Lazy - infinite scroll', () => {
  // 50 rows, two windows of 25; hasMore flips false on the second.
  test('scrolling to the end loads the next window and stops when hasMore is false', async ({
    page,
  }) => {
    await loadComponent(
      page,
      {
        template: INFINITE_TABLE_TEMPLATE,
        imports: ['tableModule', 'ngnTemplate'],
      },
      {
        inputs: {
          dataSource: evalValue(
            `async (req) => {
              (window.__infCalls ??= []).push(req.pagination.page.current);
              const total = 50;
              const size = req.pagination.page.size;
              const start = req.pagination.page.current * size;
              const rows = Array.from(
                { length: Math.max(0, Math.min(size, total - start)) },
                (_, i) => ({ id: start + i + 1 })
              );
              return { rows, total, hasMore: start + rows.length < total };
            }`
          ),
        },
      }
    );

    const callCount = () =>
      page.evaluate(() => ((window as any).__infCalls ?? []).length as number);
    const scrollContainer = page.locator('ngn-table table');
    const scrollToBottom = () =>
      scrollContainer.evaluate(el => {
        el.scrollTop = el.scrollHeight;
      });
    // Virtual keeps only a window in the DOM, so read counts off the lazy model.
    const lazyState = () =>
      page.evaluate(() => {
        const comp = (window as any).ng.getComponent(document.querySelector('ngn-table'));
        return { loaded: comp._lazyModel.loaded().length, hasMore: comp._lazyModel.hasMore() };
      });

    // The first window loads on its own (empty scroller reads zero distance).
    await expect.poll(callCount).toBe(1);
    const rows = getBodyRows(page);
    await expect(rows.first().locator('td')).toHaveText('1');
    await expect.poll(lazyState).toEqual({ loaded: 25, hasMore: true });

    // Scroll to the bottom: the second (final) window appends.
    await scrollToBottom();
    await expect.poll(callCount).toBeGreaterThanOrEqual(2);
    await expect.poll(lazyState).toEqual({ loaded: 50, hasMore: false });
    const requestedPages = await page.evaluate(() => (window as any).__infCalls);
    expect(requestedPages).toEqual([0, 1]);

    // hasMore is false now — a further scroll must not trigger a 3rd call.
    await scrollToBottom();
    await page.waitForTimeout(300);
    expect(await callCount()).toBe(2);
  });

  // 60 rows in windows of 25/25/10; verifies scrollHeight grows so deep scroll
  // keeps reaching the threshold instead of stalling.
  test('deep scroll advances through all 3 windows and reports correct scrollHeight', async ({
    page,
  }) => {
    await loadComponent(
      page,
      {
        template: INFINITE_TABLE_TEMPLATE,
        imports: ['tableModule', 'ngnTemplate'],
      },
      {
        inputs: {
          dataSource: evalValue(
            `async (req) => {
              (window.__infCalls ??= []).push(req.pagination.page.current);
              const total = 60;
              const size = req.pagination.page.size;
              const start = req.pagination.page.current * size;
              const rows = Array.from(
                { length: Math.max(0, Math.min(size, total - start)) },
                (_, i) => ({ id: start + i + 1 })
              );
              return { rows, total, hasMore: start + rows.length < total };
            }`
          ),
        },
      }
    );

    const callCount = () =>
      page.evaluate(() => ((window as any).__infCalls ?? []).length as number);
    const scrollContainer = page.locator('ngn-table table');
    const scrollToBottom = () =>
      scrollContainer.evaluate(el => {
        el.scrollTop = el.scrollHeight;
      });
    const lazyState = () =>
      page.evaluate(() => {
        const comp = (window as any).ng.getComponent(document.querySelector('ngn-table'));
        return { loaded: comp._lazyModel.loaded().length, hasMore: comp._lazyModel.hasMore() };
      });

    // First window loads on its own.
    await expect.poll(callCount).toBe(1);
    await expect.poll(lazyState).toEqual({ loaded: 25, hasMore: true });

    // Second window.
    await scrollToBottom();
    await expect.poll(lazyState).toEqual({ loaded: 50, hasMore: true });

    // Third (final) window.
    await scrollToBottom();
    await expect.poll(lazyState).toEqual({ loaded: 60, hasMore: false });

    // All three pages requested exactly once, in order.
    const requestedPages = await page.evaluate(() => (window as any).__infCalls);
    expect(requestedPages).toEqual([0, 1, 2]);

    // 60 rows * 40px + 40px sticky header ≈ 2440px.
    const scrollHeight = await scrollContainer.evaluate(el => el.scrollHeight);
    expect(scrollHeight).toBeGreaterThanOrEqual(2440 - 80);
    expect(scrollHeight).toBeLessThanOrEqual(2440 + 80);
  });
});

const INFINITE_TABLE_TEMPLATE_WITH_SELECTION = `
  <ngn-table
    #table
    style="height: 300px"
    [fieldId]="'id'"
    [virtual]="true"
    [rowHeight]="40"
    [dataSource]="inputs().dataSource"
    [selectionMode]="inputs().selectionMode"
  >
    <ng-template #header>
      <tr ngnTableHeadTr>
        <th ngnTableSelectionColumn></th>
        <th [ngnTableTh]="table.column('id')">ID</th>
      </tr>
    </ng-template>
    <ng-template #body let-row [ngnTemplate]="table.templateTypes.body">
      <tr [ngnTableBodyTr]="row">
        <td ngnTableSelectionColumn></td>
        <td ngnTableTd>{{ row.data.id }}</td>
      </tr>
    </ng-template>
  </ngn-table>
`;

const LAZY_TABLE_TEMPLATE_WITH_SELECTION = `
  <ngn-table
    #table
    style="height: 300px"
    [fieldId]="'id'"
    [paginator]="true"
    [dataSource]="inputs().dataSource"
    [selectionMode]="inputs().selectionMode"
  >
    <ng-template #header>
      <tr ngnTableHeadTr>
        <th ngnTableSelectionColumn></th>
        <th [ngnTableTh]="table.column('id')">ID</th>
      </tr>
    </ng-template>
    <ng-template #body let-row [ngnTemplate]="table.templateTypes.body">
      <tr [ngnTableBodyTr]="row">
        <td ngnTableSelectionColumn></td>
        <td ngnTableTd>{{ row.data.id }}</td>
      </tr>
    </ng-template>
  </ngn-table>
`;

// Infinite mode never loads the full set, so the header checkbox flips
// `selectAllMatching` instead of selecting loaded rows.
test.describe('Table Selection - infinite lazy mode (select-all-matching)', () => {
  test('header checkbox toggles selectAllMatching instead of selecting loaded rows', async ({
    page,
  }) => {
    await loadComponent(
      page,
      {
        template: INFINITE_TABLE_TEMPLATE_WITH_SELECTION,
        imports: ['tableModule', 'ngnTemplate', 'tableSelectionColumn'],
      },
      {
        inputs: {
          selectionMode: 'multi',
          dataSource: evalValue(
            `async (req) => {
              const total = 30;
              const size = req.pagination.page.size;
              const start = req.pagination.page.current * size;
              const rows = Array.from(
                { length: Math.max(0, Math.min(size, total - start)) },
                (_, i) => ({ id: start + i + 1 })
              );
              return { rows, total, hasMore: start + rows.length < total };
            }`
          ),
        },
      }
    );

    const tableState = () =>
      page.evaluate(() => {
        const comp = (window as any).ng.getComponent(document.querySelector('ngn-table'));
        return {
          selectAllMatching: comp.selectAllMatching(),
          selection: comp.selection(),
          loaded: comp._lazyModel.loaded().length,
        };
      });

    // First window loads 25 of 30, so "loaded" vs "matching" is a real distinction.
    const rows = getBodyRows(page);
    await expect.poll(tableState).toEqual({ selectAllMatching: false, selection: [], loaded: 25 });

    // Header checkbox is the first ngn-checkbox.
    const headerCheckbox = page.locator('ngn-checkbox').first();
    await headerCheckbox.click();

    await expect.poll(tableState).toEqual({ selectAllMatching: true, selection: [], loaded: 25 });
    // Loaded rows must NOT have been individually selected.
    await expect(rows.first()).toHaveAttribute('aria-selected', 'false');

    await headerCheckbox.click();
    await expect.poll(tableState).toEqual({ selectAllMatching: false, selection: [], loaded: 25 });
  });
});

// Pagination lazy mode: the header checkbox selects the current page and never
// touches `selectAllMatching`.
test.describe('Table Selection - pagination lazy mode (unchanged)', () => {
  test('header checkbox still selects the current page, selectAllMatching stays false', async ({
    page,
  }) => {
    await loadComponent(
      page,
      {
        template: LAZY_TABLE_TEMPLATE_WITH_SELECTION,
        imports: ['tableModule', 'ngnTemplate', 'tableSelectionColumn'],
      },
      {
        inputs: {
          selectionMode: 'multi',
          dataSource: evalValue(
            `async (req) => ({ rows: [{ id: 1 }, { id: 2 }], total: 100, hasMore: true })`
          ),
        },
      }
    );

    const rows = getBodyRows(page);
    await expect(rows).toHaveCount(2);

    await page.locator('ngn-checkbox').first().click();

    await expect(rows.nth(0)).toHaveAttribute('aria-selected', 'true');
    await expect(rows.nth(1)).toHaveAttribute('aria-selected', 'true');

    const selectAllMatching = await page.evaluate(() => {
      const comp = (window as any).ng.getComponent(document.querySelector('ngn-table'));
      return comp.selectAllMatching();
    });
    expect(selectAllMatching).toBe(false);
  });
});

const TALL_CELL_TABLE_TEMPLATE = `
  <ngn-table
    #table
    style="height: 300px"
    [rows]="inputs().rows"
    [fieldId]="'id'"
    [virtual]="true"
    [rowHeight]="40"
  >
    <ng-template #header>
      <tr ngnTableHeadTr>
        <th [ngnTableTh]="table.column('id')">ID</th>
        <th [ngnTableTh]="table.column('name')">Name</th>
      </tr>
    </ng-template>
    <ng-template #body let-row [ngnTemplate]="table.templateTypes.body">
      <tr [ngnTableBodyTr]="row">
        <td ngnTableTd>{{ row.data.id }}</td>
        <td ngnTableTd><div style="height: 120px; width: 20px; background: red;"></div></td>
      </tr>
    </ng-template>
  </ngn-table>
`;

test.describe('Table Virtual - content-independent row tracks', () => {
  // An over-tall cell must not grow its row track (which would desync the
  // index-positioned virtual rows); it clips instead.
  test('a cell taller than rowHeight does not grow its row track or desync following rows', async ({
    page,
  }) => {
    await loadComponent(
      page,
      {
        template: TALL_CELL_TABLE_TEMPLATE,
        imports: ['tableModule', 'ngnTemplate'],
      },
      {
        inputs: {
          rows: Array.from({ length: 60 }, (_, i) => ({ id: i + 1, name: `Row ${i + 1}` })),
        },
      }
    );

    const rows = getBodyRows(page);
    await expect(rows.first()).toBeVisible();

    // Each row stays ~40px tall, not grown to the 120px cell child.
    const heights = await rows.evaluateAll(els =>
      els.map(el => Math.round(el.getBoundingClientRect().height))
    );
    for (const h of heights) {
      expect(h).toBeGreaterThanOrEqual(38);
      expect(h).toBeLessThanOrEqual(42);
    }

    // Consecutive visible rows are spaced by exactly rowHeight — no desync.
    const tops = await rows.evaluateAll(els =>
      els.map(el => Math.round(el.getBoundingClientRect().top))
    );
    const sorted = [...tops].sort((a, b) => a - b);
    for (let i = 1; i < sorted.length; i++) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(sorted[i]! - sorted[i - 1]!).toBe(40);
    }

    // The over-tall cell clips to its row box.
    const cellOverflow = await rows
      .first()
      .locator('td')
      .nth(1)
      .evaluate(el => getComputedStyle(el).overflow);
    expect(cellOverflow).toBe('hidden');
  });
});
