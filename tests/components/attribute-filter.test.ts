import test, { expect } from '@playwright/test';
import { loadComponent } from '../helper/load-component';
import { JigAttributeFilterHarness, JigCalendarHarness } from '@awdlab/jig-playwright';
import { expectNoA11yViolations } from '../helper/axe';
import { expectScreenshot } from '../helper/screenshot';

const USERS = [
  { name: 'Ann', email: 'ann@gmail.com', role: 'Admin', age: 31, joined: '2024-01-15' },
  { name: 'Bo', email: 'bo@work.com', role: 'User', age: 44, joined: '2023-06-01' },
  { name: 'Cal', email: 'cal@gmail.com', role: 'User', age: 22, joined: '2024-03-20' },
];

const ATTRIBUTES = [
  { key: 'name', label: 'Name', dataType: 'string' },
  { key: 'email', label: 'Email', dataType: 'string' },
  { key: 'age', label: 'Age', dataType: 'number' },
  { key: 'joined', label: 'Joined', dataType: 'date' },
  { key: 'role', label: 'Role', dataType: 'list' },
];

const INLINE_TEMPLATE = `
  <jig-attribute-filter
    mode="inline"
    [data]="inputs().data"
    [attributes]="inputs().attributes"
    [allowMultiple]="true"
    (filterChange)="output('config', $event)"
    (filterResultChange)="output('filtered', $event)"
    style="width: 560px"
  />
`;

function inlineComponent(page: Parameters<typeof loadComponent>[0]) {
  return loadComponent(
    page,
    { template: INLINE_TEMPLATE, imports: ['attributeFilter'] },
    { inputs: { data: USERS, attributes: ATTRIBUTES } }
  );
}

async function setCondition(
  filter: JigAttributeFilterHarness,
  index: number,
  attribute: string,
  operator: string,
  value?: string
) {
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

test('filters on the attribute chosen in the row', async ({ page }) => {
  const handle = await inlineComponent(page);
  const filter = new JigAttributeFilterHarness(page.locator('jig-attribute-filter'));

  await setCondition(filter, 0, 'Email', 'Contains', '@gmail');

  await expect(async () => {
    const log = await handle.getOutputLog();
    expect(log['config']?.at(-1).conditions[0].attribute).toBe('email');
    expect(log['filtered']?.at(-1)).toEqual([USERS[0], USERS[2]]);
  }).toPass();
});

test('joins two conditions on different attributes with and', async ({ page }) => {
  const handle = await inlineComponent(page);
  const filter = new JigAttributeFilterHarness(page.locator('jig-attribute-filter'));

  await setCondition(filter, 0, 'Email', 'Contains', '@gmail');
  await filter.addConditionButton().click();
  await setCondition(filter, 1, 'Age', 'Greater than', '25');

  await expect(async () => {
    const log = await handle.getOutputLog();
    const config = log['config']?.at(-1);
    expect(config.matchMode).toBe('all');
    expect(config.conditions.map((c: { attribute: string }) => c.attribute)).toEqual([
      'email',
      'age',
    ]);
    expect(log['filtered']?.at(-1)).toEqual([USERS[0]]);
  }).toPass();
});

test('flips the whole set to or when the divider is clicked', async ({ page }) => {
  const handle = await inlineComponent(page);
  const filter = new JigAttributeFilterHarness(page.locator('jig-attribute-filter'));

  await setCondition(filter, 0, 'Name', 'Contains', 'ann');
  await filter.addConditionButton().click();
  await setCondition(filter, 1, 'Age', 'Greater than', '40');

  await expect(async () => {
    const log = await handle.getOutputLog();
    expect(log['filtered']?.at(-1)).toEqual([]);
  }).toPass();

  await filter.matchModeDivider().click();

  await expect(async () => {
    const log = await handle.getOutputLog();
    expect(log['config']?.at(-1).matchMode).toBe('any');
    expect(log['filtered']?.at(-1)).toEqual([USERS[0], USERS[1]]);
  }).toPass();
});

test('resets operator and value when the row switches to an attribute of another dataType', async ({
  page,
}) => {
  const handle = await inlineComponent(page);
  const filter = new JigAttributeFilterHarness(page.locator('jig-attribute-filter'));

  await setCondition(filter, 0, 'Email', 'Contains', 'ann@');

  // Another string attribute keeps the operator and the typed value.
  const attr = filter.attributeSelect(0);
  await attr.open();
  await attr.clickItemByText('Name');

  await expect(async () => {
    const config = (await handle.getOutputLog())['config']?.at(-1);
    expect(config.conditions[0]).toEqual({
      attribute: 'name',
      operator: 'contains',
      rawValue: 'ann@',
    });
  }).toPass();

  // A different dataType resets both.
  await attr.open();
  await attr.clickItemByText('Age');

  await expect(async () => {
    const log = await handle.getOutputLog();
    expect(log['config']?.at(-1).conditions[0]).toEqual({
      attribute: 'age',
      operator: 'isEqual',
      rawValue: null,
    });
    expect(log['filtered']?.at(-1)).toEqual(USERS);
  }).toPass();
  await filter.valueInput(0).expectValue('');
});

test('renders a calendar value editor for a date attribute', async ({ page }) => {
  await inlineComponent(page);
  const filter = new JigAttributeFilterHarness(page.locator('jig-attribute-filter'));

  const attr = filter.attributeSelect(0);
  await attr.open();
  await attr.clickItemByText('Joined');

  await expect(filter.row(0).locator('jig-calendar')).toBeVisible();
  await expect(filter.valueInput(0).locator).toHaveCount(0);
});

test('renders an operator select and a multi-select for a list attribute', async ({ page }) => {
  const handle = await inlineComponent(page);
  const filter = new JigAttributeFilterHarness(page.locator('jig-attribute-filter'));

  const attr = filter.attributeSelect(0);
  await attr.open();
  await attr.clickItemByText('Role');

  const op = filter.operatorSelect(0);
  await expect(op.locator).toBeVisible();
  await op.expectSelectedItemText('Is one of');

  const values = filter.valueSelect(0);
  await values.open();
  await values.clickItemByText('Admin', false);
  await values.close();

  await expect(async () => {
    const log = await handle.getOutputLog();
    const condition = log['config']?.at(-1).conditions[0];
    expect(condition.attribute).toBe('role');
    expect(condition.operator).toBe('in');
    expect(JSON.parse(condition.rawValue)).toEqual(['Admin']);
    expect(log['filtered']?.at(-1)).toEqual([USERS[0]]);
  }).toPass();
});

test('inline mode renders without a popover', async ({ page }) => {
  await inlineComponent(page);
  const filter = new JigAttributeFilterHarness(page.locator('jig-attribute-filter'));

  await expect(filter.attributeSelect(0).locator).toBeVisible();
  await expect(filter.trigger).toHaveCount(0);
  await filter.expectOpened(false);
});

test('emits config only and leaves data untouched when filterLocally is false', async ({
  page,
}) => {
  const handle = await loadComponent(
    page,
    {
      template: `
        <jig-attribute-filter
          mode="inline"
          [data]="inputs().data"
          [attributes]="inputs().attributes"
          [filterLocally]="false"
          (filterChange)="output('config', $event)"
          (filterResultChange)="output('filtered', $event)"
          style="width: 560px"
        />
      `,
      imports: ['attributeFilter'],
    },
    { inputs: { data: USERS, attributes: ATTRIBUTES } }
  );

  const filter = new JigAttributeFilterHarness(page.locator('jig-attribute-filter'));
  await setCondition(filter, 0, 'Email', 'Contains', '@gmail');

  await expect(async () => {
    const log = await handle.getOutputLog();
    expect(log['config']?.at(-1).conditions[0]).toEqual({
      attribute: 'email',
      operator: 'contains',
      rawValue: '@gmail',
    });
    expect(log['filtered']).toBeUndefined();
  }).toPass();
});

test('manual mode commits only on apply and restores on cancel', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `
        <jig-attribute-filter
          mode="inline"
          [autoApply]="false"
          [data]="inputs().data"
          [attributes]="inputs().attributes"
          (filterChange)="output('config', $event)"
          (filterResultChange)="output('filtered', $event)"
          style="width: 560px"
        />
      `,
      imports: ['attributeFilter'],
    },
    { inputs: { data: USERS, attributes: ATTRIBUTES } }
  );

  const filter = new JigAttributeFilterHarness(page.locator('jig-attribute-filter'));
  await expect(filter.clearButton()).toHaveCount(0);

  await setCondition(filter, 0, 'Email', 'Contains', '@gmail');

  // Nothing committed yet.
  await expect(async () => {
    const log = await handle.getOutputLog();
    expect(log['filtered']?.at(-1)).toEqual(USERS);
  }).toPass();

  await filter.applyButton().click();

  await expect(async () => {
    const log = await handle.getOutputLog();
    expect(log['filtered']?.at(-1)).toEqual([USERS[0], USERS[2]]);
  }).toPass();

  await filter.valueInput(0).fill('@work');
  await filter.cancelButton().click();

  await filter.valueInput(0).expectValue('@gmail');
  await expect(async () => {
    const log = await handle.getOutputLog();
    expect(log['filtered']?.at(-1)).toEqual([USERS[0], USERS[2]]);
  }).toPass();
});

test('has no axe violations with the popover open', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `
        <jig-attribute-filter
          [data]="inputs().data"
          [attributes]="inputs().attributes"
          [allowMultiple]="true"
          style="width: 360px"
        />
      `,
      imports: ['attributeFilter'],
    },
    { inputs: { data: USERS, attributes: ATTRIBUTES } }
  );

  const filter = new JigAttributeFilterHarness(page.locator('jig-attribute-filter'));
  await filter.open();

  await expectNoA11yViolations(page);
});

test('matches the screenshot with two conditions', async ({ page }, testInfo) => {
  await loadComponent(
    page,
    {
      template: `
        <jig-attribute-filter
          class="page-center"
          mode="inline"
          [data]="inputs().data"
          [attributes]="inputs().attributes"
          [allowMultiple]="true"
          style="width: 560px"
        />
      `,
      imports: ['attributeFilter'],
    },
    { inputs: { data: USERS, attributes: ATTRIBUTES } }
  );

  const filter = new JigAttributeFilterHarness(page.locator('jig-attribute-filter'));
  await setCondition(filter, 0, 'Email', 'Contains', '@gmail');
  await filter.addConditionButton().click();
  await setCondition(filter, 1, 'Age', 'Greater than', '25');
  await expect(filter.matchModeDivider()).toBeVisible();

  await expectScreenshot(page, testInfo, 'inline');
});

const GMAIL = { attribute: 'email', operator: 'contains', rawValue: '@gmail' };
const OVER_25 = { attribute: 'age', operator: 'greaterThan', rawValue: '25' };

test('reflects an external config change in the rows while the popover is open', async ({
  page,
}) => {
  const handle = await loadComponent(
    page,
    {
      template: `
        <jig-attribute-filter
          [data]="inputs().data"
          [attributes]="inputs().attributes"
          [allowMultiple]="true"
          [value]="inputs().config"
          (filterChange)="output('config', $event)"
          style="width: 360px"
        />
      `,
      imports: ['attributeFilter'],
    },
    {
      inputs: {
        data: USERS,
        attributes: ATTRIBUTES,
        config: { matchMode: 'all', conditions: [GMAIL, OVER_25] },
      },
    }
  );

  const filter = new JigAttributeFilterHarness(page.locator('jig-attribute-filter'));
  await filter.open();
  await expect(filter.row(1)).toBeVisible();

  // Something else in the app drops the second condition while the popover is open.
  await handle.setInputs({
    data: USERS,
    attributes: ATTRIBUTES,
    config: { matchMode: 'all', conditions: [GMAIL] },
  });

  await expect(filter.row(1)).toHaveCount(0);
  await filter.attributeSelect(0).expectSelectedItemText('Email');
  await filter.valueInput(0).expectValue('@gmail');
});

test('keeps a value being typed when the config changes from outside', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `
        <jig-attribute-filter
          mode="inline"
          [data]="inputs().data"
          [attributes]="inputs().attributes"
          [autoApplyDebounce]="1500"
          [value]="inputs().config"
          (filterChange)="output('config', $event)"
          style="width: 560px"
        />
      `,
      imports: ['attributeFilter'],
    },
    {
      inputs: {
        data: USERS,
        attributes: ATTRIBUTES,
        config: { matchMode: 'all', conditions: [GMAIL] },
      },
    }
  );

  const filter = new JigAttributeFilterHarness(page.locator('jig-attribute-filter'));
  await filter.valueInput(0).expectValue('@gmail');

  // Type, then let the app write a different config while the commit is still pending.
  await filter.valueInput(0).fill('@work');
  await handle.setInputs({
    data: USERS,
    attributes: ATTRIBUTES,
    config: { matchMode: 'all', conditions: [OVER_25] },
  });

  await filter.valueInput(0).expectValue('@work');
  await expect(async () => {
    const config = (await handle.getOutputLog())['config']?.at(-1);
    expect(config.conditions[0]).toEqual({ ...GMAIL, rawValue: '@work' });
  }).toPass();
});

test('leaves manual mode edits pending when the config changes from outside', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `
        <jig-attribute-filter
          mode="inline"
          [autoApply]="false"
          [data]="inputs().data"
          [attributes]="inputs().attributes"
          [value]="inputs().config"
          (filterChange)="output('config', $event)"
          style="width: 560px"
        />
      `,
      imports: ['attributeFilter'],
    },
    { inputs: { data: USERS, attributes: ATTRIBUTES, config: null } }
  );

  const filter = new JigAttributeFilterHarness(page.locator('jig-attribute-filter'));
  await setCondition(filter, 0, 'Email', 'Contains', '@gmail');
  await filter.applyButton().click();

  await filter.valueInput(0).fill('@work');
  await handle.setInputs({
    data: USERS,
    attributes: ATTRIBUTES,
    config: { matchMode: 'all', conditions: [OVER_25] },
  });

  // The pending edit survives, and apply commits it rather than the external config.
  await filter.valueInput(0).expectValue('@work');
  await filter.applyButton().click();

  await expect(async () => {
    const config = (await handle.getOutputLog())['config']?.at(-1);
    expect(config.conditions[0]).toEqual({ ...GMAIL, rawValue: '@work' });
  }).toPass();

  // Cancel still restores the applied snapshot.
  await filter.valueInput(0).fill('@other');
  await filter.cancelButton().click();
  await filter.valueInput(0).expectValue('@work');
});

test('the trigger summary renders the parsed value, not the raw storage string', async ({
  page,
}) => {
  const handle = await loadComponent(
    page,
    {
      template: `
        <jig-attribute-filter
          [data]="inputs().data"
          [attributes]="inputs().attributes"
          [value]="inputs().config"
          style="width: 360px"
        />
      `,
      imports: ['attributeFilter'],
    },
    {
      inputs: {
        data: USERS,
        attributes: ATTRIBUTES,
        config: {
          matchMode: 'all',
          conditions: [{ attribute: 'role', operator: 'in', rawValue: '["Admin","User"]' }],
        },
      },
    }
  );

  const filter = new JigAttributeFilterHarness(page.locator('jig-attribute-filter'));
  await expect(filter.summary()).toHaveText('Role Is one of "Admin, User"');

  await handle.setInputs({
    data: USERS,
    attributes: ATTRIBUTES,
    config: {
      matchMode: 'all',
      conditions: [{ attribute: 'joined', operator: 'greaterThan', rawValue: '2024-01-15' }],
    },
  });

  const joined = await page.evaluate(() => new Date(2024, 0, 15).toLocaleDateString());
  await expect(filter.summary()).toHaveText(`Joined After "${joined}"`);
});

test('manual mode renders a bound config and applies it untouched', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `
        <jig-attribute-filter
          mode="inline"
          [autoApply]="false"
          [data]="inputs().data"
          [attributes]="inputs().attributes"
          [value]="inputs().config"
          (filterChange)="output('config', $event)"
          (filterResultChange)="output('filtered', $event)"
          style="width: 560px"
        />
      `,
      imports: ['attributeFilter'],
    },
    {
      inputs: {
        data: USERS,
        attributes: ATTRIBUTES,
        config: { matchMode: 'all', conditions: [GMAIL] },
      },
    }
  );

  const filter = new JigAttributeFilterHarness(page.locator('jig-attribute-filter'));

  // The editor shows the bound config rather than an empty default row.
  await filter.attributeSelect(0).expectSelectedItemText('Email');
  await filter.valueInput(0).expectValue('@gmail');

  // Apply without touching a row commits that same config, it does not discard it.
  await filter.applyButton().click();
  await expect(async () => {
    const log = await handle.getOutputLog();
    expect(log['config']?.at(-1).conditions).toEqual([GMAIL]);
    expect(log['filtered']?.at(-1)).toEqual([USERS[0], USERS[2]]);
  }).toPass();

  // Cancel restores the bound config too.
  await filter.valueInput(0).fill('@work');
  await filter.cancelButton().click();
  await filter.valueInput(0).expectValue('@gmail');
});

test('the date editor keeps the month the user navigates to', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2025-08-18T12:13:14'));
  await inlineComponent(page);
  const filter = new JigAttributeFilterHarness(page.locator('jig-attribute-filter'));

  const attr = filter.attributeSelect(0);
  await attr.open();
  await attr.clickItemByText('Joined');

  const calendar = new JigCalendarHarness(filter.row(0).locator('jig-calendar'));
  await filter.row(0).locator('jig-calendar jig-mask-input').click();
  await calendar.selectDay(15);
  await calendar.currentMonth.expectSelectedItemText('August');

  await calendar.backButton.click();
  await calendar.currentMonth.expectSelectedItemText('July');
});
