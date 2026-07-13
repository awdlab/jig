import test, { expect } from '@playwright/test';
import { loadComponent } from '../helper/load-component';
import { NgnTooltipHarness } from '@ngneers/controls-playwright';
import { expectScreenshot } from '../helper/screenshot';
import { expectNoA11yViolations } from '../helper/axe';

test('base', async ({ page }, testInfo) => {
  const handle = await loadComponent(page, {
    template: `<button class="page-center" [ngnTooltip]="'Hello World!'">Button</button>`,
    imports: ['tooltip'],
  });

  const tooltip = new NgnTooltipHarness(page.getByRole('tooltip').first());
  const button = page.getByRole('button').first();
  await expectScreenshot(page, testInfo, 'closed');

  await test.step('hover', async () => {
    await button.hover();
    await tooltip.expectRendered();
    await tooltip.expectOpened();
    await expect(tooltip.content).toHaveText('Hello World!');
    await expectScreenshot(page, testInfo, 'hover');
  });

  await test.step('unhover', async () => {
    await page.mouse.move(0, 0);
    await tooltip.expectOpened(false);
  });

  await test.step('focus', async () => {
    await button.focus();
    await tooltip.expectOpened();
    await expectScreenshot(page, testInfo, 'focus');
  });

  await test.step('blur', async () => {
    await button.evaluate(b => (b as HTMLElement).blur());
    await tooltip.expectOpened(false);
  });
});

test('position change', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `
        <button
          class="page-center"
          [ngnTooltip]="'Hello World!'"
          [ngnTooltipOptions]="inputs()"
          [ngnTooltipShowDelay]="0"
        >
          Button
        </button>
      `,
      imports: ['tooltip'],
    },
    {
      inputs: { placement: 'left', offset: 4, showArrow: true },
    }
  );

  const tooltip = new NgnTooltipHarness(page.getByRole('tooltip').first());
  const button = page.getByRole('button').first();
  await button.hover();
  await tooltip.expectRendered();
  await tooltip.expectOpened();

  const configurations = [
    { placement: 'left', offset: 8, showArrow: true },
    { placement: 'left', offset: 20, showArrow: false },
    { placement: 'left-start', offset: 15, showArrow: true },
    { placement: 'left-start', offset: 7, showArrow: false },
    { placement: 'left-end', offset: 12, showArrow: true },
    { placement: 'left-end', offset: 2, showArrow: false },
    { placement: 'top', offset: 5, showArrow: true },
    { placement: 'top', offset: 25, showArrow: false },
    { placement: 'top-start', offset: 10, showArrow: true },
    { placement: 'top-start', offset: 3, showArrow: false },
    { placement: 'top-end', offset: 18, showArrow: true },
    { placement: 'top-end', offset: 0, showArrow: false },
    { placement: 'right', offset: 6, showArrow: true },
    { placement: 'right', offset: 30, showArrow: false },
    { placement: 'right-start', offset: 14, showArrow: true },
    { placement: 'right-start', offset: 4, showArrow: false },
    { placement: 'right-end', offset: 11, showArrow: true },
    { placement: 'right-end', offset: 1, showArrow: false },
    { placement: 'bottom', offset: 9, showArrow: true },
    { placement: 'bottom', offset: 22, showArrow: false },
    { placement: 'bottom-start', offset: 13, showArrow: true },
    { placement: 'bottom-start', offset: 5, showArrow: false },
    { placement: 'bottom-end', offset: 16, showArrow: true },
    { placement: 'bottom-end', offset: 3, showArrow: false },
  ];

  for (const config of configurations) {
    await test.step(`Placement: ${config.placement}, Offset: ${config.offset}, Arrow: ${config.showArrow}`, async () => {
      await handle.setInputs(config);

      await expectScreenshot(
        page,
        testInfo,
        `${config.placement}-offset-${config.offset}-${config.showArrow ? 'with' : 'without'}-arrow`
      );
    });
  }
});

test('positioning on scroll', async ({ page }, testInfo) => {
  const handle = await loadComponent(page, {
    template: `
        <div style="height: calc(100vh + 30px); width: calc(100vw + 30px); position: relative;">
          <div id="toScreenshot" style="position: absolute; top: 50vh; left: 50vw; width: 200px; height: 200px;">
            <button
              style="margin: 50px;"
              [ngnTooltip]="'Hello World!'"
              [ngnTooltipShowDelay]="0"
              [ngnTooltipHideDelay]="'1m'"
            >
              Button
            </button>
          </div>
        </div>
      `,
    imports: ['tooltip'],
  });

  const tooltip = new NgnTooltipHarness(page.getByRole('tooltip').first());
  const button = page.getByRole('button').first();
  const toScreenshot = page.locator('#toScreenshot');
  await button.hover();
  await tooltip.expectRendered();
  await tooltip.expectOpened();

  await test.step('not scrolled', async () => {
    await expectScreenshot(toScreenshot, testInfo);
  });

  await test.step('scrolled vertically', async () => {
    await page.evaluate(() => window.scrollTo(0, 25));
    await expectScreenshot(toScreenshot, testInfo);
  });

  await test.step('scrolled both', async () => {
    await page.evaluate(() => window.scrollTo(25, 25));
    await expectScreenshot(toScreenshot, testInfo);
  });

  await test.step('scrolled horizontally', async () => {
    await page.evaluate(() => window.scrollTo(25, 0));
    await expectScreenshot(toScreenshot, testInfo);
  });
});

test('accessibility (axe)', async ({ page }) => {
  await loadComponent(page, {
    template: `<button class="page-center" [ngnTooltip]="'Hello World!'">Button</button>`,
    imports: ['tooltip'],
  });

  const tooltip = new NgnTooltipHarness(page.getByRole('tooltip').first());
  const button = page.getByRole('button').first();

  // The tooltip surface only exists in the DOM once shown.
  await button.hover();
  await tooltip.expectRendered();
  await tooltip.expectOpened();

  await expectNoA11yViolations(page);
});
