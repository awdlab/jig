import test, { expect } from '@playwright/test';
import { JigAttributeFilterHarness, JigFilterListBoxHarness } from '@awdlab/jig-playwright';
import { loadComponent } from '../helper/load-component';
import { expectNoA11yViolations } from '../helper/axe';
import { expectScreenshot } from '../helper/screenshot';

const USERS = [
  { label: 'Ann', value: 'ann', data: { email: 'ann@gmail.com', role: 'Admin' } },
  { label: 'Bo', value: 'bo', data: { email: 'bo@work.com', role: 'User' } },
  { label: 'Cal', value: 'cal', data: { email: 'cal@gmail.com', role: 'User' } },
];

const GROUPED = [
  { label: 'Team A', value: 'team-a', items: [USERS[0], USERS[1]] },
  { label: 'Team B', value: 'team-b', items: [USERS[2]] },
];

const ATTRIBUTES = [
  { key: 'email', label: 'Email', dataType: 'string' },
  { key: 'role', label: 'Role', dataType: 'list' },
];

const TEMPLATE = `
  <jig-filter-list-box
    label="Users"
    style="width: 320px; height: 320px"
    [items]="inputs().items"
    [attributes]="inputs().attributes"
    [allowMultiple]="inputs().allowMultiple"
    [filterLocally]="inputs().filterLocally"
    (filterChange)="output('config', $event)"
  />
`;

type Inputs = {
  items?: unknown;
  attributes?: unknown;
  allowMultiple?: boolean;
  filterLocally?: boolean;
};

function load(page: Parameters<typeof loadComponent>[0], inputs?: Inputs) {
  return loadComponent(
    page,
    { template: TEMPLATE, imports: ['filterListBox'] },
    {
      inputs: {
        items: USERS,
        attributes: ATTRIBUTES,
        allowMultiple: true,
        filterLocally: true,
        ...inputs,
      },
    }
  );
}

function harness(page: Parameters<typeof loadComponent>[0]) {
  return new JigFilterListBoxHarness(page.locator('jig-filter-list-box'));
}

async function openFilter(listBox: JigFilterListBoxHarness): Promise<JigAttributeFilterHarness> {
  await listBox.filterTrigger().click();
  const filter = listBox.attributeFilter();
  await filter.expectOpened();
  return filter;
}

async function setCondition(
  filter: JigAttributeFilterHarness,
  index: number,
  attribute: string,
  operator: string,
  value?: string
): Promise<void> {
  const attr = filter.attributeSelect(index);
  await attr.open();
  await attr.clickItemByText(attribute);

  const op = filter.operatorSelect(index);
  await op.open();
  await op.clickItemByText(operator);

  if (value !== undefined) {
    await filter.valueInput(index).fill(value);
  }
}

async function closeFilter(listBox: JigFilterListBoxHarness): Promise<void> {
  await listBox.page.keyboard.press('Escape');
  await listBox.attributeFilter().expectOpened(false);
}

test('renders a search field that narrows the list', async ({ page }) => {
  await load(page);
  const listBox = harness(page);

  await listBox.listBox().expectItemsCount(3);
  await listBox.searchInput().fill('an');

  await listBox.listBox().expectItemsCount(1);
  await expect(listBox.listBox().item).toHaveText('Ann');
});

test('holds the typed text back until the debounce elapses', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `
        <jig-filter-list-box
          label="Users"
          style="width: 320px; height: 320px"
          [items]="inputs().items"
          [searchDebounce]="inputs().searchDebounce"
        />
      `,
      imports: ['filterListBox'],
    },
    { inputs: { items: USERS, searchDebounce: 1500 } }
  );
  const listBox = harness(page);

  await listBox.searchInput().fill('an');
  await listBox.listBox().expectItemsCount(3);
  await page.waitForTimeout(700);
  await listBox.listBox().expectItemsCount(3);

  // Once the timer fires the text reaches the list.
  await listBox.listBox().expectItemsCount(1);
  await expect(listBox.listBox().item).toHaveText('Ann');

  // A zero debounce writes through without a timer at all.
  await handle.setInputs({ items: USERS, searchDebounce: 0 });
  await listBox.searchInput().fill('bo');
  await expect(listBox.listBox().item).toHaveText('Bo', { timeout: 1000 });
});

test('does not select while disabled or readonly', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `
        <jig-filter-list-box
          label="Users"
          style="width: 320px; height: 320px"
          [items]="inputs().items"
          [disabled]="inputs().disabled"
          [readonly]="inputs().readonly"
          (valueChange)="output('value', $event)"
        />
      `,
      imports: ['filterListBox'],
    },
    { inputs: { items: USERS, disabled: true, readonly: false } }
  );
  const listBox = harness(page);

  await listBox.listBox().item.first().click();
  await page.waitForTimeout(100);
  await expect(listBox.listBox().itemSelected).toHaveCount(0);
  expect((await handle.getOutputLog())['value']).toBeUndefined();
  // Disabled also takes the list out of the tab order.
  await expect(listBox.listBox().locator).not.toHaveAttribute('tabindex', '0');

  await handle.setInputs({ items: USERS, disabled: false, readonly: true });
  await listBox.listBox().item.first().click();
  await page.waitForTimeout(100);
  await expect(listBox.listBox().itemSelected).toHaveCount(0);
  expect((await handle.getOutputLog())['value']).toBeUndefined();

  await handle.setInputs({ items: USERS, disabled: false, readonly: false });
  await listBox.listBox().item.first().click();
  await expect(listBox.listBox().itemSelected).toHaveCount(1);
  await expect(async () => {
    expect((await handle.getOutputLog())['value']?.at(-1)).toBe('ann');
  }).toPass();
});

test('renders no filter trigger when attributes is not given', async ({ page }) => {
  await load(page, { attributes: null });
  const listBox = harness(page);

  await listBox.listBox().expectItemsCount(3);
  await expect(listBox.filterTrigger()).toHaveCount(0);
  await expect(listBox.chips()).toHaveCount(0);
  await expect(listBox.searchInput().locator).toBeVisible();
});

test('narrows by attribute conditions and search text together', async ({ page }) => {
  await load(page);
  const listBox = harness(page);

  const filter = await openFilter(listBox);
  await setCondition(filter, 0, 'Email', 'Contains', '@gmail');
  await closeFilter(listBox);

  await listBox.listBox().expectItemsCount(2);

  await listBox.searchInput().fill('cal');

  await listBox.listBox().expectItemsCount(1);
  await expect(listBox.listBox().item).toHaveText('Cal');
});

test('shows the active condition count on the trigger badge', async ({ page }) => {
  await load(page);
  const listBox = harness(page);

  await expect(listBox.badge()).toHaveCount(0);

  const filter = await openFilter(listBox);
  await setCondition(filter, 0, 'Email', 'Contains', '@gmail');

  await expect(listBox.badge()).toHaveText('1');

  await filter.addConditionButton().click();
  await setCondition(filter, 1, 'Email', 'Ends with', '.com');

  await expect(listBox.badge()).toHaveText('2');
});

test('renders one removable chip per active condition', async ({ page }) => {
  await load(page);
  const listBox = harness(page);

  await expect(listBox.chips()).toHaveCount(0);

  const filter = await openFilter(listBox);
  await setCondition(filter, 0, 'Email', 'Contains', '@gmail');
  await filter.addConditionButton().click();
  await setCondition(filter, 1, 'Role', 'Is one of', undefined);
  const roleValues = filter.valueSelect(1);
  await roleValues.open();
  await roleValues.clickItemByText('Admin', false);
  await roleValues.close();
  await closeFilter(listBox);

  await expect(listBox.chips()).toHaveCount(2);
  await expect(listBox.chip(0).content).toHaveText('Email Contains @gmail');
  // A list value renders its parsed entries, never the raw JSON payload.
  await expect(listBox.chip(1).content).toHaveText('Role Is one of Admin');
  await expect(listBox.chip(0).closeButton).toBeVisible();
});

test('removing a chip drops that condition', async ({ page }) => {
  const handle = await load(page);
  const listBox = harness(page);

  const filter = await openFilter(listBox);
  await setCondition(filter, 0, 'Email', 'Contains', '@gmail');
  await filter.addConditionButton().click();
  await setCondition(filter, 1, 'Email', 'Starts with', 'ann');
  await closeFilter(listBox);

  await listBox.listBox().expectItemsCount(1);
  await expect(listBox.chips()).toHaveCount(2);

  await listBox.removeChip(1);

  await expect(listBox.chips()).toHaveCount(1);
  await listBox.listBox().expectItemsCount(2);
  await expect(async () => {
    const config = (await handle.getOutputLog())['config']?.at(-1);
    expect(config.conditions).toEqual([
      { attribute: 'email', operator: 'contains', rawValue: '@gmail' },
    ]);
  }).toPass();
});

test('clears the filter when the only chip is removed and allowMultiple is false', async ({
  page,
}) => {
  const handle = await load(page, { allowMultiple: false });
  const listBox = harness(page);

  const filter = await openFilter(listBox);
  await setCondition(filter, 0, 'Email', 'Contains', '@gmail');
  await closeFilter(listBox);

  await expect(listBox.chips()).toHaveCount(1);
  await expect(filter.addConditionButton()).toHaveCount(0);

  await listBox.removeChip(0);

  await expect(listBox.chips()).toHaveCount(0);
  await expect(listBox.badge()).toHaveCount(0);
  await listBox.listBox().expectItemsCount(3);
  await expect(async () => {
    expect((await handle.getOutputLog())['config']?.at(-1)).toBeNull();
  }).toPass();
});

test('allows multiple conditions out of the box', async ({ page }) => {
  // No [allowMultiple] binding at all, so the control's own default applies.
  await loadComponent(
    page,
    {
      template: `
        <jig-filter-list-box
          label="Users"
          style="width: 320px; height: 320px"
          [items]="inputs().items"
          [attributes]="inputs().attributes"
        />
      `,
      imports: ['filterListBox'],
    },
    { inputs: { items: USERS, attributes: ATTRIBUTES } }
  );
  const listBox = harness(page);

  const filter = await openFilter(listBox);
  await expect(filter.addConditionButton()).toBeVisible();

  await setCondition(filter, 0, 'Email', 'Contains', '@gmail');
  await filter.addConditionButton().click();
  await setCondition(filter, 1, 'Email', 'Starts with', 'ann');
  await closeFilter(listBox);

  await expect(listBox.chips()).toHaveCount(2);
  await listBox.listBox().expectItemsCount(1);
});

test('emits config and leaves items untouched when filterLocally is false', async ({ page }) => {
  const handle = await load(page, { filterLocally: false });
  const listBox = harness(page);

  const filter = await openFilter(listBox);
  await setCondition(filter, 0, 'Email', 'Contains', '@gmail');
  await closeFilter(listBox);

  await expect(async () => {
    const config = (await handle.getOutputLog())['config']?.at(-1);
    expect(config.conditions).toEqual([
      { attribute: 'email', operator: 'contains', rawValue: '@gmail' },
    ]);
  }).toPass();

  // Chips and badge read the configuration, so they are unaffected by who evaluates it.
  await expect(listBox.chips()).toHaveCount(1);
  await expect(listBox.badge()).toHaveText('1');
  await listBox.listBox().expectItemsCount(3);
});

test('shows clear all filters in the empty state and clears both filters', async ({ page }) => {
  await load(page);
  const listBox = harness(page);

  const filter = await openFilter(listBox);
  await setCondition(filter, 0, 'Email', 'Contains', '@gmail');
  await closeFilter(listBox);
  await listBox.searchInput().fill('zzz');

  await listBox.listBox().expectItemsCount(0);
  await expect(listBox.clearAllButton()).toBeVisible();

  await listBox.clearAllButton().click();

  await listBox.listBox().expectItemsCount(3);
  await expect(listBox.chips()).toHaveCount(0);
  await listBox.searchInput().expectValue('');
});

test('shows the plain empty state when items was empty to begin with', async ({ page }) => {
  await load(page, { items: [] });
  const listBox = harness(page);

  await listBox.listBox().expectItemsCount(0);
  await expect(listBox.locator.getByRole('status')).toBeVisible();
  await expect(listBox.clearAllButton()).toHaveCount(0);
});

test('keeps a consumer-supplied empty template instead of the clear-all action', async ({
  page,
}) => {
  await loadComponent(
    page,
    {
      template: `
        <jig-filter-list-box
          style="width: 320px; height: 320px"
          [items]="inputs().items"
          [attributes]="inputs().attributes"
        >
          <ng-template #empty>Nobody here</ng-template>
        </jig-filter-list-box>
      `,
      imports: ['filterListBox'],
    },
    { inputs: { items: USERS, attributes: ATTRIBUTES } }
  );
  const listBox = harness(page);

  await listBox.searchInput().fill('zzz');

  await expect(listBox.locator.getByText('Nobody here')).toBeVisible();
  await expect(listBox.clearAllButton()).toHaveCount(0);
});

test('keeps a group whose children match', async ({ page }) => {
  await load(page, { items: GROUPED });
  const listBox = harness(page);

  const filter = await openFilter(listBox);
  await setCondition(filter, 0, 'Email', 'Contains', '@work');
  await closeFilter(listBox);

  await listBox.listBox().expectItemsCount(1);
  await expect(listBox.listBox().group).toHaveCount(1);
  await expect(listBox.listBox().group).toHaveText('Team A');
  await expect(listBox.listBox().item).toHaveText('Bo');
});

test('has no axe violations with chips and the popover open', async ({ page }) => {
  await load(page);
  const listBox = harness(page);

  const filter = await openFilter(listBox);
  await setCondition(filter, 0, 'Email', 'Contains', '@gmail');
  await expect(listBox.chips()).toHaveCount(1);

  await expectNoA11yViolations(page);
});

test('matches the screenshot with search text and two chips', async ({ page }, testInfo) => {
  await load(page);
  const listBox = harness(page);

  const filter = await openFilter(listBox);
  await setCondition(filter, 0, 'Email', 'Contains', '@gmail');
  await filter.addConditionButton().click();
  await setCondition(filter, 1, 'Email', 'Ends with', '.com');
  await closeFilter(listBox);

  await listBox.searchInput().fill('a');
  await expect(listBox.chips()).toHaveCount(2);

  await expectScreenshot(page, testInfo, 'chips');
});
