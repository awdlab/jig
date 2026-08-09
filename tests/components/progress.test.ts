import test, { expect } from '@playwright/test';
import { NgnProgressHarness } from '@awdlab/jig-playwright';
import { loadComponent } from '../helper/load-component';
import { expectScreenshot } from '../helper/screenshot';
import { expectNoA11yViolations } from '../helper/axe';

test('base', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<awd-progress [value]="inputs().value" />`,
      imports: ['progress'],
    },
    {
      inputs: {
        value: 50,
      },
    }
  );

  const progress = new NgnProgressHarness(page.locator('awd-progress'));
  await progress.expectVisible();
  await progress.expectValue(50);
  await progress.expectMin(0);
  await progress.expectMax(100);
  await expectScreenshot(page, testInfo, 'initial');
});

test('value updates', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<awd-progress [value]="inputs().value" />`,
      imports: ['progress'],
    },
    {
      inputs: {
        value: 25,
      },
    }
  );

  const progress = new NgnProgressHarness(page.locator('awd-progress'));
  await progress.expectValue(25);
  await expectScreenshot(page, testInfo, 'value-25');

  // Update value via input
  await handle.setInputs({ value: 75 });
  await progress.expectValue(75);
  await expectScreenshot(page, testInfo, 'value-75');

  // Update to 0
  await handle.setInputs({ value: 0 });
  await progress.expectValue(0);
  await expectScreenshot(page, testInfo, 'value-0');

  // Update to 100
  await handle.setInputs({ value: 100 });
  await progress.expectValue(100);
  await expectScreenshot(page, testInfo, 'value-100');
});

test('indeterminate mode', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<awd-progress [value]="inputs().value" [indeterminate]="inputs().indeterminate" />`,
      imports: ['progress'],
    },
    {
      inputs: {
        value: 50,
        indeterminate: true,
      },
    }
  );

  const progress = new NgnProgressHarness(page.locator('awd-progress'));
  await progress.expectVisible();
  await progress.expectIndeterminate(true);

  // In indeterminate mode, aria-valuenow should be null
  await expect(progress.locator).not.toHaveAttribute('aria-valuenow');
  await expectScreenshot(page, testInfo, 'indeterminate');

  // Switch to determinate mode
  await handle.setInputs({ indeterminate: false });
  await progress.expectIndeterminate(false);
  await progress.expectValue(50);
  await expectScreenshot(page, testInfo, 'determinate');
});

test('accessibility', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<awd-progress [value]="inputs().value" />`,
      imports: ['progress'],
    },
    {
      inputs: {
        value: 50,
      },
    }
  );

  const progress = new NgnProgressHarness(page.locator('awd-progress'));

  // Check ARIA attributes
  await expect(progress.locator).toHaveAttribute('role', 'progressbar');
  await expect(progress.locator).toHaveAttribute('aria-valuenow', '50');
  await expect(progress.locator).toHaveAttribute('aria-valuemin', '0');
  await expect(progress.locator).toHaveAttribute('aria-valuemax', '100');
});

test('edge cases', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<awd-progress [value]="inputs().value" />`,
      imports: ['progress'],
    },
    {
      inputs: {
        value: 150, // Over 100
      },
    }
  );

  const progress = new NgnProgressHarness(page.locator('awd-progress'));
  // Component should clamp to 100
  await progress.expectValue(100);
  await expectScreenshot(page, testInfo, 'clamped-100');

  // Test negative value
  await handle.setInputs({ value: -10 });
  // Component should clamp to 0
  await progress.expectValue(0);
  await expectScreenshot(page, testInfo, 'clamped-0');
});

test('circular mode', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<awd-progress [value]="inputs().value" [circular]="inputs().circular" [radius]="inputs().radius" [thickness]="inputs().thickness" />`,
      imports: ['progress'],
    },
    {
      inputs: {
        value: 75,
        circular: true,
        radius: 50,
        thickness: 6,
      },
    }
  );

  const progress = new NgnProgressHarness(page.locator('awd-progress'));
  await progress.expectVisible();
  await progress.expectCircular(true);
  await progress.expectValue(75);
  await expectScreenshot(page, testInfo, 'circular-75');

  // Switch to linear mode
  await handle.setInputs({ circular: false });
  await progress.expectCircular(false);
  await expectScreenshot(page, testInfo, 'linear-75');
});

test('circular indeterminate mode', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<awd-progress [circular]="inputs().circular" [indeterminate]="inputs().indeterminate" [radius]="inputs().radius" [thickness]="inputs().thickness" />`,
      imports: ['progress'],
    },
    {
      inputs: {
        circular: true,
        indeterminate: true,
        radius: 50,
        thickness: 6,
      },
    }
  );

  const progress = new NgnProgressHarness(page.locator('awd-progress'));
  await progress.expectVisible();
  await progress.expectCircular(true);

  // In indeterminate mode, aria-valuenow should be null
  await expect(progress.locator).not.toHaveAttribute('aria-valuenow');
  await expectScreenshot(page, testInfo, 'circular-indeterminate');
});

test('accessibility (axe)', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `<awd-progress aria-label="Upload progress" [value]="inputs().value" />`,
      imports: ['progress'],
    },
    {
      inputs: {
        value: 50,
      },
    }
  );

  await expectNoA11yViolations(page);
});
