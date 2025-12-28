import test, { expect } from '@playwright/test';
import { loadComponent } from '../helper/load-component';
import { NgnFilterHarness, NgnSelectHarness } from '@ngneers/controls-playwright';

test('base (string contains) emits filtered result', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `
        <ngn-filter
          [data]="inputs().data"
          dataType="string"
          (filterChange)="output('config', $event)"
          (filterResultChange)="output('filtered', $event)"
          style="width: 320px"
        />
      `,
      imports: ['filter'],
    },
    {
      inputs: {
        data: ['Nigeria', 'Algeria', 'Germany', 'France'],
      },
    }
  );

  const filter = new NgnFilterHarness(page.locator('ngn-filter'));
  await filter.open();

  const op1 = filter.operatorSelect(0);
  await op1.open();
  await op1.clickItemByText('Contains');
  await filter.valueInput(0).fill('ger');

  await filter.applyButton().click();

  await expect(async () => {
    const log = await handle.getOutputLog();
    const last = log['filtered']?.at(-1);
    expect(last).toEqual(['Nigeria', 'Algeria', 'Germany']);
  }).toPass();
});

test('multiple conditions (any/all) emits config + filtered', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `
        <ngn-filter
          [data]="inputs().data"
          dataType="string"
          [allowMultiple]="true"
          (filterChange)="output('config', $event)"
          (filterResultChange)="output('filtered', $event)"
          style="width: 360px"
        />
      `,
      imports: ['filter'],
    },
    {
      inputs: {
        data: ['Nigeria', 'Germany', 'France'],
      },
    }
  );

  const filter = new NgnFilterHarness(page.locator('ngn-filter'));
  await filter.open();

  // condition 1: contains "ger"
  const op1 = filter.operatorSelect(0);
  await op1.open();
  await op1.clickItemByText('Contains');
  await filter.valueInput(0).fill('ger');

  // add condition 2: starts with "fr"
  await filter.addConditionButton().click();
  const op2 = filter.operatorSelect(1);
  await op2.open();
  await op2.clickItemByText('Starts with');
  await filter.valueInput(1).fill('fr');

  // match any => all 3
  const match = filter.matchModeSelect();
  await match.open();
  await match.clickItemByText('Match any');

  await filter.applyButton().click();

  await expect(async () => {
    const log = await handle.getOutputLog();
    const config = log['config']?.at(-1);
    const filtered = log['filtered']?.at(-1);
    expect(config.matchMode).toBe('any');
    expect(filtered).toEqual(['Nigeria', 'Germany', 'France']);
  }).toPass();

  // match all => none
  await match.open();
  await match.clickItemByText('Match all');

  await filter.applyButton().click();

  await expect(async () => {
    const log = await handle.getOutputLog();
    const config = log['config']?.at(-1);
    const filtered = log['filtered']?.at(-1);
    expect(config.matchMode).toBe('all');
    expect(filtered).toEqual([]);
  }).toPass();
});

test('list kind (multi select) filters by membership', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `
        <ngn-filter
          [data]="inputs().data"
          filterKind="list"
          (filterChange)="output('config', $event)"
          (filterResultChange)="output('filtered', $event)"
          style="width: 360px"
        />
      `,
      imports: ['filter'],
    },
    {
      inputs: {
        data: ['Nigeria', 'Algeria', 'Germany', 'France'],
      },
    }
  );

  const filter = new NgnFilterHarness(page.locator('ngn-filter'));
  await filter.open();

  const select = new NgnSelectHarness(
    page.locator('ngn-filter [data-testid="filter-row-list"] ngn-select')
  );
  await select.open();
  await select.clickItemByText('Germany', false);
  await select.clickItemByText('France', false);
  await select.close();

  await filter.applyButton().click();

  await expect(async () => {
    const log = await handle.getOutputLog();
    const config = log['config']?.at(-1);
    const filtered = log['filtered']?.at(-1);

    expect(config.kind).toBe('list');
    expect(config.dataType).toBe('string');
    expect(config.matchMode).toBe('all');
    expect(config.conditions[0].operator).toBe('in');
    expect(JSON.parse(config.conditions[0].rawValue)).toEqual(['Germany', 'France']);

    expect(filtered).toEqual(['Germany', 'France']);
  }).toPass();
});
