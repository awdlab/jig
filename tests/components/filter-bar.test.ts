import test, { expect } from '@playwright/test';
import { loadComponent } from '../helper/load-component';
import { JigFilterBarHarness } from '@awdlab/jig-playwright';
import { expectNoA11yViolations } from '../helper/axe';
import { expectScreenshot } from '../helper/screenshot';

const USERS = [
  { name: 'Ann', email: 'ann@gmail.com', role: 'Admin', joined: '2024-01-15' },
  { name: 'Bo', email: 'bo@work.com', role: 'User', joined: '2023-06-01' },
  { name: 'Cal', email: 'cal@gmail.com', role: 'User', joined: '2024-03-20' },
];

const PROPERTIES = [
  { key: 'name', label: 'Name', dataType: 'string' },
  { key: 'email', label: 'Email', dataType: 'string' },
  { key: 'role', label: 'Role', dataType: 'list' },
  { key: 'joined', label: 'Joined', dataType: 'date' },
];

const TEMPLATE = `
  <jig-filter-bar
    [data]="inputs().data"
    [properties]="inputs().properties"
    [searchDebounce]="inputs().searchDebounce"
    (filterChange)="output('config', $event)"
    (filterResultChange)="output('filtered', $event)"
    style="width: 420px"
  />
`;

function load(page: Parameters<typeof loadComponent>[0], inputs: Record<string, unknown> = {}) {
  return loadComponent(
    page,
    { template: TEMPLATE, imports: ['filterBar'] },
    { inputs: { data: USERS, properties: PROPERTIES, searchDebounce: 0, ...inputs } }
  );
}

const names = (rows: unknown): string[] =>
  (rows as { name: string }[] | undefined)?.map(r => r.name) ?? [];

test('narrows the data by the search text', async ({ page }) => {
  const handle = await load(page);
  const bar = new JigFilterBarHarness(page.locator('jig-filter-bar'));

  await bar.searchInput().fill('gmail');
  await expect(async () => {
    const log = await handle.getOutputLog();
    expect(names(log['filtered']?.at(-1))).toEqual(['Ann', 'Cal']);
  }).toPass();
});

test('searches every declared property by default', async ({ page }) => {
  const handle = await load(page);
  const bar = new JigFilterBarHarness(page.locator('jig-filter-bar'));

  // 'Admin' appears only in the role property.
  await bar.searchInput().fill('Admin');
  await expect(async () => {
    const log = await handle.getOutputLog();
    expect(names(log['filtered']?.at(-1))).toEqual(['Ann']);
  }).toPass();
});

test('renders no filter trigger without properties', async ({ page }) => {
  await load(page, { properties: null });
  const bar = new JigFilterBarHarness(page.locator('jig-filter-bar'));

  await expect(bar.searchInput().locator).toBeVisible();
  await expect(bar.filterTrigger()).toHaveCount(0);
});

test('narrows by a condition and the search text together', async ({ page }) => {
  const handle = await load(page);
  const bar = new JigFilterBarHarness(page.locator('jig-filter-bar'));

  await bar.filterTrigger().click();
  const builder = bar.filterBuilder();
  await builder.expectOpened(true);

  const property = builder.propertySelect(0);
  await property.open();
  await property.clickItemByText('Email');
  const operator = builder.operatorSelect(0);
  await operator.open();
  await operator.clickItemByText('Contains');
  await builder.valueInput(0).fill('gmail');

  await expect(async () => {
    const log = await handle.getOutputLog();
    expect(names(log['filtered']?.at(-1))).toEqual(['Ann', 'Cal']);
  }).toPass();

  await bar.searchInput().fill('Cal');
  await expect(async () => {
    const log = await handle.getOutputLog();
    expect(names(log['filtered']?.at(-1))).toEqual(['Cal']);
  }).toPass();
});

test('shows the active condition count on the trigger badge', async ({ page }) => {
  await load(page);
  const bar = new JigFilterBarHarness(page.locator('jig-filter-bar'));

  await bar.filterTrigger().click();
  const builder = bar.filterBuilder();
  const property = builder.propertySelect(0);
  await property.open();
  await property.clickItemByText('Email');
  await builder.valueInput(0).fill('gmail');

  await expect(bar.badge()).toHaveText('1');
});

test('renders one removable chip per active condition', async ({ page }) => {
  const handle = await load(page);
  const bar = new JigFilterBarHarness(page.locator('jig-filter-bar'));

  await bar.filterTrigger().click();
  const builder = bar.filterBuilder();
  const property = builder.propertySelect(0);
  await property.open();
  await property.clickItemByText('Email');
  await builder.valueInput(0).fill('gmail');

  await expect(bar.chips()).toHaveCount(1);
  await expect(bar.chips().first()).toContainText('Email');

  await bar.removeChip(0);
  await expect(bar.chips()).toHaveCount(0);
  await expect(async () => {
    const log = await handle.getOutputLog();
    expect(log['config']?.at(-1)).toBeNull();
  }).toPass();
});

test('emits config and leaves the data untouched when filterLocally is false', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `
        <jig-filter-bar
          [data]="inputs().data"
          [properties]="inputs().properties"
          [filterLocally]="false"
          [searchDebounce]="0"
          (filterChange)="output('config', $event)"
          (filterResultChange)="output('filtered', $event)"
          style="width: 420px"
        />
      `,
      imports: ['filterBar'],
    },
    { inputs: { data: USERS, properties: PROPERTIES } }
  );

  const bar = new JigFilterBarHarness(page.locator('jig-filter-bar'));
  await bar.filterTrigger().click();
  const builder = bar.filterBuilder();
  const property = builder.propertySelect(0);
  await property.open();
  await property.clickItemByText('Email');
  await builder.valueInput(0).fill('gmail');

  await expect(bar.chips()).toHaveCount(1);
  const log = await handle.getOutputLog();
  expect(log['config']?.at(-1)).toBeTruthy();
  expect(log['filtered']).toBeUndefined();
});

test('holds the typed text back until the debounce elapses', async ({ page }) => {
  const handle = await load(page, { searchDebounce: 1500 });
  const bar = new JigFilterBarHarness(page.locator('jig-filter-bar'));

  await bar.searchInput().fill('Ann');
  // Still unfiltered while the timer runs; a removed debounce would already show Ann alone.
  expect(names((await handle.getOutputLog())['filtered']?.at(-1))).toEqual(['Ann', 'Bo', 'Cal']);

  await expect(async () => {
    const log = await handle.getOutputLog();
    expect(names(log['filtered']?.at(-1))).toEqual(['Ann']);
  }).toPass({ timeout: 5000 });
});

test('has no axe violations with chips and the popover open', async ({ page }) => {
  await load(page);
  const bar = new JigFilterBarHarness(page.locator('jig-filter-bar'));

  await bar.filterTrigger().click();
  const builder = bar.filterBuilder();
  const property = builder.propertySelect(0);
  await property.open();
  await property.clickItemByText('Email');
  await builder.valueInput(0).fill('gmail');

  await expectNoA11yViolations(page);
});

test('matches the screenshot with search text and a chip', async ({ page }, testInfo) => {
  await load(page);
  const bar = new JigFilterBarHarness(page.locator('jig-filter-bar'));

  await bar.filterTrigger().click();
  const builder = bar.filterBuilder();
  const property = builder.propertySelect(0);
  await property.open();
  await property.clickItemByText('Email');
  await builder.valueInput(0).fill('gmail');
  // The chip only appears once auto-apply commits, so close after it lands.
  await expect(bar.chips()).toHaveCount(1);
  await page.keyboard.press('Escape');
  await builder.expectOpened(false);
  await bar.searchInput().fill('Ann');

  await expectScreenshot(page, testInfo, 'chip');
});
