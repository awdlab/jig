import test, { expect, type Page } from '@playwright/test';
import { JigSpinButtonsHarness } from '@awdlab/jig-playwright';
import { loadComponent } from '../helper/load-component';
import { useRtl } from '../helper/direction';
import { expectNoA11yViolations } from '../helper/axe';
import { expectScreenshot } from '../helper/screenshot';

// ---------------------------------------------------------------------------
// Helper: load an input-field with a number input + spin buttons.
// The locale is pinned to en-US so formatting assertions are deterministic.
// Tests are consolidated (few navigations) to keep the shared CI suite well
// under its wall-clock budget.
// ---------------------------------------------------------------------------

async function loadNumberInput(
  page: Page,
  inputs: { value?: number | null; min?: number; max?: number; step?: number } = {}
) {
  const handle = await loadComponent(
    page,
    {
      imports: ['inputField', 'numberInput', 'spinButtons'],
      template: `<jig-input-field>
        <input
          jigNumberInput
          locale="en-US"
          [value]="inputs().value ?? null"
          [min]="inputs().min"
          [max]="inputs().max"
          [step]="inputs().step ?? 1"
          (valueChange)="output('value', $event)"
        />
        <jig-spin-buttons />
      </jig-input-field>`,
    },
    { inputs }
  );
  const input = page.locator('input[jignumberinput]');
  await expect(input).toBeVisible();
  const spin = new JigSpinButtonsHarness(page.locator('jig-spin-buttons'));
  return {
    handle,
    input,
    spin,
    increment: spin.increment.locator,
    decrement: spin.decrement.locator,
  };
}

async function lastValue(handle: { getOutputLog: () => Promise<Record<string, any[]>> }) {
  const log = (await handle.getOutputLog())['value'] ?? [];
  return log[log.length - 1];
}

// ---------------------------------------------------------------------------
// 1. Formatting + ARIA: grouped display while blurred, raw edit text while
//    focused, spinbutton role reflecting the value.
// ---------------------------------------------------------------------------

test('formats when blurred, shows raw text on focus, exposes spinbutton ARIA', async ({ page }) => {
  const { input } = await loadNumberInput(page, { value: 1234.5, min: 0, max: 9999 });

  await expect(input).toHaveValue('1,234.5');
  await expect(input).toHaveAttribute('role', 'spinbutton');
  await expect(input).toHaveAttribute('aria-valuenow', '1234.5');
  await expect(input).toHaveAttribute('aria-valuemin', '0');
  await expect(input).toHaveAttribute('aria-valuemax', '9999');

  await input.focus();
  await expect(input).toHaveValue('1234.5'); // raw, ungrouped

  await input.blur();
  await expect(input).toHaveValue('1,234.5');
});

// ---------------------------------------------------------------------------
// 2. Commit on blur: clamp out-of-range, empty -> null, revert unparseable.
// ---------------------------------------------------------------------------

test('commits on blur — clamps out-of-range, empties to null, reverts garbage', async ({
  page,
}) => {
  const { handle, input } = await loadNumberInput(page, { value: 5, min: 0, max: 100 });

  await input.fill('999');
  await expect(input).toHaveValue('999'); // ensure the typed value registered before blur
  await input.blur();
  await expect(input).toHaveValue('100');
  await expect.poll(() => lastValue(handle)).toBe(100);

  await input.fill('');
  await input.blur();
  await expect(input).toHaveValue('');
  await expect.poll(() => lastValue(handle)).toBe(null);

  await input.fill('abc');
  await input.blur();
  await expect(input).toHaveValue(''); // reverts to the last committed value (null)
});

// ---------------------------------------------------------------------------
// 3. Keyboard stepping: Arrow, Shift big-step, bound clamp, decimal precision,
//    and stepping from uncommitted typed text.
// ---------------------------------------------------------------------------

test('keyboard steps by step/bigStep, clamps at bounds, avoids float drift', async ({ page }) => {
  const { handle, input } = await loadNumberInput(page, { value: 5, min: 0, max: 100 });

  await input.focus();
  await input.press('ArrowUp');
  await expect(input).toHaveValue('6');
  await expect.poll(() => lastValue(handle)).toBe(6);

  await input.press('ArrowDown');
  await expect(input).toHaveValue('5');

  await input.press('Shift+ArrowUp'); // bigStep = 10
  await expect(input).toHaveValue('15');

  // Stepping uses uncommitted typed text as its base.
  await input.fill('20');
  await input.press('ArrowUp');
  await expect(input).toHaveValue('21');
});

test('decimal stepping shows no float drift and clamps without wrapping', async ({ page }) => {
  const { input } = await loadNumberInput(page, { value: 0.2, min: 0, max: 1, step: 0.1 });

  await input.focus();
  await input.press('ArrowUp');
  await expect(input).toHaveValue('0.3'); // not 0.30000000000000004

  await input.fill('1');
  await input.press('ArrowUp');
  await expect(input).toHaveValue('1'); // clamped at max, no wrap
});

// ---------------------------------------------------------------------------
// 4. Spin buttons: click steps, bounds disable, empty seeds min, not tabbable.
// ---------------------------------------------------------------------------

test('spin buttons step, seed from empty, disable at bounds, stay out of tab order', async ({
  page,
}) => {
  const { handle, input, increment, decrement } = await loadNumberInput(page, {
    value: null,
    min: 5,
    max: 7,
  });

  // Buttons are a pointer affordance only.
  await expect(increment).toHaveAttribute('tabindex', '-1');
  await expect(increment).toHaveAttribute('aria-hidden', 'true');

  // Empty value seeds at min on first increment.
  await increment.click();
  await expect(input).toHaveValue('5');
  await expect.poll(() => lastValue(handle)).toBe(5);

  await increment.click();
  await increment.click();
  await expect(input).toHaveValue('7');
  await expect(increment).toBeDisabled(); // at max
  await expect(decrement).toBeEnabled();

  await decrement.click();
  await expect(input).toHaveValue('6');
});

// ---------------------------------------------------------------------------
// 5. Regression: auxiliary controls placed before the input must not shadow
//    the field's primary control (isFieldControl resolution).
// ---------------------------------------------------------------------------

test('spin buttons placed before the input still resolve the number input', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      imports: ['inputField', 'numberInput', 'spinButtons'],
      template: `<jig-input-field>
        <jig-spin-buttons buttons="decrement" />
        <input
          jigNumberInput
          locale="en-US"
          [value]="inputs().value ?? null"
          (valueChange)="output('value', $event)"
        />
        <jig-spin-buttons buttons="increment" />
      </jig-input-field>`,
    },
    { inputs: { value: 5 } }
  );
  const input = page.locator('input[jignumberinput]');
  await expect(input).toBeVisible();

  // Each flanking instance renders exactly one button.
  await expect(page.locator('jig-spin-buttons').nth(0).locator('button')).toHaveCount(1);
  await expect(page.locator('jig-spin-buttons').nth(1).locator('button')).toHaveCount(1);

  await page.locator('jig-spin-buttons').nth(1).locator('button').click(); // increment
  await expect(input).toHaveValue('6');
  await page.locator('jig-spin-buttons').nth(0).locator('button').click(); // decrement
  await expect(input).toHaveValue('5');

  const log = (await handle.getOutputLog())['value'] ?? [];
  expect(log).toContainEqual(6);
});

// ---------------------------------------------------------------------------
// 6. Accessibility scan of a labelled number input with spin buttons.
// ---------------------------------------------------------------------------

test('accessibility (axe)', async ({ page }) => {
  // input-field label names the input (role="spinbutton"); spin buttons are
  // aria-hidden pointer affordances.
  await loadComponent(
    page,
    {
      imports: ['inputField', 'numberInput', 'spinButtons'],
      template: `<jig-input-field label="Quantity">
        <input
          jigNumberInput
          locale="en-US"
          [value]="inputs().value ?? null"
          [min]="0"
          [max]="9999"
        />
        <jig-spin-buttons />
      </jig-input-field>`,
    },
    { inputs: { value: 42 } }
  );

  await expect(page.locator('input[jignumberinput]')).toBeVisible();
  await expectNoA11yViolations(page);
});

test('visual', async ({ page }, testInfo) => {
  const { input } = await loadNumberInput(page, { value: 1234.5, min: 0, max: 10000 });
  await expect(input).toHaveValue(/1.234.5/);

  await expectScreenshot(page, testInfo, 'with-spin-buttons');
});

test('rtl', async ({ page }, testInfo) => {
  await useRtl(page);
  await loadNumberInput(page, { value: 1234.5, min: 0, max: 9999 });
  await expectScreenshot(page, testInfo);
});
