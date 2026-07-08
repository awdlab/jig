import test, { expect } from '@playwright/test';
import { loadComponent } from '../helper/load-component';

/**
 * The `thin` and `invisible` kinds must expand the divider visually on hover
 * WITHOUT shifting surrounding content: the divider grid track stays fixed
 * (1px for thin, 0px for invisible) while an out-of-flow ::after bar grows.
 */

test('thin kind expands on hover without shifting content', async ({ page }) => {
  await loadComponent(page, {
    template: `
      <ngn-splitter
        class="page-center"
        [layout]="'horizontal'"
        [kind]="'thin'"
        style="width: 400px; height: 120px;"
      >
        <ngn-splitter-panel [size]="'1fr'">Panel 1</ngn-splitter-panel>
        <ngn-splitter-panel [size]="'1fr'">Panel 2</ngn-splitter-panel>
      </ngn-splitter>
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

  const panel2 = page.locator('ngn-splitter-panel').nth(1);
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
      <ngn-splitter
        class="page-center"
        [layout]="'horizontal'"
        [kind]="'invisible'"
        style="width: 400px; height: 120px;"
      >
        <ngn-splitter-panel [size]="'1fr'">Panel 1</ngn-splitter-panel>
        <ngn-splitter-panel [size]="'1fr'">Panel 2</ngn-splitter-panel>
      </ngn-splitter>
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
