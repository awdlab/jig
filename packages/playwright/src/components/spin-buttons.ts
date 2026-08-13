import type { Locator } from '@playwright/test';
import { spinButtonsControlTemplate } from '@awdlab/jig-themes/templates/spin-buttons';
import { themeClasses } from '../utils/theme.js';
import { JigHarness } from '../harness.js';
import { JigButtonHarness } from './button.js';

/**
 * Harness for `jig-spin-buttons`, the stepper pair projected into a `jig-input-field` next to a
 * `input[jigNumberInput]`. The input itself is a plain input — use `JigInputHarness` for it.
 */
export class JigSpinButtonsHarness extends JigHarness {
  public readonly classes = themeClasses(spinButtonsControlTemplate);

  public readonly increment: JigButtonHarness;
  public readonly decrement: JigButtonHarness;

  constructor(locator: Locator) {
    super(locator);
    this.increment = new JigButtonHarness(locator.locator(this.classes.increment['root']));
    this.decrement = new JigButtonHarness(locator.locator(this.classes.decrement['root']));
  }

  public step(direction: 1 | -1, times = 1): Promise<void> {
    const button = direction === 1 ? this.increment : this.decrement;
    return button.click({ clickCount: times });
  }
}
