import test, { expect } from '@playwright/test';
import { JigSkeletonHarness } from '@awdlab/jig-playwright';
import { loadComponent } from '../helper/load-component';
import { useRtl } from '../helper/direction';
import { expectScreenshot } from '../helper/screenshot';
import { expectNoA11yViolations } from '../helper/axe';

test('base', async ({ page }, testInfo) => {
  await loadComponent(
    page,
    {
      template: `<jig-skeleton [width]="200" [height]="16" />`,
      imports: ['skeleton'],
    },
    {}
  );

  const skeleton = new JigSkeletonHarness(page.locator('jig-skeleton'));
  await skeleton.expectVisible();
  await skeleton.expectSize(200, 16);
  await expectScreenshot(page, testInfo, 'initial');
});

// Bare skeleton must be a text-line placeholder: full container width, one line tall.
test('default dimensions', async ({ page }, testInfo) => {
  await loadComponent(
    page,
    {
      template: `<div style="width: 320px; font-size: 16px; line-height: 24px;"><jig-skeleton /></div>`,
      imports: ['skeleton'],
    },
    {}
  );

  const skeleton = new JigSkeletonHarness(page.locator('jig-skeleton'));
  await skeleton.expectSize(320, 24);
  await expectScreenshot(page, testInfo, 'default');
});

// The 2px inset is painted inside the box, so stacked lines separate without the
// occupied height drifting off the line grid.
test('inset does not change occupied height', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `<div style="width: 200px; line-height: 24px;">
        <jig-skeleton />
        <jig-skeleton />
        <jig-skeleton shape="circle" />
      </div>`,
      imports: ['skeleton'],
    },
    {}
  );

  const boxes = await page.locator('jig-skeleton').evaluateAll(els =>
    els.map(el => {
      const cs = getComputedStyle(el);
      return {
        outer: el.getBoundingClientRect().height,
        padding: `${cs.paddingTop}/${cs.paddingBottom}`,
        painted: el.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom),
      };
    })
  );

  // Two stacked lines occupy exactly 2lh, each painting 4px less than it occupies.
  expect(boxes[0]).toEqual({ outer: 24, padding: '2px/2px', painted: 20 });
  expect(boxes[1]).toEqual({ outer: 24, padding: '2px/2px', painted: 20 });
  // A circle keeps its full diameter — insetting it would squash it into an ellipse.
  expect(boxes[2]).toEqual({ outer: 24, padding: '0px/0px', painted: 24 });

  const stackHeight = await page
    .locator('div')
    .first()
    .evaluate(el => el.getBoundingClientRect().height);
  expect(stackHeight).toBe(72);
});

test('circle', async ({ page }, testInfo) => {
  await loadComponent(
    page,
    {
      template: `<jig-skeleton [shape]="'circle'" [diameter]="48" />`,
      imports: ['skeleton'],
    },
    {}
  );

  const skeleton = new JigSkeletonHarness(page.locator('jig-skeleton'));
  await skeleton.expectSize(48, 48);
  expect(await skeleton.borderRadius()).toBe('50%');
  await expectScreenshot(page, testInfo, 'circle-48');
});

test('css length dimensions', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<div style="width: 300px;"><jig-skeleton [width]="inputs().width" [height]="'2rem'" /></div>`,
      imports: ['skeleton'],
    },
    {
      inputs: { width: '100%' },
    }
  );

  const skeleton = new JigSkeletonHarness(page.locator('jig-skeleton'));
  await skeleton.expectSize(300, 32);

  await handle.setInputs({ width: '50%' });
  await skeleton.expectSize(150, 32);
  await expectScreenshot(page, testInfo, 'percent-width');
});

test('custom radius', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<jig-skeleton [width]="120" [height]="120" [radius]="inputs().radius" />`,
      imports: ['skeleton'],
    },
    {
      inputs: { radius: 24 },
    }
  );

  const skeleton = new JigSkeletonHarness(page.locator('jig-skeleton'));
  expect(await skeleton.borderRadius()).toBe('24px');
  await expectScreenshot(page, testInfo, 'radius-24');

  await handle.setInputs({ radius: '9999px' });
  expect(await skeleton.borderRadius()).toBe('9999px');
  await expectScreenshot(page, testInfo, 'radius-pill');
});

// The sizing variables are namespaced, so an app token of the same short name cannot
// reach into the skeleton and override what the theme decided.
test('app custom properties do not leak into the skeleton', async ({ page }) => {
  await loadComponent(page, {
    template: `<div style="--radius: 9999px; --width: 10px; --height: 10px; --inset: 20px">
      <jig-skeleton [width]="200" [height]="16" />
    </div>`,
    imports: ['skeleton'],
  });

  const skeleton = new JigSkeletonHarness(page.locator('jig-skeleton'));
  await skeleton.expectSize(200, 16);
  expect(await skeleton.borderRadius()).not.toBe('9999px');
});

test('is hidden from assistive tech', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `<jig-skeleton [width]="200" [height]="16" />`,
      imports: ['skeleton'],
    },
    {}
  );

  const skeleton = new JigSkeletonHarness(page.locator('jig-skeleton'));
  await skeleton.expectHidden();
  await expect(skeleton.locator).not.toHaveAttribute('role');
});

test('shape combinations', async ({ page }, testInfo) => {
  await loadComponent(
    page,
    {
      template: `
        <div style="display: flex; gap: 1rem; align-items: center;">
          <jig-skeleton [shape]="'circle'" [diameter]="48" />
          <div style="display: flex; flex-direction: column; gap: 0.5rem; width: 240px;">
            <jig-skeleton [width]="'100%'" [height]="12" />
            <jig-skeleton [width]="'70%'" [height]="12" />
          </div>
          <jig-skeleton [width]="120" [height]="80" [radius]="12" />
        </div>
      `,
      imports: ['skeleton'],
    },
    {}
  );

  await expectScreenshot(page, testInfo, 'shapes-comparison');
});

test('accessibility (axe)', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `<div role="status" aria-busy="true" aria-live="polite"><jig-skeleton [width]="200" [height]="16" /></div>`,
      imports: ['skeleton'],
    },
    {}
  );

  await expectNoA11yViolations(page);
});

test('rtl', async ({ page }, testInfo) => {
  await useRtl(page);
  await loadComponent(
    page,
    {
      template: `<jig-skeleton [width]="200" [height]="16" />`,
      imports: ['skeleton'],
    },
    {}
  );
  await expectScreenshot(page, testInfo);
});
