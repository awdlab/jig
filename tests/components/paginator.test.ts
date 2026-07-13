import test, { expect } from '@playwright/test';
import { loadComponent } from '../helper/load-component';
import { expectNoA11yViolations } from '../helper/axe';

// 30 items at 10 per page => 3 pages, few enough to render without overflow.
const TEMPLATE = `<ngn-paginator
  [totalItems]="inputs().totalItems"
  [pageSize]="inputs().pageSize"
  [fixedPageSize]="inputs().fixedPageSize"
  (value)="output('value', $event)"
/>`;

const baseInputs = { totalItems: 30, pageSize: 10, fixedPageSize: false };

test('renders a page button per page and marks the current one', async ({ page }) => {
  await loadComponent(page, { template: TEMPLATE, imports: ['paginator'] }, { inputs: baseInputs });

  const paginator = page.locator('ngn-paginator');
  await expect(paginator.getByLabel('Previous page')).toBeVisible();
  await expect(paginator.getByLabel('Next page')).toBeVisible();

  // Page one is current on load.
  const current = paginator.locator('[aria-current="page"]');
  await expect(current).toHaveCount(1);
  await expect(current).toHaveText('1');
});

test('next / previous navigation moves the current page and emits state', async ({ page }) => {
  const handle = await loadComponent(
    page,
    { template: TEMPLATE, imports: ['paginator'] },
    { inputs: baseInputs }
  );

  const paginator = page.locator('ngn-paginator');
  const current = paginator.locator('[aria-current="page"]');

  await paginator.getByLabel('Next page').click();
  await expect(current).toHaveText('2');

  let last = (await handle.getOutputLog())['value']!.at(-1);
  expect(last.page.current).toBe(1);
  expect(last.page.size).toBe(10);
  expect(last.slice).toEqual({ skip: 10, take: 10 });

  await paginator.getByLabel('Previous page').click();
  await expect(current).toHaveText('1');

  last = (await handle.getOutputLog())['value']!.at(-1);
  expect(last.page.current).toBe(0);
  expect(last.slice.skip).toBe(0);
});

test('clicking a page number jumps directly to that page', async ({ page }) => {
  const handle = await loadComponent(
    page,
    { template: TEMPLATE, imports: ['paginator'] },
    { inputs: baseInputs }
  );

  const paginator = page.locator('ngn-paginator');
  await paginator.getByRole('button', { name: '3', exact: true }).click();

  await expect(paginator.locator('[aria-current="page"]')).toHaveText('3');
  expect((await handle.getOutputLog())['value']!.at(-1).page.current).toBe(2);
});

test('navigation clamps at the first and last page', async ({ page }) => {
  await loadComponent(page, { template: TEMPLATE, imports: ['paginator'] }, { inputs: baseInputs });

  const paginator = page.locator('ngn-paginator');
  const current = paginator.locator('[aria-current="page"]');

  // Already on the first page — Previous is a no-op.
  await paginator.getByLabel('Previous page').click();
  await expect(current).toHaveText('1');

  // Walk to the last page and confirm Next stops there.
  await paginator.getByLabel('Next page').click();
  await paginator.getByLabel('Next page').click();
  await expect(current).toHaveText('3');
  await paginator.getByLabel('Next page').click();
  await expect(current).toHaveText('3');
});

test('fixedPageSize hides the page-size selector', async ({ page }) => {
  const handle = await loadComponent(
    page,
    { template: TEMPLATE, imports: ['paginator', 'select'] },
    { inputs: { ...baseInputs, fixedPageSize: true } }
  );

  const paginator = page.locator('ngn-paginator');
  await expect(paginator.locator('ngn-select')).toHaveCount(0);

  // Re-enabling the selector renders the select control.
  await handle.setInputs({ fixedPageSize: false });
  await expect(paginator.locator('ngn-select')).toHaveCount(1);
});

test('accessibility (axe)', async ({ page }) => {
  // fixedPageSize hides the page-size selector, leaving the labelled nav
  // buttons and page-number buttons to scan.
  await loadComponent(
    page,
    { template: TEMPLATE, imports: ['paginator'] },
    { inputs: { ...baseInputs, fixedPageSize: true } }
  );

  const paginator = page.locator('ngn-paginator');
  await expect(paginator.getByLabel('Next page')).toBeVisible();

  await expectNoA11yViolations(page);
});
