import test, { expect } from '@playwright/test';
import { loadComponent } from '../helper/load-component';
import { NgnChipHarness } from '@ngneers/controls-playwright';
import { expectScreenshot } from '../helper/screenshot';
import { mouseDownOnElement } from '../helper/mouse';
import { expectNoA11yViolations } from '../helper/axe';

test('features', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `
      <ngn-chip
        class="page-center"
        [actionable]="inputs().actionable"
        [closable]="inputs().closable"
        (clicked)="output('clicked', $event)"
        (closed)="output('closed', $event)"
      >Chip</ngn-chip>
    `,
      imports: ['chip'],
    },
    {
      inputs: { actionable: false, closable: false },
    }
  );

  const chip = new NgnChipHarness(page.locator('ngn-chip'));

  await test.step('default', async () => {
    await expectScreenshot(page, testInfo, 'default');
    await chip.click();
    expect(await handle.getOutputLog()).toEqual({});
  });

  await page.mouse.move(0, 0);

  await test.step('actionable', async () => {
    await handle.setInputs({ actionable: true, closable: false });
    await chip.content.focus();
    await expectScreenshot(page, testInfo, 'actionable-content-focused');

    await chip.click();
    expect(await handle.getOutputLogAndClear()).toEqual({ clicked: [expect.anything()] });
  });

  await page.mouse.move(0, 0);

  await test.step('closable', async () => {
    await handle.setInputs({ actionable: false, closable: true });
    await chip.closeButton.focus();
    await expectScreenshot(page, testInfo, 'closable-close-focused');

    await chip.close();
    expect(await handle.getOutputLogAndClear()).toEqual({ closed: [expect.anything()] });
  });

  await page.mouse.move(0, 0);

  await test.step('actionable & closable', async () => {
    await handle.setInputs({ actionable: true, closable: true });
    await chip.content.focus();
    await expectScreenshot(page, testInfo, 'actionable-closable-content-focused');
    await chip.closeButton.focus();
    await expectScreenshot(page, testInfo, 'actionable-closable-close-focused');

    await chip.click();
    expect(await handle.getOutputLogAndClear()).toEqual({ clicked: [expect.anything()] });
    await chip.close();
    expect(await handle.getOutputLogAndClear()).toEqual({ closed: [expect.anything()] });
  });
});

test('colors', async ({ page }, testInfo) => {
  await loadComponent(
    page,
    {
      template: `
      <div class="page-center">
        <div class="flex gap-2 flex-wrap">
          @for (color of inputs().colors; track $index) {
            <ngn-chip [color]="color">{{ color ?? 'default' }}</ngn-chip>
          }
        </div>
      </div>
    `,
      imports: ['chip'],
    },
    {
      inputs: {
        colors: [
          'surface',
          'primary',
          'secondary',
          'accent',
          'success',
          'warning',
          'error',
          'info',
        ],
      },
    }
  );

  await expectScreenshot(page, testInfo, 'colors');
});

test('accessibility (axe)', async ({ page }) => {
  // Actionable + closable so the icon-only close button (which has an
  // i18n aria-label) is included in the scan.
  await loadComponent(
    page,
    {
      template: `<ngn-chip class="page-center" [actionable]="true" [closable]="true">Active</ngn-chip>`,
      imports: ['chip'],
    },
    { inputs: {} }
  );
  await expectNoA11yViolations(page);
});
