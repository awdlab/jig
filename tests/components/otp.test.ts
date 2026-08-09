import test, { expect, type Page } from '@playwright/test';
import { loadComponent } from '../helper/load-component';
import { expectNoA11yViolations } from '../helper/axe';
import { expectScreenshot } from '../helper/screenshot';

// ---------------------------------------------------------------------------
// Helper: load a labelled awd-otp and expose its composed value on the output
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
      template: `<awd-otp
        label="Verification code"
        [length]="inputs().length ?? 6"
        [mask]="inputs().mask ?? false"
        [integerOnly]="inputs().integerOnly ?? false"
        (valueChange)="output('value', $event)"
      />`,
    },
    { inputs }
  );
  const otp = page.locator('awd-otp');
  await expect(otp).toBeVisible();
  const cells = otp.locator('input');
  return { handle, otp, cells };
}

async function lastValue(handle: { getOutputLog: () => Promise<Record<string, any[]>> }) {
  const log = (await handle.getOutputLog())['value'] ?? [];
  return log[log.length - 1];
}

// ---------------------------------------------------------------------------
// 1. Renders one cell per `length` and composes the value as focus advances.
// ---------------------------------------------------------------------------

test('renders one cell per length and composes the value while typing', async ({ page }) => {
  const { handle, cells } = await loadOtp(page, { length: 4, integerOnly: true });

  await expect(cells).toHaveCount(4);

  await cells.first().focus();
  await page.keyboard.type('1234');

  await expect(cells.nth(0)).toHaveValue('1');
  await expect(cells.nth(3)).toHaveValue('4');
  // Focus auto-advanced to the last cell.
  await expect(cells.nth(3)).toBeFocused();
  await expect.poll(() => lastValue(handle)).toBe('1234');
});

// ---------------------------------------------------------------------------
// 2. integerOnly rejects non-digit characters.
// ---------------------------------------------------------------------------

test('integerOnly rejects non-digit input', async ({ page }) => {
  const { cells } = await loadOtp(page, { length: 4, integerOnly: true });

  await cells.first().focus();
  await page.keyboard.type('a1');

  // The letter is dropped; the digit lands in the first cell.
  await expect(cells.nth(0)).toHaveValue('1');
});

// ---------------------------------------------------------------------------
// 3. Backspace clears the active cell, then steps back and clears the previous.
// ---------------------------------------------------------------------------

test('backspace clears the active cell and steps back when empty', async ({ page }) => {
  const { cells } = await loadOtp(page, { length: 4, integerOnly: true });

  await cells.first().focus();
  await page.keyboard.type('12');
  // Focus is on cell 2 (empty). First Backspace steps back to cell 1 and clears it.
  await page.keyboard.press('Backspace');
  await expect(cells.nth(1)).toBeFocused();
  await expect(cells.nth(1)).toHaveValue('');
  // Second Backspace clears the (still-filled) cell 0.
  await page.keyboard.press('Backspace');
  await expect(cells.nth(0)).toHaveValue('');
});

// ---------------------------------------------------------------------------
// 4. Pasting a code distributes across the cells.
// ---------------------------------------------------------------------------

test('paste distributes characters across cells', async ({ page }) => {
  const { handle, cells } = await loadOtp(page, { length: 6, integerOnly: true });

  // Dispatch a synthetic paste with populated clipboardData — CI browsers deny
  // the real Clipboard API, so we drive the control's `paste` handler directly.
  await cells.first().focus();
  await page.evaluate((text: string) => {
    const input = document.querySelector('awd-otp input') as HTMLInputElement;
    input.focus();
    const dt = new DataTransfer();
    dt.setData('text', text);
    const event = new ClipboardEvent('paste', { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'clipboardData', { value: dt, configurable: true });
    input.dispatchEvent(event);
  }, '123456');

  await expect(cells.nth(0)).toHaveValue('1');
  await expect(cells.nth(5)).toHaveValue('6');
  await expect.poll(() => lastValue(handle)).toBe('123456');
});

// ---------------------------------------------------------------------------
// 5. mask renders the cells as password fields.
// ---------------------------------------------------------------------------

test('mask renders cells as password fields', async ({ page }) => {
  const { cells } = await loadOtp(page, { length: 4, mask: true });

  await expect(cells.first()).toHaveAttribute('type', 'password');
});

// ---------------------------------------------------------------------------
// 6. Accessibility scan of a labelled OTP field.
// ---------------------------------------------------------------------------

test('accessibility (axe)', async ({ page }) => {
  const { otp } = await loadOtp(page, { length: 6, integerOnly: true });

  await expect(otp).toHaveAttribute('role', 'group');
  await expect(otp).toHaveAttribute('aria-label', 'Verification code');
  await expectNoA11yViolations(page);
});

test('visual', async ({ page }, testInfo) => {
  const { cells } = await loadOtp(page, { length: 4, integerOnly: true });

  await test.step('empty', async () => {
    await expectScreenshot(page, testInfo, 'empty');
  });

  await test.step('filled', async () => {
    await cells.first().focus();
    await page.keyboard.type('1234');
    await expect(cells.nth(3)).toHaveValue('4');
    await expectScreenshot(page, testInfo, 'filled');
  });
});
