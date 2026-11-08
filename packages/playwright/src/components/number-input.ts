import type { Locator } from '@playwright/test';
import { JigInputHarness } from './input.js';
import { JigSpinButtonsHarness } from './spin-buttons.js';

/**
 * Harness for `input[jigNumberInput]`. The spin buttons are siblings in the surrounding
 * `jig-input-field`, so they are found there unless a locator is passed.
 */
export class JigNumberInputHarness extends JigInputHarness {
  public readonly spinButtons: JigSpinButtonsHarness;

  constructor(locator: Locator, spinButtons?: Locator) {
    super(locator);
    this.spinButtons = new JigSpinButtonsHarness(
      spinButtons ?? locator.locator('xpath=ancestor::jig-input-field[1]//jig-spin-buttons')
    );
  }

  /** Clicks the increment spin button `times` times. */
  public increment(times = 1): Promise<void> {
    return this.spinButtons.step(1, times);
  }

  /** Clicks the decrement spin button `times` times. */
  public decrement(times = 1): Promise<void> {
    return this.spinButtons.step(-1, times);
  }
}
