import { type Locator, expect } from '@playwright/test';

export class NgnRadioGroupHarness {
  public readonly locator: Locator;
  /** All radio options in the group, in DOM order. */
  public readonly radios: Locator;

  constructor(locator: Locator) {
    this.locator = locator;
    this.radios = locator.locator('awd-radio');
  }

  public radio(index: number): Locator {
    return this.radios.nth(index);
  }

  /** Click the radio at `index` to select it. */
  public async select(index: number, force = false) {
    await this.radio(index).click({ force });
  }

  public async expectSelected(index: number) {
    await expect(this.radio(index)).toHaveAttribute('aria-checked', 'true');
  }

  public async expectNotSelected(index: number) {
    await expect(this.radio(index)).toHaveAttribute('aria-checked', 'false');
  }

  public async expectDisabled(index: number, disabled = true) {
    if (disabled) {
      await expect(this.radio(index)).toHaveAttribute('aria-disabled', 'true');
    } else {
      await expect(this.radio(index)).not.toHaveAttribute('aria-disabled', 'true');
    }
  }

  /** Focus the currently active radio (the group's single tab stop). */
  public async focusActive() {
    await this.locator.locator('awd-radio[tabindex="0"]').focus();
  }
}
