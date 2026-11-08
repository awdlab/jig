import test, { expect, type Page } from '@playwright/test';
import { JigOtpHarness } from '@awdlab/jig-playwright';
import { loadComponent } from '../helper/load-component';
import { useRtl } from '../helper/direction';
import { expectNoA11yViolations } from '../helper/axe';
import { expectScreenshot } from '../helper/screenshot';

// ---------------------------------------------------------------------------
// Helper: load a labelled jig-otp and expose its composed value on the output
// log. Cells are the individual <input maxlength="1"> elements, in order.
// ---------------------------------------------------------------------------

async function loadOtp(
  page: Page,
  inputs: { length?: number; mask?: boolean; integerOnly?: boolean } = {}
) {
  const handle = await loadComponent(
    page,
    {
      imports: ['otp'],
      template: `<jig-otp
        label="Verification code"
        [length]="inputs().length ?? 6"
        [mask]="inputs().mask ?? false"
        [integerOnly]="inputs().integerOnly ?? false"
        (valueChange)="output('value', $event)"
      />`,
    },
    { inputs }
  );
  const otp = new JigOtpHarness(page.locator('jig-otp'));
  await otp.expectVisible();
  return { handle, otp };
}

async function lastValue(handle: { getOutputLog: () => Promise<Record<string, any[]>> }) {
  const log = (await handle.getOutputLog())['value'] ?? [];
  return log[log.length - 1];
}

// ---------------------------------------------------------------------------
// 1. Renders one cell per `length` and composes the value as focus advances.
// ---------------------------------------------------------------------------

test('renders one cell per length and composes the value while typing', async ({ page }) => {
  const { handle, otp } = await loadOtp(page, { length: 4, integerOnly: true });

  await expect(otp.cells).toHaveCount(4);

  await otp.fill('1234');

  await otp.expectCells('1234');
  // Focus auto-advanced to the last cell.
  await expect(otp.getCellByIndex(3)).toBeFocused();
  await expect.poll(() => lastValue(handle)).toBe('1234');
});

// ---------------------------------------------------------------------------
// 2. integerOnly rejects non-digit characters.
// ---------------------------------------------------------------------------

test('integerOnly rejects non-digit input', async ({ page }) => {
  const { otp } = await loadOtp(page, { length: 4, integerOnly: true });

  await otp.fill('a1');

  // The letter is dropped; the digit lands in the first cell.
  await expect(otp.getCellByIndex(0)).toHaveValue('1');
});

// ---------------------------------------------------------------------------
// 3. Backspace clears the active cell, then steps back and clears the previous.
// ---------------------------------------------------------------------------

test('backspace clears the active cell and steps back when empty', async ({ page }) => {
  const { otp } = await loadOtp(page, { length: 4, integerOnly: true });

  await otp.fill('12');
  // Focus is on cell 2 (empty). First Backspace steps back to cell 1 and clears it.
  await page.keyboard.press('Backspace');
  await expect(otp.getCellByIndex(1)).toBeFocused();
  await expect(otp.getCellByIndex(1)).toHaveValue('');
  // Second Backspace clears the (still-filled) cell 0.
  await page.keyboard.press('Backspace');
  await expect(otp.getCellByIndex(0)).toHaveValue('');
});

// ---------------------------------------------------------------------------
// 4. Pasting a code distributes across the cells.
// ---------------------------------------------------------------------------

test('paste distributes characters across cells', async ({ page }) => {
  const { handle, otp } = await loadOtp(page, { length: 6, integerOnly: true });

  // Dispatch a synthetic paste with populated clipboardData — CI browsers deny
  // the real Clipboard API, so we drive the control's `paste` handler directly.
  await otp.focusCell(0);
  await otp.getCellByIndex(0).evaluate((input: HTMLInputElement, text: string) => {
    input.focus();
    const dt = new DataTransfer();
    dt.setData('text', text);
    const event = new ClipboardEvent('paste', { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'clipboardData', { value: dt, configurable: true });
    input.dispatchEvent(event);
  }, '123456');

  await otp.expectCells('123456');
  await expect.poll(() => lastValue(handle)).toBe('123456');
});

// ---------------------------------------------------------------------------
// 5. mask renders the cells as password fields.
// ---------------------------------------------------------------------------

test('mask renders cells as password fields', async ({ page }) => {
  const { otp } = await loadOtp(page, { length: 4, mask: true });

  await expect(otp.getCellByIndex(0)).toHaveAttribute('type', 'password');
});

// ---------------------------------------------------------------------------
// 6. Accessibility scan of a labelled OTP field.
// ---------------------------------------------------------------------------

test('accessibility (axe)', async ({ page }) => {
  const { otp } = await loadOtp(page, { length: 6, integerOnly: true });

  await expect(otp.locator).toHaveAttribute('role', 'group');
  await expect(otp.locator).toHaveAttribute('aria-label', 'Verification code');
  await expectNoA11yViolations(page);
});

test('visual', async ({ page }, testInfo) => {
  const { otp } = await loadOtp(page, { length: 4, integerOnly: true });

  await test.step('empty', async () => {
    await expectScreenshot(page, testInfo, 'empty');
  });

  await test.step('filled', async () => {
    await otp.fill('1234');
    await otp.expectCells('1234');
    await expectScreenshot(page, testInfo, 'filled');
  });
});

test('rtl', async ({ page }, testInfo) => {
  await useRtl(page);
  const { otp } = await loadOtp(page, { length: 4, integerOnly: true });
  await otp.fill('12');
  await expectScreenshot(page, testInfo);
});

test('rtl keyboard: cells advance along the inline axis', async ({ page }) => {
  await useRtl(page);
  const { otp } = await loadOtp(page, { length: 4, integerOnly: true });

  await otp.focusCell(0);
  await expect(otp.getCellByIndex(0)).toBeFocused();

  await page.keyboard.press('ArrowLeft');
  await expect(otp.getCellByIndex(1)).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(otp.getCellByIndex(0)).toBeFocused();

  // Cannot step past the first cell backwards.
  await page.keyboard.press('ArrowRight');
  await expect(otp.getCellByIndex(0)).toBeFocused();
});
