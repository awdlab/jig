import test, { expect } from '@playwright/test';
import { loadComponent } from '../helper/load-component';
import { NgnChipHarness } from '@ngneers/controls-playwright';
import { expectScreenshot } from '../helper/screenshot';
import { mouseDownOnElement } from '../helper/mouse';

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

test('kinds', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `
      <ngn-chip
        class="page-center"
        [actionable]="true"
        [closable]="true"
        [kind]="inputs().kind"
      >Chip</ngn-chip>
    `,
      imports: ['chip'],
    },
    {
      inputs: { kind: undefined },
    }
  );

  const chip = new NgnChipHarness(page.locator('ngn-chip'));

  const kinds = [
    undefined,
    'primary',
    'secondary',
    'accent',
    'success',
    'warning',
    'error',
    'info',
  ];

  for (const kind of kinds) {
    await page.mouse.move(0, 0);

    await test.step(`kind: ${kind ?? 'default'}`, async () => {
      await handle.setInputs({ kind });

      await expectScreenshot(page, testInfo, `kind-${kind ?? 'default'}`);

      await chip.content.hover();
      await expectScreenshot(page, testInfo, `kind-${kind ?? 'default'}-hover`);

      await chip.content.focus();
      await expectScreenshot(page, testInfo, `kind-${kind ?? 'default'}-focus`);
      await chip.content.blur();

      await mouseDownOnElement(page, chip.content);
      await expectScreenshot(page, testInfo, `kind-${kind ?? 'default'}-active`);
      await page.mouse.up();
    });
  }
});
