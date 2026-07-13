import { NgnTreeHarness } from '@ngneers/controls-playwright';
import test, { expect } from '@playwright/test';

import { exampleData } from '../helper/data';
import { evalValue, loadComponent } from '../helper/load-component';
import { expectScreenshot } from '../helper/screenshot';
import { expectNoA11yViolations } from '../helper/axe';

import type { NgnTreeItem } from '@ngneers/controls/api';
import type { TemplateType } from '../../apps/test-wrapper/src/app/window.js';

const grouped = exampleData.items.groupedPreformatted;
const STYLE = 'width: 300px; height: 400px; display: block;';

function treeTmpl(attrs = ''): TemplateType {
  return {
    template: `<ngn-tree style="${STYLE}" [items]="inputs().items" ${attrs} />`,
    imports: ['tree'],
  };
}

function harness(page: import('@playwright/test').Page) {
  return new NgnTreeHarness(page.locator('ngn-tree').first());
}

test('base', async ({ page }, testInfo) => {
  await loadComponent(page, treeTmpl(), { inputs: { items: grouped } });
  const tree = harness(page);

  // Collapsed by default: 7 continent branches, no leaves.
  await tree.expectGroupCount(7);
  await tree.expectItemCount(0);
  await tree.expectNodeCount(7);
  await expectScreenshot(page, testInfo, 'collapsed');

  await tree.toggleNode('Africa');
  await tree.expectExpanded('Africa', true);
  await tree.expectItemCount(8);
  await tree.expectNodeCount(15);
  await expectScreenshot(page, testInfo, 'expanded');
});

test('expand and collapse', async ({ page }) => {
  await loadComponent(page, treeTmpl(), { inputs: { items: grouped } });
  const tree = harness(page);

  await tree.expectExpanded('Europe', false);
  await tree.toggleNode('Europe');
  await tree.expectExpanded('Europe', true);
  await tree.expectItemCount(10);
  await expect(tree.getNode('Germany')).toBeVisible();

  await tree.toggleNode('Europe');
  await tree.expectExpanded('Europe', false);
  await tree.expectItemCount(0);
  await expect(tree.getNode('Germany')).toHaveCount(0);
});

test('single select', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    treeTmpl(`[selectable]="true" (valueChange)="output('value', $event)"`),
    { inputs: { items: grouped } }
  );
  const tree = harness(page);

  await tree.toggleNode('Africa');
  await tree.clickNode('Nigeria');
  await tree.expectSelected('Nigeria', true);
  expect(await handle.getOutputLog()).toEqual({ value: ['ng'] });
  await expectScreenshot(page, testInfo, 'selected');

  // Selecting another replaces the value.
  await tree.clickNode('Kenya');
  await tree.expectSelected('Kenya', true);
  await tree.expectSelected('Nigeria', false);
  expect(await handle.getOutputLog()).toEqual({ value: ['ng', 'ke'] });
});

test('multiselect cascade checkboxes', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    treeTmpl(`[multiple]="true" (valueChange)="output('value', $event)"`),
    { inputs: { items: grouped } }
  );
  const tree = harness(page);

  await tree.toggleNode('Africa');

  // Checking a branch cascades to all its leaves.
  await tree.clickNode('Africa');
  await tree.expectChecked('Africa', 'true');
  await tree.expectChecked('Nigeria', 'true');
  await tree.expectChecked('Ghana', 'true');
  const afterCheck = await handle.getOutputLog();
  expect(new Set(afterCheck['value'].at(-1) as string[])).toEqual(
    new Set(['ng', 'eg', 'za', 'ke', 'et', 'dz', 'ma', 'gh'])
  );
  await expectScreenshot(page, testInfo, 'branch-checked');

  // Unchecking one leaf makes the branch indeterminate.
  await tree.clickNode('Nigeria');
  await tree.expectChecked('Nigeria', 'false');
  await tree.expectChecked('Africa', 'mixed');
  await expectScreenshot(page, testInfo, 'indeterminate');
});

test.describe('disabled nodes', () => {
  const disabledTree: NgnTreeItem[] = [
    {
      label: 'Fruit',
      value: 'fruit',
      items: [
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana', disabled: true },
      ],
    },
    {
      label: 'Archived',
      value: 'archived',
      disabled: true,
      items: [{ label: 'Old', value: 'old' }],
    },
  ];

  test('disabled items are not selectable but still show a disabled checkbox', async ({
    page,
  }, testInfo) => {
    // Disabled nodes are pointer-inert, so both branches are expanded via the
    // API to exercise a disabled leaf and a disabled subtree.
    const handle = await loadComponent(
      page,
      treeTmpl(
        `[multiple]="true" [expandedValues]="inputs().expanded" (valueChange)="output('value', $event)"`
      ),
      { inputs: { items: disabledTree, expanded: ['fruit', 'archived'] } }
    );
    const tree = harness(page);

    await tree.expectExpanded('Fruit', true);
    await tree.expectDisabled('Apple', false);
    await tree.expectDisabled('Banana', true);
    // A disabled node keeps its checkbox (disabled) for column alignment.
    await expect(tree.getNode('Banana').locator('ngn-checkbox')).toHaveCount(1);

    // Clicking a disabled leaf does not select it.
    await tree.getNode('Banana').click({ force: true });
    expect(await handle.getOutputLog()).toEqual({});

    // A disabled branch cascades disabled state to its whole subtree.
    await tree.expectDisabled('Archived', true);
    await tree.expectDisabled('Old', true);
    await expectScreenshot(page, testInfo, 'disabled');
  });
});

test('filter auto-expands matches and keeps the ancestor path', async ({ page }, testInfo) => {
  await loadComponent(page, treeTmpl(`[filter]="true" [filterText]="inputs().filterText"`), {
    inputs: { items: grouped, filterText: 'ger' },
  });
  const tree = harness(page);

  await tree.expectNodeTexts(['Africa', 'Nigeria', 'Algeria', 'Europe', 'Germany']);
  await expectScreenshot(page, testInfo, 'filtered');
});

test('custom item template', async ({ page }, testInfo) => {
  await loadComponent(
    page,
    {
      template: `
        <ngn-tree style="${STYLE}" [items]="inputs().items">
          <ng-template #item let-item let-hasChildren="hasChildren">
            <span>{{ hasChildren ? '📁' : '📄' }} {{ item.label }}</span>
          </ng-template>
        </ngn-tree>
      `,
      imports: ['tree'],
    },
    { inputs: { items: grouped } }
  );
  const tree = harness(page);

  await expect(tree.getNode('📁 Africa')).toBeVisible();
  await tree.toggleNode('📁 Africa');
  await expect(tree.getNode('📄 Nigeria')).toBeVisible();
  await expectScreenshot(page, testInfo, 'templated');
});

test('virtual scrolling renders only a window of nodes', async ({ page }, testInfo) => {
  const many: NgnTreeItem[] = Array.from({ length: 200 }, (_, i) => ({
    label: `Item ${i}`,
    value: `i${i}`,
  }));
  await loadComponent(page, treeTmpl(`[virtual]="true" [itemHeight]="36"`), {
    inputs: { items: many },
  });
  const tree = harness(page);

  await tree.scroller.expectItemsCountBetween(8, 20);
  await expectScreenshot(page, testInfo, 'virtual');
});

test('keyboard navigation', async ({ page }) => {
  const handle = await loadComponent(page, treeTmpl(`(valueChange)="output('value', $event)"`), {
    inputs: { items: grouped },
  });
  const tree = harness(page);

  await tree.locator.focus();
  await page.keyboard.press('ArrowDown');
  await tree.expectActiveDescendant('Africa');

  await page.keyboard.press('ArrowRight'); // expand Africa
  await tree.expectExpanded('Africa', true);

  await page.keyboard.press('ArrowRight'); // move into first child
  await tree.expectActiveDescendant('Nigeria');

  await page.keyboard.press('Enter'); // select
  await tree.expectSelected('Nigeria', true);
  expect(await handle.getOutputLog()).toEqual({ value: ['ng'] });

  await page.keyboard.press('ArrowLeft'); // back to parent
  await tree.expectActiveDescendant('Africa');

  await page.keyboard.press('ArrowLeft'); // collapse
  await tree.expectExpanded('Africa', false);
});

test('lazy loading', async ({ page }, testInfo) => {
  await loadComponent(page, treeTmpl(`[loadChildren]="inputs().loadChildren"`), {
    inputs: {
      items: [{ label: 'Lazy Root', value: 'root', lazy: true }],
      loadChildren: evalValue(
        `(item) => new Promise((resolve) => setTimeout(() => resolve([
          { label: 'Loaded Child 1', value: 'c1' },
          { label: 'Loaded Child 2', value: 'c2' },
        ]), 300))`
      ),
    },
  });
  const tree = harness(page);

  await tree.expectExpanded('Lazy Root', false);
  await tree.toggleNode('Lazy Root');
  await tree.expectExpanded('Lazy Root', true);

  // Children resolve asynchronously and get merged in.
  await expect(tree.getNode('Loaded Child 1')).toBeVisible();
  await expect(tree.getNode('Loaded Child 2')).toBeVisible();
  await expect(tree.spinner).toHaveCount(0);
  await expectScreenshot(page, testInfo, 'loaded');
});

test('persists state to storage across reloads', async ({ page }) => {
  const key = 'tree-e2e-storage';
  const tmpl = treeTmpl(`[multiple]="true" [storage]="inputs().storage"`);
  const io = { inputs: { items: grouped, storage: { key, kind: 'localstorage' } } };

  // Clear the key once, before the app bootstraps, so the first mount starts
  // collapsed regardless of any pre-existing storage (the flag keeps the
  // remount navigation from wiping the state we just persisted).
  await page.addInitScript(k => {
    const flag = `__ngn_cleared_${k}`;
    if (!sessionStorage.getItem(flag)) {
      localStorage.removeItem(k);
      sessionStorage.setItem(flag, '1');
    }
  }, key);

  await loadComponent(page, tmpl, io);

  const tree = harness(page);
  await tree.toggleNode('Asia');
  await tree.clickNode('Africa'); // cascade-check Africa
  await tree.expectExpanded('Asia', true);

  // Wait for the state to be flushed to storage before reloading.
  await expect.poll(() => page.evaluate(k => localStorage.getItem(k) ?? '', key)).toContain('asia');

  // Re-mount (fresh navigation; localStorage persists across it).
  await loadComponent(page, tmpl, io);
  const tree2 = harness(page);
  await tree2.expectExpanded('Asia', true);
  await tree2.expectChecked('Africa', 'true');
});

// TODO(a11y): virtualization breaks tree semantics — the ngn-scroller wrapper sits
// between role="tree" and its role="treeitem"/"group" children (aria-required-children),
// and the scroll region isn't keyboard-focusable (scrollable-region-focusable). Needs
// an ARIA + virtual-scroll design pass (aria-owns or role=presentation). Tracked.
test.fixme('accessibility (axe)', async ({ page }) => {
  await loadComponent(page, treeTmpl(`[selectable]="true"`), { inputs: { items: grouped } });
  const tree = harness(page);

  // Expand a branch so both group and leaf nodes are in the tree.
  await tree.toggleNode('Africa');
  await tree.expectExpanded('Africa', true);

  await expectNoA11yViolations(page);
});
