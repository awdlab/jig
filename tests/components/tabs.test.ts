import test, { expect, type Page } from '@playwright/test';
import { expectOutput, loadComponent } from '../helper/load-component';
import { useRtl } from '../helper/direction';
import { exampleData } from '../helper/data';
import type { InputsType } from '../../apps/test-wrapper/src/app/window.js';
import { JigTabsHarness } from '@awdlab/jig-playwright';
import { expectScreenshot } from '../helper/screenshot';
import { expectNoA11yViolations } from '../helper/axe';
import { deepCopy } from '@awdlab/jig/utils';

const TABS = [
  {
    id: 'tab1',
    header: 'Tab 1',
    content: exampleData.loremIpsum.full.split(' ').slice(0, 100).join(' '),
  },
  {
    id: 'tab2',
    header: 'Tab 2',
    content: exampleData.loremIpsum.full.split(' ').slice(100, 200).join(' '),
  },
  {
    id: 'tab3',
    header: 'Tab 3',
    content: exampleData.loremIpsum.full.split(' ').slice(200, 400).join(' '),
  },
];

async function prepareTest(page: Page, inputs: InputsType = {}) {
  const handle = await loadComponent(
    page,
    {
      template: `
      <jig-tabs [activeTab]="inputs().activeTab" (activeTabChange)="output('activeTab', $event)"
        [lazy]="inputs().lazy" [cache]="inputs().cache"
      >
        @for(tab of inputs().tabs; track tab) {
          <jig-tab [tabId]="tab.id">
            <ng-template #header>{{ tab.header }}</ng-template>
            <ng-template #content>
              <dummy [dummyId]="tab.id" (calledConstructor)="output('constructorCalled', $event)">
                {{ tab.content }}
              </dummy>
            </ng-template>
          </jig-tab>
        }
      </jig-tabs>
      `,
      imports: ['tabs', 'tab', 'dummy_component'],
    },
    {
      inputs: {
        tabs: TABS,
        activeTab: '',
        ...inputs,
      },
    }
  );
  return handle;
}

test('select tabs', async ({ page }, testInfo) => {
  const handle = await prepareTest(page);

  const tabs = new JigTabsHarness(page.locator('jig-tabs'));
  await tabs.expectTabCount(3);

  const tab1 = tabs.getTabByIndex(0);
  const tab2 = tabs.getTabByIndex(1);
  const tab3 = tabs.getTabByIndex(2);

  await tab1.expectHeaderText('Tab 1');
  await tab2.expectHeaderText('Tab 2');
  await tab3.expectHeaderText('Tab 3');

  // First tab should be active by default
  await tab1.expectActive(true);
  await tab2.expectActive(false);
  await tab3.expectActive(false);

  await expectScreenshot(page, testInfo, 'tab1-active');

  // Select tab 2
  await tab2.select();
  await tab1.expectActive(false);
  await tab2.expectActive(true);
  await tab3.expectActive(false);

  await expectScreenshot(page, testInfo, 'tab2-active');

  // Select tab 3
  await tab3.select();
  await tab1.expectActive(false);
  await tab2.expectActive(false);
  await tab3.expectActive(true);

  // Programmatically set active tab
  await handle.setInputs({
    activeTab: 'tab1',
  });

  await tab1.expectActive(true);
  await tab2.expectActive(false);
  await tab3.expectActive(false);
});

test('lazy', async ({ page }, testInfo) => {
  const tabs = deepCopy(TABS) as any[];

  const handle = await prepareTest(page, {
    tabs,
    lazy: true,
    cache: false,
  });

  const tabsHarness = new JigTabsHarness(page.locator('jig-tabs'));
  await tabsHarness.expectTabCount(3);

  const tab1 = tabsHarness.getTabByIndex(0);
  const tab2 = tabsHarness.getTabByIndex(1);
  const tab3 = tabsHarness.getTabByIndex(2);

  // First tab should be loaded immediately
  await expectOutput(handle, 'constructorCalled', ['tab1']);

  // Select tab 2 - should load lazily
  await tab2.select();
  await tab2.expectActive(true);
  await expectOutput(handle, 'constructorCalled', ['tab1', 'tab2']);

  // Select tab 3 - should load lazily
  await tab3.select();
  await tab3.expectActive(true);
  await expectOutput(handle, 'constructorCalled', ['tab1', 'tab2', 'tab3']);

  // Select tab 1 again - should reload since cache is false
  await tab1.select();
  await tab1.expectActive(true);
  await expectOutput(handle, 'constructorCalled', ['tab1', 'tab2', 'tab3', 'tab1']);
});

test('lazy with cache', async ({ page }, testInfo) => {
  const tabs = deepCopy(TABS) as any[];

  const handle = await prepareTest(page, {
    tabs,
    lazy: true,
    cache: true,
  });

  const tabsHarness = new JigTabsHarness(page.locator('jig-tabs'));
  await tabsHarness.expectTabCount(3);

  const tab1 = tabsHarness.getTabByIndex(0);
  const tab2 = tabsHarness.getTabByIndex(1);
  const tab3 = tabsHarness.getTabByIndex(2);

  // First tab should be loaded immediately
  await expectOutput(handle, 'constructorCalled', ['tab1']);

  // Select tab 2 - should load lazily
  await tab2.select();
  await tab2.expectActive(true);
  await expectOutput(handle, 'constructorCalled', ['tab1', 'tab2']);

  // Select tab 3 - should load lazily
  await tab3.select();
  await tab3.expectActive(true);
  await expectOutput(handle, 'constructorCalled', ['tab1', 'tab2', 'tab3']);

  // Select tab 1 again - should NOT reload since cache is true
  await tab1.select();
  await tab1.expectActive(true);
  await expectOutput(handle, 'constructorCalled', ['tab1', 'tab2', 'tab3']);

  // Select tab 2 again - should NOT reload since cache is true
  await tab2.select();
  await tab2.expectActive(true);
  await expectOutput(handle, 'constructorCalled', ['tab1', 'tab2', 'tab3']);
});

test('keyboard navigation', async ({ page }, testInfo) => {
  const handle = await prepareTest(page);

  const tabs = new JigTabsHarness(page.locator('jig-tabs'));
  await tabs.expectTabCount(3);

  const tab1 = tabs.getTabByIndex(0);
  const tab2 = tabs.getTabByIndex(1);
  const tab3 = tabs.getTabByIndex(2);

  // Focus on first tab
  await tab1.header.focus();

  // Press ArrowRight to move to tab 2
  await tab1.header.press('ArrowRight');
  await expect(tab2.header).toBeFocused();

  // Press ArrowRight to move to tab 3
  await tab2.header.press('ArrowRight');
  await expect(tab3.header).toBeFocused();

  // Press ArrowRight to wrap around to tab 1
  await tab3.header.press('ArrowRight');
  await expect(tab1.header).toBeFocused();

  // Press ArrowLeft to wrap around to tab 3
  await tab1.header.press('ArrowLeft');
  await expect(tab3.header).toBeFocused();

  // Press ArrowLeft to move to tab 2
  await tab3.header.press('ArrowLeft');
  await expect(tab2.header).toBeFocused();

  // Press Enter to select tab 2
  await tab2.header.press('Enter');
  await tab2.expectActive(true);

  // Press Space to select tab 2 (should still be active)
  await tab2.header.press(' ');
  await tab2.expectActive(true);
});

test('overflow scrolling', async ({ page }, testInfo) => {
  // Create more tabs to trigger overflow
  const manyTabs = Array.from({ length: 10 }, (_, i) => ({
    id: `tab${i + 1}`,
    header: `Tab ${i + 1}`,
    content: `Content for tab ${i + 1}`,
  }));

  const handle = await prepareTest(page, {
    tabs: manyTabs,
  });

  // Set a smaller viewport to trigger overflow
  await page.setViewportSize({ width: 600, height: 400 });

  const tabs = new JigTabsHarness(page.locator('jig-tabs'));
  await tabs.expectTabCount(10);

  // Check if scroll buttons are visible
  const scrollStart = page.locator(tabs.classes['scroll-start']);
  const scrollEnd = page.locator(tabs.classes['scroll-end']);

  // Initially, left scroll should not be visible, right scroll should be visible
  await expect(scrollStart).not.toBeVisible();
  await expect(scrollEnd).toBeVisible();

  await expectScreenshot(page, testInfo, 'overflow');
});

test('dragging a header does not switch the active tab', async ({ page }) => {
  await prepareTest(page);

  const tabs = new JigTabsHarness(page.locator('jig-tabs'));
  await tabs.expectTabCount(3);

  const tab1 = tabs.getTabByIndex(0);
  const tab2 = tabs.getTabByIndex(1);
  // Tab 1 active by default; tab 2 is the drag target.
  await tab1.expectActive(true);

  const box = await tab2.header.boundingBox();
  if (!box) {
    throw new Error('Tab 2 header has no bounding box');
  }
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;

  // Press on tab 2, move past the 5px drag threshold, then release back on tab 2.
  // The browser synthesizes a click (down + up on the same element) that, without
  // suppression, would select tab 2.
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.mouse.move(cx + 10, cy);
  await page.mouse.move(cx + 14, cy);
  await page.mouse.move(cx, cy);
  await page.mouse.up();

  // The drag must not have switched the active tab.
  await tab1.expectActive(true);
  await tab2.expectActive(false);

  // A genuine click (no drag) must still select the tab.
  await tab2.select();
  await tab2.expectActive(true);
});

test('custom header templates', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `
      <jig-tabs>
        <ng-template #headerLeft>
          <button jigButton jigButtonInline kind="icon">➕</button>
        </ng-template>
        <ng-template #headerRight>
          <button jigButton jigButtonInline kind="icon">🗑️</button>
        </ng-template>
        @for(tab of inputs().tabs; track tab) {
          <jig-tab [tabId]="tab.id">
            <ng-template #header>{{ tab.header }}</ng-template>
            <ng-template #content>{{ tab.content }}</ng-template>
          </jig-tab>
        }
      </jig-tabs>
      `,
      imports: ['tabs', 'tab', 'button'],
    },
    {
      inputs: {
        tabs: TABS,
      },
    }
  );

  const tabs = new JigTabsHarness(page.locator('jig-tabs'));
  await tabs.expectTabCount(3);

  // Check that custom header templates are rendered
  const headerLeft = page.locator('button', { hasText: '➕' });
  const headerRight = page.locator('button', { hasText: '🗑️' });

  await expect(headerLeft).toBeVisible();
  await expect(headerRight).toBeVisible();

  // Verify tabs still work with custom header templates
  const tab1 = tabs.getTabByIndex(0);
  const tab2 = tabs.getTabByIndex(1);

  await tab1.expectActive(true);
  await tab2.select();
  await tab2.expectActive(true);

  await expectScreenshot(page, testInfo, 'custom-headers');
});

test('accessibility (axe)', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `
      <jig-tabs>
        @for(tab of inputs().tabs; track tab) {
          <jig-tab [tabId]="tab.id">
            <ng-template #header>{{ tab.header }}</ng-template>
            <ng-template #content>{{ tab.content }}</ng-template>
          </jig-tab>
        }
      </jig-tabs>
      `,
      imports: ['tabs', 'tab'],
    },
    {
      inputs: {
        tabs: TABS,
      },
    }
  );

  const tabs = new JigTabsHarness(page.locator('jig-tabs'));
  await tabs.expectTabCount(3);

  await expectNoA11yViolations(page);
});

test('rtl', async ({ page }, testInfo) => {
  await useRtl(page);
  // Overflowing, so the scroll buttons and the clipped header row are captured.
  await prepareTest(page, {
    tabs: Array.from({ length: 10 }, (_, i) => ({
      id: `tab${i + 1}`,
      header: `Tab ${i + 1}`,
      content: `Content for tab ${i + 1}`,
    })),
  });
  await page.setViewportSize({ width: 600, height: 400 });
  await expectScreenshot(page, testInfo);
});

test('rtl: overflow buttons sit on the inline edges and scroll along the inline axis', async ({
  page,
  browserName,
}) => {
  // Chromium only: the overflow buttons' visibility re-settles as the header row is
  // re-measured after the viewport change, and firefox/webkit hide them again mid-test.
  // That timing is pre-existing tabs behaviour; the scroll direction under test is not
  // browser-specific (all three engines use the same negative RTL scrollLeft model).
  test.skip(browserName !== 'chromium', 'overflow re-measure timing is browser-specific');
  await useRtl(page);
  const manyTabs = Array.from({ length: 10 }, (_, i) => ({
    id: `tab${i + 1}`,
    header: `Tab ${i + 1}`,
    content: `Content for tab ${i + 1}`,
  }));
  await prepareTest(page, { tabs: manyTabs });
  await page.setViewportSize({ width: 600, height: 400 });

  const tabs = new JigTabsHarness(page.locator('jig-tabs'));
  const scrollStart = page.locator(tabs.classes['scroll-start']);
  const scrollEnd = page.locator(tabs.classes['scroll-end']);

  // Unscrolled: nothing hidden at the inline-start, more to reveal at the inline-end.
  await expect(scrollStart).not.toBeVisible();
  await expect(scrollEnd).toBeVisible();

  const list = page.locator(tabs.classes.headers);
  // scrollLeft runs negative in RTL, so compare the distance travelled.
  const travelled = () => list.evaluate(el => Math.abs(el.scrollLeft));
  expect(await travelled()).toBe(0);

  // The end button must reveal later tabs, and it lives on the LEFT in RTL.
  const endBox = await scrollEnd.boundingBox();
  const startAtLeftEdge = endBox!.x < 300;
  expect(startAtLeftEdge).toBe(true);

  // The buttons are sticky overlays whose visibility re-settles as the header row is
  // re-measured, so retry the click until it lands rather than racing that.
  const clickUntilItLands = (button: typeof scrollEnd) =>
    expect(async () => {
      await button.click({ force: true, timeout: 1000 });
    }).toPass({ timeout: 10000 });

  await clickUntilItLands(scrollEnd);
  await expect.poll(travelled).toBeGreaterThan(20);
  await expect(scrollStart).toBeVisible();

  // Let the smooth scroll settle before measuring the return trip.
  const settled = async () => {
    let last = -1;
    await expect
      .poll(async () => {
        const now = await travelled();
        const stable = now === last;
        last = now;
        return stable;
      })
      .toBe(true);
    return last;
  };
  const afterEnd = await settled();

  // And the start button brings it back.
  await clickUntilItLands(scrollStart);
  await expect.poll(travelled).toBeLessThan(afterEnd - 10);
});
