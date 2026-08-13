import test, { expect } from '@playwright/test';
import { JigPaginatorHarness } from '@awdlab/jig-playwright';
import { loadComponent } from '../helper/load-component';
import { useRtl } from '../helper/direction';
import { expectNoA11yViolations } from '../helper/axe';
import { expectScreenshot } from '../helper/screenshot';

// 30 items at 10 per page => 3 pages, few enough to render without overflow.
const TEMPLATE = `<jig-paginator
  [totalItems]="inputs().totalItems"
  [pageSize]="inputs().pageSize"
  [fixedPageSize]="inputs().fixedPageSize"
  (value)="output('value', $event)"
/>`;

const baseInputs = { totalItems: 30, pageSize: 10, fixedPageSize: false };

test('renders a page button per page and marks the current one', async ({ page }) => {
  await loadComponent(page, { template: TEMPLATE, imports: ['paginator'] }, { inputs: baseInputs });

  const paginator = page.locator('jig-paginator');
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

  const paginator = new JigPaginatorHarness(page.locator('jig-paginator'));
  await paginator.expectPageCount(3);

  await paginator.goToNext();
  await paginator.expectCurrentPage(2);

  let last = (await handle.getOutputLog())['value']!.at(-1);
  expect(last.page.current).toBe(1);
  expect(last.page.size).toBe(10);
  expect(last.slice).toEqual({ skip: 10, take: 10 });

  await paginator.goToPrevious();
  await paginator.expectCurrentPage(1);

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

  const paginator = page.locator('jig-paginator');
  await paginator.getByRole('button', { name: '3', exact: true }).click();

  await expect(paginator.locator('[aria-current="page"]')).toHaveText('3');
  expect((await handle.getOutputLog())['value']!.at(-1).page.current).toBe(2);
});

test('navigation clamps at the first and last page', async ({ page }) => {
  await loadComponent(page, { template: TEMPLATE, imports: ['paginator'] }, { inputs: baseInputs });

  const paginator = page.locator('jig-paginator');
  const current = paginator.locator('[aria-current="page"]');

  // Already on the first page — Previous is disabled.
  await expect(paginator.getByLabel('Previous page')).toBeDisabled();
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

  const paginator = page.locator('jig-paginator');
  await expect(paginator.locator('jig-select')).toHaveCount(0);

  // Re-enabling the selector renders the select control.
  await handle.setInputs({ fixedPageSize: false });
  await expect(paginator.locator('jig-select')).toHaveCount(1);
});

const COMPACT_TEMPLATE = `<jig-paginator
  [mode]="'compact'"
  [hasNext]="inputs().hasNext"
  [pageSize]="inputs().pageSize"
  (value)="output('value', $event)"
/>`;

test('compact mode shows only prev/next, no page numbers', async ({ page }) => {
  await loadComponent(
    page,
    { template: COMPACT_TEMPLATE, imports: ['paginator'] },
    { inputs: { hasNext: true, pageSize: 10 } }
  );

  const paginator = page.locator('jig-paginator');
  // No clickable page-number buttons in compact mode…
  await expect(paginator.getByRole('button', { name: /^\d+$/ })).toHaveCount(0);
  await expect(paginator.getByLabel('Next page')).toBeEnabled();
  // …but the current page index is still shown between prev/next.
  const indicator = paginator.locator('[data-compact-page]');
  await expect(indicator).toHaveText('1');
  await paginator.getByLabel('Next page').click();
  await expect(indicator).toHaveText('2');
});

test('compact mode disables next when hasNext is false', async ({ page }) => {
  const handle = await loadComponent(
    page,
    { template: COMPACT_TEMPLATE, imports: ['paginator'] },
    { inputs: { hasNext: false, pageSize: 10 } }
  );

  const paginator = page.locator('jig-paginator');
  await expect(paginator.getByLabel('Next page')).toBeDisabled();

  await handle.setInputs({ hasNext: true });
  await expect(paginator.getByLabel('Next page')).toBeEnabled();
});

test('compact mode advances a single page even with shift/ctrl held', async ({ page }) => {
  await loadComponent(
    page,
    { template: COMPACT_TEMPLATE, imports: ['paginator'] },
    { inputs: { hasNext: true, pageSize: 10 } }
  );

  const paginator = page.locator('jig-paginator');
  const indicator = paginator.locator('[data-compact-page]');
  await expect(indicator).toHaveText('1');

  // Compact drives cursor pagination — a modifier must not multi-jump past a
  // page whose continuation cursor isn't known yet.
  await paginator.getByLabel('Next page').click({ modifiers: ['Shift'] });
  await expect(indicator).toHaveText('2');
  await paginator.getByLabel('Previous page').click({ modifiers: ['Shift'] });
  await expect(indicator).toHaveText('1');
});

test('accessibility (axe)', async ({ page }) => {
  // fixedPageSize hides the page-size selector, leaving the labelled nav
  // buttons and page-number buttons to scan.
  await loadComponent(
    page,
    { template: TEMPLATE, imports: ['paginator'] },
    { inputs: { ...baseInputs, fixedPageSize: true } }
  );

  const paginator = page.locator('jig-paginator');
  await expect(paginator.getByLabel('Next page')).toBeVisible();

  await expectNoA11yViolations(page);
});

test('visual', async ({ page }, testInfo) => {
  await loadComponent(
    page,
    { template: `<div class="page-center">${TEMPLATE}</div>`, imports: ['paginator'] },
    { inputs: baseInputs }
  );

  await expect(page.locator('jig-paginator [aria-current="page"]')).toHaveText('1');
  await expectScreenshot(page, testInfo, 'pages');
});

test('rtl', async ({ page }, testInfo) => {
  await useRtl(page);
  await loadComponent(page, { template: TEMPLATE, imports: ['paginator'] }, { inputs: baseInputs });
  await expectScreenshot(page, testInfo);
});
