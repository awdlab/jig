import { type Locator, expect } from '@playwright/test';
import { themeClasses } from '../utils/theme';
import { toggleButtonControlTemplate } from '@awdlab/jig-themes/templates/toggle-button';

export class NgnToggleButtonHarness {
  public readonly classes = themeClasses(toggleButtonControlTemplate);

  public readonly locator: Locator;

  constructor(locator: Locator) {
    this.locator = locator;
  }

  public async click(force = false) {
    await this.locator.click({ force });
  }

  public async expectActive(active: boolean) {
    if (active) {
      await expect(this.locator).toHaveClass(new RegExp(this.classes.active));
    } else {
      await expect(this.locator).not.toHaveClass(new RegExp(this.classes.active));
    }
  }

  public async expectDisabled(disabled: boolean) {
    if (disabled) {
      await expect(this.locator).toBeDisabled();
    } else {
      await expect(this.locator).not.toBeDisabled();
    }
  }
}
