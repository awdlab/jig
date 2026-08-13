import test, { expect, type Page } from '@playwright/test';
import { JigSpinnerHarness } from '@awdlab/jig-playwright';
import { loadComponent } from '../helper/load-component';
import { useRtl } from '../helper/direction';
import { expectScreenshot } from '../helper/screenshot';
import { expectNoA11yViolations } from '../helper/axe';

test('base', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<jig-spinner />`,
      imports: ['spinner'],
    },
    {}
  );

  const spinner = new JigSpinnerHarness(page.locator('jig-spinner'));
  await spinner.expectVisible();
  await spinner.expectRole();
  await expectScreenshot(page, testInfo, 'initial');
});

test('custom size', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<jig-spinner [size]="inputs().size" />`,
      imports: ['spinner'],
    },
    {
      inputs: {
        size: 64,
      },
    }
  );

  const spinner = new JigSpinnerHarness(page.locator('jig-spinner'));
  await spinner.expectVisible();
  await expectScreenshot(page, testInfo, 'size-64');

  // Test smaller size
  await handle.setInputs({ size: 16 });
  await expectScreenshot(page, testInfo, 'size-16');

  // Test larger size
  await handle.setInputs({ size: 128 });
  await expectScreenshot(page, testInfo, 'size-128');
});

test('custom thickness', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<jig-spinner [size]="inputs().size" [thickness]="inputs().thickness" />`,
      imports: ['spinner'],
    },
    {
      inputs: {
        size: 64,
        thickness: '8px',
      },
    }
  );

  const spinner = new JigSpinnerHarness(page.locator('jig-spinner'));
  await spinner.expectVisible();
  await expectScreenshot(page, testInfo, 'thickness-8');

  // Test thinner
  await handle.setInputs({ thickness: '2px' });
  await expectScreenshot(page, testInfo, 'thickness-2');

  // Test thicker
  await handle.setInputs({ thickness: '12px' });
  await expectScreenshot(page, testInfo, 'thickness-12');
});

test('accessibility', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<jig-spinner />`,
      imports: ['spinner'],
    },
    {}
  );

  const spinner = new JigSpinnerHarness(page.locator('jig-spinner'));

  // Check ARIA attributes
  await expect(spinner.locator).toHaveAttribute('role', 'status');
  await spinner.expectVisible();
});

test('size combinations', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `
        <div style="display: flex; gap: 1rem; align-items: center;">
          <jig-spinner [size]="16" />
          <jig-spinner [size]="32" />
          <jig-spinner [size]="48" />
          <jig-spinner [size]="64" />
        </div>
      `,
      imports: ['spinner'],
    },
    {}
  );

  await expectScreenshot(page, testInfo, 'sizes-comparison');
});

test('accessibility (axe)', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `<jig-spinner />`,
      imports: ['spinner'],
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
      template: `<jig-spinner />`,
      imports: ['spinner'],
    },
    {}
  );
  await expectScreenshot(page, testInfo);
});
