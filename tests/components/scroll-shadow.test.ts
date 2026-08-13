import test, { expect, type Page } from '@playwright/test';

import { expectNoA11yViolations } from '../helper/axe';
import { loadComponent } from '../helper/load-component';
import { useRtl } from '../helper/direction';
import { expectScreenshot } from '../helper/screenshot';

// The directive toggles `scrolled-{start,end,top,bottom}` classes on the target and injects a
// theme-styled edge-shadow overlay into the scroll container. `jigScrollShadowUnstyled` marks the
// overlay so the theme hides it (display:none). Class names are `{prefix}{scope}-{className}`, so
// we match the stable `scrolled-*` / `overlay` substrings and stay agnostic to the name prefix.

const classesOf = (page: Page, selector: string) =>
  page.locator(selector).evaluate(el => el.className);

// The scroll event that drives update() is dispatched asynchronously, so read the classes
// through a poll rather than once. Assert the expected classes before the absent ones — a
// negative check passes trivially while the update is still pending.
const expectClasses = (page: Page, selector: string) =>
  expect.poll(() => classesOf(page, selector));

const scrollTo = async (page: Page, selector: string, pos: { left?: number; top?: number }) => {
  await page.locator(selector).evaluate((el, p) => {
    if (p.left !== undefined) el.scrollLeft = p.left;
    if (p.top !== undefined) el.scrollTop = p.top;
  }, pos);
  // the update() runs synchronously in the (passive) scroll listener
  await page.waitForTimeout(50);
};

/**
 * The directive attaches its scroll listener in `afterNextRender`, which is rAF-scheduled and
 * can be throttled on a backgrounded page (its initial ResizeObserver pass is likewise
 * suspended). Gate on the listener actually being live: toggle scroll on both axes until a
 * `scrolled-*` class appears, then reset to the top-left corner so callers start deterministic.
 */
async function waitReady(page: Page, scrollSelector: string, classSelector = scrollSelector) {
  // Un-hide the page so its rAF (and thus afterNextRender / ResizeObserver) isn't throttled by
  // the headless server backgrounding non-focused pages.
  await page.bringToFront().catch(() => {});
  await expect(async () => {
    await page.locator(scrollSelector).evaluate(el => {
      el.scrollLeft = el.scrollLeft > 0 ? 0 : Math.max(1, el.scrollWidth - el.clientWidth);
      el.scrollTop = el.scrollTop > 0 ? 0 : Math.max(1, el.scrollHeight - el.clientHeight);
    });
    await page.waitForTimeout(50);
    expect(await classesOf(page, classSelector)).toMatch(/scrolled-/);
  }).toPass({ timeout: 20000 });
  await scrollTo(page, scrollSelector, { left: 0, top: 0 });
}

test('horizontal - toggles scrolled-start / scrolled-end on horizontal scroll', async ({
  page,
}) => {
  await loadComponent(page, {
    template: `
      <div id="sc" jigScrollShadow="horizontal" style="width: 200px; height: 100px; overflow: auto;">
        <div style="width: 800px; height: 40px;"></div>
      </div>`,
    imports: ['scrollShadow'],
  });
  await expect(page.locator('#sc')).toBeVisible();
  await waitReady(page, '#sc');

  // At the start: end shadow only.
  await expectClasses(page, '#sc').toContain('scrolled-end');
  await expectClasses(page, '#sc').not.toContain('scrolled-start');

  // Fully scrolled right: start shadow only.
  await scrollTo(page, '#sc', { left: 9999 });
  await expectClasses(page, '#sc').toContain('scrolled-start');
  await expectClasses(page, '#sc').not.toContain('scrolled-end');

  // Mid-scroll: both.
  await scrollTo(page, '#sc', { left: 200 });
  await expectClasses(page, '#sc').toContain('scrolled-start');
  await expectClasses(page, '#sc').toContain('scrolled-end');
});

test('horizontal - does not add vertical classes', async ({ page }) => {
  await loadComponent(page, {
    template: `
      <div id="sc" jigScrollShadow="horizontal" style="width: 200px; height: 100px; overflow: auto;">
        <div style="width: 800px; height: 400px;"></div>
      </div>`,
    imports: ['scrollShadow'],
  });
  await expect(page.locator('#sc')).toBeVisible();
  await waitReady(page, '#sc');

  await scrollTo(page, '#sc', { left: 100, top: 100 });
  await expectClasses(page, '#sc').toContain('scrolled-start');
  const cls = await classesOf(page, '#sc');
  expect(cls).not.toContain('scrolled-top');
  expect(cls).not.toContain('scrolled-bottom');
});

test('vertical - toggles scrolled-top / scrolled-bottom on vertical scroll', async ({ page }) => {
  await loadComponent(page, {
    template: `
      <div id="sc" jigScrollShadow="vertical" style="width: 200px; height: 100px; overflow: auto;">
        <div style="width: 40px; height: 800px;"></div>
      </div>`,
    imports: ['scrollShadow'],
  });
  await expect(page.locator('#sc')).toBeVisible();
  await waitReady(page, '#sc');

  await expectClasses(page, '#sc').toContain('scrolled-bottom');
  await expectClasses(page, '#sc').not.toContain('scrolled-top');

  await scrollTo(page, '#sc', { top: 9999 });
  await expectClasses(page, '#sc').toContain('scrolled-top');
  await expectClasses(page, '#sc').not.toContain('scrolled-bottom');
});

test('both - tracks both axes simultaneously', async ({ page }) => {
  await loadComponent(page, {
    template: `
      <div id="sc" jigScrollShadow="both" style="width: 200px; height: 100px; overflow: auto;">
        <div style="width: 800px; height: 800px;"></div>
      </div>`,
    imports: ['scrollShadow'],
  });
  await expect(page.locator('#sc')).toBeVisible();
  await waitReady(page, '#sc');

  await scrollTo(page, '#sc', { left: 200, top: 200 });
  await expectClasses(page, '#sc').toContain('scrolled-start');
  await expectClasses(page, '#sc').toContain('scrolled-end');
  await expectClasses(page, '#sc').toContain('scrolled-top');
  await expectClasses(page, '#sc').toContain('scrolled-bottom');
});

test('scrollShadowTarget - applies classes to target, not the scroll container', async ({
  page,
}) => {
  await loadComponent(page, {
    template: `
      <div id="sc" jigScrollShadow="horizontal" [scrollShadowTarget]="target"
           style="width: 200px; height: 100px; overflow: auto;">
        <div style="width: 800px; height: 40px;"></div>
      </div>
      <div #target id="target">shadow host</div>`,
    imports: ['scrollShadow'],
  });
  await expect(page.locator('#sc')).toBeVisible();
  await waitReady(page, '#sc', '#target');

  await scrollTo(page, '#sc', { left: 100 });

  await expectClasses(page, '#target').toContain('scrolled-start');
  await expectClasses(page, '#target').toContain('scrolled-end');

  const container = await classesOf(page, '#sc');
  expect(container).not.toContain('scrolled-start');
  expect(container).not.toContain('scrolled-end');
});

test('unstyled - overlay is injected but hidden (display:none) so it never disturbs layout', async ({
  page,
}) => {
  await loadComponent(page, {
    template: `
      <div id="on" jigScrollShadow="both" style="width: 120px; height: 120px; overflow: auto;">
        <div style="width: 400px; height: 400px;"></div>
      </div>
      <div id="off" jigScrollShadow="both" jigScrollShadowUnstyled style="width: 120px; height: 120px; overflow: auto;">
        <div style="width: 400px; height: 400px;"></div>
      </div>`,
    imports: ['scrollShadow'],
  });
  await expect(page.locator('#on')).toBeVisible();
  await page.bringToFront().catch(() => {});

  // The overlay is always injected (scoped `scrollShadow-overlay` class, prefix-agnostic)...
  await expect(page.locator('#on [class*="scrollShadow-overlay"]')).toHaveCount(1);
  await expect(page.locator('#off [class*="scrollShadow-overlay"]')).toHaveCount(1);

  // ...but styled by default and hidden (display:none) when unstyled.
  const display = (sel: string) => page.locator(sel).evaluate(el => getComputedStyle(el).display);
  expect(await display('#on [class*="scrollShadow-overlay"]')).not.toBe('none');
  expect(await display('#off [class*="scrollShadow-overlay"]')).toBe('none');
});

test('visual - theme overlay shadows on all four edges (both axes, mid-scroll)', async ({
  page,
}, testInfo) => {
  await loadComponent(page, {
    template: `
      <div id="sc" jigScrollShadow="both" style="width: 200px; height: 120px; overflow: auto; background: #fff;">
        <div style="width: 800px; height: 800px;
                    background: repeating-linear-gradient(45deg, #eee 0 10px, #f7f7f7 10px 20px);"></div>
      </div>`,
    imports: ['scrollShadow'],
  });
  await expect(page.locator('#sc')).toBeVisible();

  // No custom CSS: the shadows come from the directive's injected overlay styled by the real theme.
  await waitReady(page, '#sc');
  await scrollTo(page, '#sc', { left: 200, top: 200 });
  await expectClasses(page, '#sc').toContain('scrolled-start');

  await expectScreenshot(page.locator('#sc'), testInfo);
});

test('accessibility (axe)', async ({ page }) => {
  // The scroll container is author-owned, so the author supplies the keyboard access
  // (WCAG 2.1.1); the check covers the overlay the directive injects into it.
  await loadComponent(page, {
    template: `
      <div
        id="sc"
        jigScrollShadow="both"
        tabindex="0"
        role="region"
        aria-label="Scrollable content"
        style="width: 200px; height: 100px; overflow: auto;">
        <div style="width: 800px; height: 800px;"></div>
      </div>`,
    imports: ['scrollShadow'],
  });
  await expect(page.locator('#sc')).toBeVisible();
  await waitReady(page, '#sc');

  await expectNoA11yViolations(page);
});

test('rtl', async ({ page }, testInfo) => {
  await useRtl(page);
  await loadComponent(page, {
    template: `
      <div id="sc" jigScrollShadow="horizontal" style="width: 200px; height: 100px; overflow: auto;">
        <div style="width: 800px; height: 40px;"></div>
      </div>`,
    imports: ['scrollShadow'],
  });
  await expectScreenshot(page, testInfo);
});
