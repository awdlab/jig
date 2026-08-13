import test, { expect, type Locator } from '@playwright/test';
import { loadComponent } from '../helper/load-component';
import { useRtl } from '../helper/direction';
import { expectScreenshot } from '../helper/screenshot';

/** Computed animation/transition values, with durations parsed to seconds. */
async function motionOf(locator: Locator) {
  return await locator.evaluate(el => {
    const style = getComputedStyle(el);
    return {
      name: style.animationName,
      duration: parseFloat(style.animationDuration),
      iterations: style.animationIterationCount,
      transition: parseFloat(style.transitionDuration),
    };
  });
}

test('animations can be enabled in the test wrapper', async ({ page }) => {
  await loadComponent(
    page,
    { template: `<jig-spinner />`, imports: ['spinner'] },
    {},
    {
      search: '?animations',
    }
  );

  await expect(page.locator('style[jig-style="no-animations"]')).toHaveCount(0);

  const spinner = page.locator('jig-spinner svg');
  const motion = await motionOf(spinner);
  expect(motion.duration).toBeGreaterThan(0);
});

test('untiered animations collapse to near-zero under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await loadComponent(
    page,
    {
      template: `<jig-input-field [label]="'Name'"><input jigInput /></jig-input-field>`,
      imports: ['inputField', 'input'],
    },
    {},
    { search: '?animations' }
  );

  const label = page.locator('jig-input-field label').first();
  const motion = await motionOf(label);
  expect(motion.transition).toBeLessThan(0.001);
});

test('nothing is collapsed without reduced motion', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `<jig-input-field [label]="'Name'"><input jigInput /></jig-input-field>`,
      imports: ['inputField', 'input'],
    },
    {},
    { search: '?animations' }
  );

  const label = page.locator('jig-input-field label').first();
  const motion = await motionOf(label);
  expect(motion.transition).toBeGreaterThan(0.01);
});

test('the spinner keeps looping, slowly', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await loadComponent(
    page,
    { template: `<jig-spinner />`, imports: ['spinner'] },
    {},
    {
      search: '?animations',
    }
  );

  for (const selector of ['jig-spinner svg', 'jig-spinner circle']) {
    const motion = await motionOf(page.locator(selector));
    expect(motion.duration).toBe(6);
    expect(motion.iterations).toBe('infinite');
  }
});

test('indeterminate progress keeps looping, determinate is untouched', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const handle = await loadComponent(
    page,
    {
      template: `<jig-progress [indeterminate]="inputs().indeterminate" [value]="50" />`,
      imports: ['progress'],
    },
    { inputs: { indeterminate: true } },
    { search: '?animations' }
  );

  await expect(page.locator('jig-progress.jig-motion-loop')).toHaveCount(1);

  const fill = page.locator('jig-progress .jig-progress-fill');
  const motion = await motionOf(fill);
  expect(motion.duration).toBe(6);
  expect(motion.iterations).toBe('infinite');

  await handle.setInputs({ indeterminate: false });
  await expect(page.locator('jig-progress.jig-motion-loop')).toHaveCount(0);
});

test('the skeleton stops animating', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await loadComponent(
    page,
    { template: `<jig-skeleton [height]="24" />`, imports: ['skeleton'] },
    {},
    {
      search: '?animations',
    }
  );

  const motion = await motionOf(page.locator('jig-skeleton'));
  expect(motion.name).toBe('none');
});

test('the snackbar countdown bar keeps its exact duration', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await loadComponent(
    page,
    {
      template: `<jig-snackbar [header]="'Saved'" [autoHide]="8000" [showProgress]="true" />`,
      imports: ['snackbar'],
    },
    {},
    { search: '?animations' }
  );

  const motion = await motionOf(page.locator('jig-snackbar .jig-motion-exact'));
  expect(motion.duration).toBe(8);
});

test('the snackbar itself still collapses under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await loadComponent(
    page,
    {
      template: `<jig-snackbar [header]="'Saved'" [autoHide]="8000" [showProgress]="true" />`,
      imports: ['snackbar'],
    },
    {},
    { search: '?animations' }
  );

  const motion = await motionOf(page.locator('jig-snackbar'));
  expect(motion.duration).toBeLessThan(0.001);

  // guards against the marker moving from the bar onto the host
  await expect(page.locator('jig-snackbar.jig-motion-exact')).toHaveCount(0);
  await expect(page.locator('jig-snackbar .jig-motion-exact')).toHaveCount(1);
});

test('rtl', async ({ page }, testInfo) => {
  await useRtl(page);
  await loadComponent(
    page,
    { template: `<jig-spinner />`, imports: ['spinner'] },
    {},
    {
      search: '?animations',
    }
  );
  await expectScreenshot(page, testInfo);
});
