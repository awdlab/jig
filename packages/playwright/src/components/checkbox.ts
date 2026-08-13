import { expect, type Locator } from '@playwright/test';
import { checkboxControlTemplate } from '@awdlab/jig-themes/templates/checkbox';
import { themeClasses } from '../utils/theme.js';
import { JigHarness } from '../harness.js';

export class JigCheckboxHarness extends JigHarness {
  public readonly classes = themeClasses(checkboxControlTemplate);

  /** The native `<input type="checkbox">` — the focus target and event source. */
  public readonly input: Locator;
  public readonly box: Locator;

  constructor(locator: Locator) {
    super(locator);
    this.input = locator.locator(this.classes.input);
    this.box = locator.locator(this.classes.box);
  }

  public async toggle(force = false): Promise<void> {
    await this.input.click({ force });
  }

  public async expectValue(value: boolean): Promise<void> {
    if (value) {
      await expect(this.input).toBeChecked();
    } else {
      await expect(this.input).not.toBeChecked();
    }
  }

  /** The mixed state — set independently of `value`. */
  public async expectIndeterminate(indeterminate = true): Promise<void> {
    await expect
      .poll(() => this.input.evaluate(el => (el as HTMLInputElement).indeterminate))
      .toBe(indeterminate);
  }

  public override async focus(): Promise<void> {
    await this.input.focus();
  }
}
