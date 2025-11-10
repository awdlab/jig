import { messageControlTemplate } from '@ngneers/controls-themes/templates/message';
import { themeClasses } from '../utils/theme';
import test, { expect, Locator } from '@playwright/test';

export class NgnMessageHarness {
  public readonly classes = themeClasses(messageControlTemplate);

  public readonly locator: Locator;
  public readonly content: Locator;
  public readonly icon: Locator;

  constructor(locator: Locator) {
    this.locator = locator;
    this.content = locator.locator(this.classes.content);
    this.icon = locator.locator(this.classes.icon);
  }

  public async expectIcon(hasIcon: boolean) {
    if (hasIcon) {
      await expect(this.icon).toBeVisible();
    } else {
      await expect(this.icon).not.toBeVisible();
    }
  }
}
