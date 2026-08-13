import test, { expect } from '@playwright/test';
import { JigSplitterHarness } from '@awdlab/jig-playwright';
import { loadComponent } from '../helper/load-component';
import { useRtl } from '../helper/direction';
import { expectNoA11yViolations } from '../helper/axe';
import { expectScreenshot } from '../helper/screenshot';

/**
 * The `thin` and `invisible` kinds must expand the divider visually on hover
 * WITHOUT shifting surrounding content: the divider grid track stays fixed
 * (1px for thin, 0px for invisible) while an out-of-flow ::after bar grows.
 */

test('thin kind expands on hover without shifting content', async ({ page }) => {
  await loadComponent(page, {
    template: `
      <jig-splitter
        class="page-center"
        [layout]="'horizontal'"
        [kind]="'thin'"
        style="width: 400px; height: 120px;"
      >
        <jig-splitter-panel [size]="'1fr'">Panel 1</jig-splitter-panel>
        <jig-splitter-panel [size]="'1fr'">Panel 2</jig-splitter-panel>
      </jig-splitter>
    `,
    imports: ['splitter', 'splitterPanel'],
  });

  const handle = page.locator('[role="separator"]');
  await expect(handle).toBeVisible();

  const dividerWidth = () => handle.evaluate(el => (el.parentElement as HTMLElement).offsetWidth);
  const barWidth = () => handle.evaluate(el => parseFloat(getComputedStyle(el, '::after').width));

  // Resting state: 1px track, 1px visible line.
  expect(await dividerWidth()).toBe(1);
  const restBar = await barWidth();

  const panel2 = page.locator('jig-splitter-panel').nth(1);
  const before = await panel2.boundingBox();

  await handle.hover();
  await page.waitForTimeout(250); // let the expand transition finish

  // The bar expanded, but the track and the adjacent panel did not move.
  expect(await barWidth()).toBeGreaterThan(restBar);
  expect(await dividerWidth()).toBe(1);
  const after = await panel2.boundingBox();
  expect(after!.x).toBeCloseTo(before!.x, 0);
});

test('invisible kind has a 0px track and expands on hover', async ({ page }) => {
  await loadComponent(page, {
    template: `
      <jig-splitter
        class="page-center"
        [layout]="'horizontal'"
        [kind]="'invisible'"
        style="width: 400px; height: 120px;"
      >
        <jig-splitter-panel [size]="'1fr'">Panel 1</jig-splitter-panel>
        <jig-splitter-panel [size]="'1fr'">Panel 2</jig-splitter-panel>
      </jig-splitter>
    `,
    imports: ['splitter', 'splitterPanel'],
  });

  const handle = page.locator('[role="separator"]');
  await expect(handle).toBeVisible();

  const dividerWidth = () => handle.evaluate(el => (el.parentElement as HTMLElement).offsetWidth);
  const barWidth = () => handle.evaluate(el => parseFloat(getComputedStyle(el, '::after').width));

  // Resting state: no track, no visible line.
  expect(await dividerWidth()).toBe(0);
  expect(await barWidth()).toBe(0);

  await handle.hover();
  await page.waitForTimeout(250);

  // Expands on hover, still no track (0px).
  expect(await barWidth()).toBeGreaterThan(0);
  expect(await dividerWidth()).toBe(0);
});

test('accessibility (axe)', async ({ page }) => {
  await loadComponent(page, {
    template: `
      <jig-splitter
        class="page-center"
        [layout]="'horizontal'"
        style="width: 400px; height: 120px;"
      >
        <jig-splitter-panel [size]="'1fr'">Panel 1</jig-splitter-panel>
        <jig-splitter-panel [size]="'1fr'">Panel 2</jig-splitter-panel>
      </jig-splitter>
    `,
    imports: ['splitter', 'splitterPanel'],
  });

  await expect(page.locator('[role="separator"]')).toBeVisible();

  await expectNoA11yViolations(page);
});

test('visual', async ({ page }, testInfo) => {
  await loadComponent(
    page,
    {
      template: `
      <jig-splitter
        class="page-center"
        [layout]="'horizontal'"
        [kind]="inputs().kind"
        style="width: 400px; height: 120px;"
      >
        <jig-splitter-panel [size]="'1fr'">Panel 1</jig-splitter-panel>
        <jig-splitter-panel [size]="'1fr'">Panel 2</jig-splitter-panel>
      </jig-splitter>
    `,
      imports: ['splitter', 'splitterPanel'],
    },
    { inputs: { kind: 'default' } }
  );

  await expect(page.locator('[role="separator"]')).toBeVisible();
  await expectScreenshot(page, testInfo, 'horizontal');
});

test('rtl', async ({ page }, testInfo) => {
  await useRtl(page);
  await loadComponent(page, {
    template: `
      <jig-splitter
        class="page-center"
        [layout]="'horizontal'"
        [kind]="'thin'"
        style="width: 400px; height: 120px;"
      >
        <jig-splitter-panel [size]="'1fr'">Panel 1</jig-splitter-panel>
        <jig-splitter-panel [size]="'1fr'">Panel 2</jig-splitter-panel>
      </jig-splitter>
    `,
    imports: ['splitter', 'splitterPanel'],
  });
  await expectScreenshot(page, testInfo);
});

const DRAG_TEMPLATE = `
  <jig-splitter class="page-center" [layout]="'horizontal'" style="width: 400px; height: 120px;">
    <jig-splitter-panel [size]="'1fr'">Panel 1</jig-splitter-panel>
    <jig-splitter-panel [size]="'1fr'">Panel 2</jig-splitter-panel>
  </jig-splitter>
`;

function splitter(page: import('@playwright/test').Page) {
  return new JigSplitterHarness(page.locator('jig-splitter'));
}

/** Drags the divider by `dx` screen pixels. */
async function dragDividerBy(page: import('@playwright/test').Page, dx: number) {
  await splitter(page).dragDivider(0, dx);
}

const firstPanelWidth = async (page: import('@playwright/test').Page) => {
  const box = await page.locator('jig-splitter-panel').first().boundingBox();
  return box!.width;
};

test('dragging the divider toward the inline-end grows the first panel', async ({ page }) => {
  await loadComponent(page, { template: DRAG_TEMPLATE, imports: ['splitter', 'splitterPanel'] });
  const before = await firstPanelWidth(page);

  // LTR: the inline-end is to the right.
  await dragDividerBy(page, 60);
  expect(await firstPanelWidth(page)).toBeGreaterThan(before + 40);
});

test('rtl pointer: dragging the divider toward the inline-end grows the first panel', async ({
  page,
}) => {
  await useRtl(page);
  await loadComponent(page, { template: DRAG_TEMPLATE, imports: ['splitter', 'splitterPanel'] });
  const before = await firstPanelWidth(page);

  // RTL mirrors the panel order, so the inline-end is now to the LEFT. Dragging
  // right (as LTR would) must shrink the first panel instead.
  await dragDividerBy(page, -60);
  expect(await firstPanelWidth(page)).toBeGreaterThan(before + 40);

  const grown = await firstPanelWidth(page);
  await dragDividerBy(page, 60);
  expect(await firstPanelWidth(page)).toBeLessThan(grown - 40);
});
