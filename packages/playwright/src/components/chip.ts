import { chipControlTemplate } from '@ngneers/controls-themes/templates/chip';
import { themeClasses } from '../utils/theme';
import test, { expect, type Locator } from '@playwright/test';

export class NgnChipHarness {
  public readonly classes = themeClasses(chipControlTemplate);

  public readonly locator: Locator;
  public readonly content: Locator;
  public readonly closeButton: Locator;

  constructor(locator: Locator) {
    this.locator = locator;
    this.content = locator.locator(this.classes.content);
    this.closeButton = locator.locator(this.classes['close-button']);
  }

  public async click() {
    await this.content.click();
  }

  public async close() {
    await this.closeButton.click();
  }

  public async expectState(state: { actionable?: boolean; closable?: boolean }) {
    if (state.actionable !== undefined) {
      if (state.actionable) {
        await expect(this.locator).toHaveClass(this.classes.actionable);
      } else {
        await expect(this.locator).not.toHaveClass(this.classes.actionable);
      }
    }

    if (state.closable !== undefined) {
      if (state.closable) {
        await expect(this.locator).toHaveClass(this.classes.closable);
      } else {
        await expect(this.locator).not.toHaveClass(this.classes.closable);
      }
    }
  }
}
