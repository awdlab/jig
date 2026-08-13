import { type Locator, expect } from '@playwright/test';
import { themeClasses } from '../utils/theme.js';
import { otpControlTemplate } from '@awdlab/jig-themes/templates/otp';
import { JigHarness } from '../harness.js';

/**
 * Playwright harness for `jig-otp`.
 *
 * The control renders one `<input maxlength="1">` per character cell; the
 * composed `value` model is not written to the DOM, so assert it via a bound
 * echo element in the test component.
 */
export class JigOtpHarness extends JigHarness {
  public readonly classes = themeClasses(otpControlTemplate);

  /** All character-cell inputs, in order. */
  public readonly cells: Locator;

  constructor(locator: Locator) {
    super(locator);
    this.cells = locator.locator('input');
  }

  /** Focus the cell at `index`. */
  public async focusCell(index: number): Promise<void> {
    await this.cells.nth(index).focus();
  }

  /** Press a single key on the cell at `index`. */
  public async pressCell(index: number, key: string): Promise<void> {
    await this.cells.nth(index).focus();
    await this.cells.nth(index).press(key);
  }

  /** Type a full code starting at the first cell, letting focus auto-advance. */
  public async fill(code: string): Promise<void> {
    await this.cells.first().focus();
    await this.locator.page().keyboard.type(code, { delay: 5 });
  }

  /** Assert the visible characters across all cells (empty cells contribute ''). */
  public expectCells(chars: string): Promise<void> {
    return expect
      .poll(async () => {
        const values = await this.cells.evaluateAll(nodes =>
          nodes.map(n => (n as HTMLInputElement).value)
        );
        return values.join('');
      })
      .toEqual(chars);
  }

  /** Number of cells rendered. */
  public count(): Promise<number> {
    return this.cells.count();
  }
}
