import test, { expect } from '@playwright/test';
import { loadComponent } from '../helper/load-component';
import { JigToolbarHarness } from '@awdlab/jig-playwright';
import { expectScreenshot } from '../helper/screenshot';
import { expectNoA11yViolations } from '../helper/axe';

const ITEM = (label: string) =>
  `<ng-template #item><button jigButton style="width: 60px">${label}</button></ng-template>`;

const IMPORTS = ['toolbar', 'toolbarRegion', 'button'];

test('base', async ({ page }, testInfo) => {
  await loadComponent(page, {
    template: `<jig-toolbar style="width: 600px">
      <span>Document</span>
      <button jigButton>Bold</button>
      <div placement="center">Center</div>
      <div placement="end"><button jigButton>Save</button></div>
    </jig-toolbar>`,
    imports: IMPORTS,
  });

  const toolbar = new JigToolbarHarness(page.locator('jig-toolbar'));

  await expect(toolbar.locator).toHaveAttribute('role', 'toolbar');
  await expect(toolbar.locator).toHaveAttribute('aria-orientation', 'horizontal');
  await expect(toolbar.placement('start')).toContainText('Document');
  await expect(toolbar.placement('center')).toContainText('Center');
  await expect(toolbar.placement('end')).toContainText('Save');

  await expectScreenshot(page, testInfo);
  await expectNoA11yViolations(page);
});

test('wrap mode does not collapse anything', async ({ page }) => {
  await loadComponent(page, {
    template: `<jig-toolbar overflow="wrap" style="width: 120px">
      <jig-toolbar-region placement="start">
        ${ITEM('A')}${ITEM('B')}${ITEM('C')}${ITEM('D')}
      </jig-toolbar-region>
    </jig-toolbar>`,
    imports: IMPORTS,
  });

  const toolbar = new JigToolbarHarness(page.locator('jig-toolbar'));

  await expect(toolbar.item).toHaveCount(4);
  await expect(toolbar.itemOverflowing).toHaveCount(0);
  // No trigger is rendered at all outside popover mode.
  await expect(toolbar.triggerIn('start')).toHaveCount(0);
});

test('popover mode collapses what does not fit', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<jig-toolbar overflow="popover" style="width: {{inputs().width}}">
        <jig-toolbar-region placement="start">
          ${ITEM('A')}${ITEM('B')}${ITEM('C')}${ITEM('D')}
        </jig-toolbar-region>
      </jig-toolbar>`,
      imports: IMPORTS,
    },
    { inputs: { width: '900px' } }
  );

  const toolbar = new JigToolbarHarness(page.locator('jig-toolbar'));

  // Wide enough for everything: nothing collapses and the trigger stays hidden.
  await expect(toolbar.item).toHaveCount(4);
  await expect(toolbar.itemOverflowing).toHaveCount(0);
  await toolbar.expectTriggerVisible('start', false);

  await handle.setInputs({ width: '200px' });

  // Narrow: some items collapse, none are lost, and the trigger appears.
  await expect(toolbar.itemOverflowing).not.toHaveCount(0);
  await expect(toolbar.item).toHaveCount(4);
  await toolbar.expectTriggerVisible('start', true);

  await expectScreenshot(page, testInfo, 'collapsed');
  await expectNoA11yViolations(page);
});

test('collapsed items appear in the popover', async ({ page }) => {
  await loadComponent(page, {
    template: `<jig-toolbar overflow="popover" style="width: 200px">
      <jig-toolbar-region placement="start">
        ${ITEM('A')}${ITEM('B')}${ITEM('C')}${ITEM('D')}
      </jig-toolbar-region>
    </jig-toolbar>`,
    imports: IMPORTS,
  });

  const toolbar = new JigToolbarHarness(page.locator('jig-toolbar'));
  await expect(toolbar.itemOverflowing).not.toHaveCount(0);

  const collapsedCount = await toolbar.overflowingItemsIn('start').count();
  await toolbar.openOverflow('start');

  await expect(toolbar.popoverContentIn('start')).toBeVisible();
  await expect(toolbar.popoverContentIn('start').locator('button')).toHaveCount(collapsedCount);
});

test('lower priority collapses first', async ({ page }) => {
  await loadComponent(page, {
    template: `<jig-toolbar overflow="popover" style="width: 260px">
      <jig-toolbar-region placement="start" [priority]="1">
        ${ITEM('low-1')}${ITEM('low-2')}
      </jig-toolbar-region>
      <jig-toolbar-region placement="start" [priority]="10">
        ${ITEM('high-1')}${ITEM('high-2')}
      </jig-toolbar-region>
    </jig-toolbar>`,
    imports: IMPORTS,
  });

  const toolbar = new JigToolbarHarness(page.locator('jig-toolbar'));

  await expect(toolbar.overflowingItemsIn('start')).not.toHaveCount(0);
  // Whatever the exact split, the high-priority region must never give up an
  // item while a low-priority one is still in the bar.
  const overflowing = await toolbar.overflowingItemsIn('start').allInnerTexts();
  const visible = await toolbar.visibleItemsIn('start').allInnerTexts();
  if (overflowing.some(text => text.startsWith('high'))) {
    expect(visible.filter(text => text.startsWith('low'))).toHaveLength(0);
  }
});

test('the end placement collapses too', async ({ page }) => {
  // Its own content alone must exceed the toolbar: with no center content the end track
  // is content-sized, so it only gives up items once it cannot fit on its own.
  await loadComponent(page, {
    template: `<jig-toolbar overflow="popover" style="width: 140px">
      <jig-toolbar-region placement="end">${ITEM('e1')}${ITEM('e2')}${ITEM('e3')}</jig-toolbar-region>
    </jig-toolbar>`,
    imports: IMPORTS,
  });

  const toolbar = new JigToolbarHarness(page.locator('jig-toolbar'));

  await expect(toolbar.overflowingItemsIn('end')).not.toHaveCount(0);
  await toolbar.expectTriggerVisible('end', true);
});

test('start yields before end when both compete', async ({ page }) => {
  await loadComponent(page, {
    template: `<jig-toolbar overflow="popover" style="width: 240px">
      <jig-toolbar-region placement="start">${ITEM('s1')}${ITEM('s2')}${ITEM('s3')}</jig-toolbar-region>
      <jig-toolbar-region placement="end">${ITEM('e1')}${ITEM('e2')}${ITEM('e3')}</jig-toolbar-region>
    </jig-toolbar>`,
    imports: IMPORTS,
  });

  const toolbar = new JigToolbarHarness(page.locator('jig-toolbar'));

  await expect(toolbar.overflowingItemsIn('start')).not.toHaveCount(0);
  await toolbar.expectTriggerVisible('start', true);
});

test('vertical orientation only collapses under a bounded height', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `<jig-toolbar
        orientation="vertical"
        overflow="popover"
        style="height: {{inputs().height}}"
      >
        <jig-toolbar-region placement="start">
          ${ITEM('A')}${ITEM('B')}${ITEM('C')}${ITEM('D')}
        </jig-toolbar-region>
      </jig-toolbar>`,
      imports: IMPORTS,
    },
    { inputs: { height: 'auto' } }
  );

  const toolbar = new JigToolbarHarness(page.locator('jig-toolbar'));

  await expect(toolbar.locator).toHaveAttribute('aria-orientation', 'vertical');
  // Unbounded height always fits its own content — nothing to collapse.
  await expect(toolbar.itemOverflowing).toHaveCount(0);

  await handle.setInputs({ height: '90px' });
  await expect(toolbar.itemOverflowing).not.toHaveCount(0);
});

test('arrow keys move a single tab stop across regions', async ({ page }) => {
  await loadComponent(page, {
    template: `<jig-toolbar style="width: 600px">
      <jig-toolbar-region placement="start">
        <button jigButton id="first">First</button>
      </jig-toolbar-region>
      <jig-toolbar-region placement="end">
        <button jigButton id="second">Second</button>
      </jig-toolbar-region>
    </jig-toolbar>`,
    imports: IMPORTS,
  });

  await page.locator('#first').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#second')).toBeFocused();

  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('#first')).toBeFocused();
});

test('collapsed items are not tab stops', async ({ page }) => {
  await loadComponent(page, {
    template: `<jig-toolbar overflow="popover" style="width: 200px">
      <jig-toolbar-region placement="start">
        ${ITEM('A')}${ITEM('B')}${ITEM('C')}${ITEM('D')}
      </jig-toolbar-region>
    </jig-toolbar>`,
    imports: IMPORTS,
  });

  const toolbar = new JigToolbarHarness(page.locator('jig-toolbar'));
  await expect(toolbar.itemOverflowing).not.toHaveCount(0);
  await expect(toolbar.itemOverflowing.first()).toHaveAttribute('inert', '');
  await expect(toolbar.itemOverflowing.first()).toHaveAttribute('aria-hidden', 'true');
});
