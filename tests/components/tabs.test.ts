import test, { expect, type Page } from '@playwright/test';
import { expectOutput, loadComponent } from '../helper/load-component';
import { exampleData } from '../helper/data';
import { type InputsType } from '../../apps/test-wrapper/src/app/window.js';
import { NgnTabsHarness } from '@ngneers/controls-playwright';
import { expectScreenshot } from '../helper/screenshot';
import { deepCopy } from '@ngneers/controls/utils';

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
      <ngn-tabs [activeTab]="inputs().activeTab" (activeTabChange)="output('activeTab', $event)"
        [lazy]="inputs().lazy" [cache]="inputs().cache"
      >
        @for(tab of inputs().tabs; track tab) {
          <ngn-tab [tabId]="tab.id">
            <ng-template #header>{{ tab.header }}</ng-template>
            <ng-template #content>
              <dummy [dummyId]="tab.id" (calledConstructor)="output('constructorCalled', $event)">
                {{ tab.content }}
              </dummy>
            </ng-template>
          </ngn-tab>
        }
      </ngn-tabs>
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

  const tabs = new NgnTabsHarness(page.locator('ngn-tabs'));
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

  const tabsHarness = new NgnTabsHarness(page.locator('ngn-tabs'));
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

  const tabsHarness = new NgnTabsHarness(page.locator('ngn-tabs'));
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

  const tabs = new NgnTabsHarness(page.locator('ngn-tabs'));
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

  const tabs = new NgnTabsHarness(page.locator('ngn-tabs'));
  await tabs.expectTabCount(10);

  // Check if scroll buttons are visible
  const scrollLeft = page.locator(tabs.classes['scroll-left']);
  const scrollRight = page.locator(tabs.classes['scroll-right']);

  // Initially, left scroll should not be visible, right scroll should be visible
  await expect(scrollLeft).not.toBeVisible();
  await expect(scrollRight).toBeVisible();

  await expectScreenshot(page, testInfo, 'overflow');
});

test('custom header templates', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `
      <ngn-tabs>
        <ng-template #headerLeft>
          <button ngnButton inline kind="icon">➕</button>
        </ng-template>
        <ng-template #headerRight>
          <button ngnButton inline kind="icon">🗑️</button>
        </ng-template>
        @for(tab of inputs().tabs; track tab) {
          <ngn-tab [tabId]="tab.id">
            <ng-template #header>{{ tab.header }}</ng-template>
            <ng-template #content>{{ tab.content }}</ng-template>
          </ngn-tab>
        }
      </ngn-tabs>
      `,
      imports: ['tabs', 'tab', 'button'],
    },
    {
      inputs: {
        tabs: TABS,
      },
    }
  );

  const tabs = new NgnTabsHarness(page.locator('ngn-tabs'));
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
