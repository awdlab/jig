import test, { expect, type Locator, type Page } from '@playwright/test';
import { loadComponent } from '../helper/load-component';
import { useRtl } from '../helper/direction';
import { expectScreenshot } from '../helper/screenshot';

import type { TemplateType } from '../../apps/test-wrapper/src/app/window.js';

// JigMovable writes left/top on pointer drag. On a shared host JigResizable claims the
// gesture that starts on its grip, so a resize never doubles as a move.
const panel = (page: Page) => page.locator('.panel');

async function box(el: Locator) {
  const b = await el.boundingBox();
  if (!b) {
    throw new Error('Element is not visible');
  }
  return b;
}

async function dragFrom(page: Page, el: Locator, corner: 'grip' | 'body') {
  const b = await box(el);
  const from =
    corner === 'grip'
      ? { x: b.x + b.width - 3, y: b.y + b.height - 3 }
      : { x: b.x + 20, y: b.y + 20 };
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move(from.x + 60, from.y + 40, { steps: 5 });
  await page.mouse.up();
}

const movableTemplate = (extra: string): TemplateType => ({
  template: `
    <div style="position: relative; height: 320px;">
      <div
        jigMovable
        [jigMovableLimitToViewport]="false"
        ${extra}
        class="panel"
        style="position: absolute; top: 24px; left: 24px; width: 200px; height: 120px; overflow: auto;"
      >panel</div>
    </div>
  `,
  imports: ['movable', 'resizable'],
});

test('resizable host: dragging the resize grip does not move the element', async ({ page }) => {
  await loadComponent(page, movableTemplate('jigResizable'));

  await expect(panel(page)).toHaveCSS('resize', 'both');
  const before = await box(panel(page));
  await dragFrom(page, panel(page), 'grip');
  const after = await box(panel(page));

  // The top-left corner stays put — JigResizable claimed the gesture.
  // Size is not asserted: whether a synthetic drag drives the native grip is browser-dependent.
  expect(Math.abs(after.x - before.x)).toBeLessThanOrEqual(1);
  expect(Math.abs(after.y - before.y)).toBeLessThanOrEqual(1);
});

test('resizable host: the grip claim holds when down and move land in one task', async ({
  page,
}) => {
  await loadComponent(page, movableTemplate('jigResizable'));
  await expect(panel(page)).toHaveCSS('resize', 'both');

  // Synthetic dispatch leaves no gap for a change-detection flush between the events —
  // the same batching a loaded CI machine produces.
  const moved = await page.evaluate(() => {
    const el = document.querySelector('.panel') as HTMLElement;
    const rect = el.getBoundingClientRect();
    const opts = { bubbles: true, pointerId: 1, pointerType: 'mouse', button: 0, buttons: 1 };
    const grip = { clientX: rect.right - 3, clientY: rect.bottom - 3 };
    const target = { clientX: grip.clientX + 60, clientY: grip.clientY + 40 };
    el.dispatchEvent(new PointerEvent('pointerdown', { ...opts, ...grip }));
    document.dispatchEvent(new PointerEvent('pointermove', { ...opts, ...target }));
    document.dispatchEvent(new PointerEvent('pointerup', { ...opts, ...target }));
    return new Promise<number>(resolve =>
      requestAnimationFrame(() =>
        requestAnimationFrame(() => resolve(el.getBoundingClientRect().left - rect.left))
      )
    );
  });

  expect(moved).toBe(0);
});

test('resizable host: dragging the body still moves the element', async ({ page }) => {
  await loadComponent(page, movableTemplate('jigResizable'));

  const before = await box(panel(page));
  await dragFrom(page, panel(page), 'body');
  const after = await box(panel(page));

  expect(after.x).toBeGreaterThan(before.x);
  expect(after.y).toBeGreaterThan(before.y);
});

test('non-resizable host: the bottom-right corner is an ordinary drag start', async ({ page }) => {
  await loadComponent(page, movableTemplate(''));

  await expect(panel(page)).toHaveCSS('resize', 'none');
  const before = await box(panel(page));
  await dragFrom(page, panel(page), 'grip');
  const after = await box(panel(page));

  expect(after.x).toBeGreaterThan(before.x);
  expect(after.y).toBeGreaterThan(before.y);
});

test('rtl', async ({ page }, testInfo) => {
  await useRtl(page);
  await loadComponent(page, movableTemplate('jigResizable'));
  await expectScreenshot(page, testInfo);
});
