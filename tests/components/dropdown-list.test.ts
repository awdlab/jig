import test, { expect } from '@playwright/test';
import { JigDropdownListHarness } from '@awdlab/jig-playwright';

import { expectNoA11yViolations } from '../helper/axe';
import { loadComponent } from '../helper/load-component';
import { useRtl } from '../helper/direction';
import { expectScreenshot } from '../helper/screenshot';

const ITEMS = [
  { label: 'Alpha', value: 'a' },
  { label: 'Beta', value: 'b' },
  { label: 'Gamma', value: 'c' },
];

// Two independent dropdowns rather than one reconfigured: the popover keeps the
// inline width its first positioning run applied, so swapping `popoverOptions`
// afterwards would measure a stale value.
test('width behaviours', async ({ page }, testInfo) => {
  await loadComponent(
    page,
    {
      template: `
        <div class="page-center" style="display: flex; gap: 24px; align-items: start">
          <div>
            <button #wide type="button" jigButton (click)="matched.toggle()">
              A deliberately wide trigger button
            </button>
            <jig-dropdown-list
              #matched
              inputId="matched"
              [anchor]="wide"
              label="Matched width"
              [items]="inputs().items"
              [popoverOptions]="{ sizeConstraints: { width: 1, maxWidth: 1 } }"
            />
          </div>
          <div>
            <button #slim type="button" jigButton (click)="anchored.toggle()">···</button>
            <jig-dropdown-list
              #anchored
              inputId="anchored"
              [anchor]="slim"
              label="Anchored width"
              [items]="inputs().items"
            />
          </div>
        </div>
      `,
      imports: ['button', 'dropdownList'],
    },
    { inputs: { items: ITEMS } }
  );

  const matched = new JigDropdownListHarness(page.locator('jig-dropdown-list').first());
  const anchored = new JigDropdownListHarness(page.locator('jig-dropdown-list').last());
  const wideTrigger = page.locator('button').first();
  const slimTrigger = page.locator('button').last();

  await test.step('matches the trigger width', async () => {
    await wideTrigger.click();
    await matched.expectOpened();

    const triggerBox = await wideTrigger.boundingBox();
    const popoverBox = await matched.popover.boundingBox();
    expect(Math.round(popoverBox!.width)).toBe(Math.round(triggerBox!.width));

    await expectScreenshot(page, testInfo, 'width-match');
    await expectNoA11yViolations(page);
    await matched.close();
  });

  await test.step('anchors to a slim trigger without constraining width', async () => {
    await slimTrigger.click();
    await anchored.expectOpened();

    const triggerBox = await slimTrigger.boundingBox();
    const popoverBox = await anchored.popover.boundingBox();
    // Content-sized: the list is wider than the narrow button it hangs off.
    expect(popoverBox!.width).toBeGreaterThan(triggerBox!.width);

    await expectScreenshot(page, testInfo, 'width-auto');
    await anchored.close();
  });
});

test('selection and keyboard', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `
        <div class="page-center">
          <button #trigger type="button" jigButton (click)="dropdown.toggle()">Open</button>
          <jig-dropdown-list
            #dropdown
            inputId="dd"
            [anchor]="trigger"
            label="Choose an option"
            [items]="inputs().items"
            [closeOnSelect]="inputs().closeOnSelect"
            (valueChange)="output('valueChange', $event)"
            (itemClicked)="output('itemClicked', $event)"
          />
        </div>
      `,
      imports: ['button', 'dropdownList'],
    },
    { inputs: { items: ITEMS, closeOnSelect: true } }
  );

  const dropdown = new JigDropdownListHarness(page.locator('jig-dropdown-list'));
  const trigger = page.locator('button');

  await test.step('derives the listbox and popover ids from inputId', async () => {
    await trigger.click();
    await dropdown.expectOpened();
    await expect(page.locator('#dd_listbox')).toBeVisible();
    await expect(page.locator('#dd_popover')).toBeAttached();
  });

  await test.step('projects nothing into an empty header', async () => {
    await expect(dropdown.listBox.item).toHaveCount(3);
  });

  await test.step('closes on select by default', async () => {
    await dropdown.listBox.scroller.clickItemByText('Beta');
    await dropdown.expectOpened(false);
    expect(await handle.getOutputLogAndClear()).toEqual({
      valueChange: ['b'],
      itemClicked: ['b'],
    });
  });

  await test.step('stays open when closeOnSelect is false', async () => {
    await handle.setInputs({ closeOnSelect: false });
    await trigger.click();
    await dropdown.expectOpened();
    await dropdown.listBox.scroller.clickItemByText('Gamma');
    await dropdown.expectOpened();
    expect(await handle.getOutputLogAndClear()).toEqual({
      valueChange: ['c'],
      itemClicked: ['c'],
    });
    await dropdown.close();
  });
});

test('projected header', async ({ page }, testInfo) => {
  await loadComponent(
    page,
    {
      template: `
        <div class="page-center">
          <button #trigger type="button" jigButton (click)="dropdown.toggle()">Open</button>
          <jig-dropdown-list
            #dropdown
            inputId="dd"
            [anchor]="trigger"
            label="Choose an option"
            [items]="inputs().items"
          >
            <!-- Projected header content brings its own spacing; the slot adds none. -->
            <span dropdownHeader data-testid="header" style="padding: 8px 12px">Pick one</span>
          </jig-dropdown-list>
        </div>
      `,
      imports: ['button', 'dropdownList'],
    },
    { inputs: { items: ITEMS } }
  );

  const dropdown = new JigDropdownListHarness(page.locator('jig-dropdown-list'));

  await page.locator('button').click();
  await dropdown.expectOpened();

  await expect(dropdown.header).toContainText('Pick one');
  await expect(page.getByTestId('header')).toBeVisible();
  await expectScreenshot(page, testInfo, 'with-header');
  await expectNoA11yViolations(page);
});

test('rtl', async ({ page }, testInfo) => {
  await useRtl(page);
  await loadComponent(
    page,
    {
      template: `
        <div class="page-center" style="display: flex; gap: 24px; align-items: start">
          <div>
            <button #wide type="button" jigButton (click)="matched.toggle()">
              A deliberately wide trigger button
            </button>
            <jig-dropdown-list
              #matched
              inputId="matched"
              [anchor]="wide"
              label="Matched width"
              [items]="inputs().items"
              [popoverOptions]="{ sizeConstraints: { width: 1, maxWidth: 1 } }"
            />
          </div>
          <div>
            <button #slim type="button" jigButton (click)="anchored.toggle()">···</button>
            <jig-dropdown-list
              #anchored
              inputId="anchored"
              [anchor]="slim"
              label="Anchored width"
              [items]="inputs().items"
            />
          </div>
        </div>
      `,
      imports: ['button', 'dropdownList'],
    },
    { inputs: { items: ITEMS } }
  );
  await expectScreenshot(page, testInfo);
});
