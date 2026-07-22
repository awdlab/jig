import { badgeControlTemplate } from '@ngneers/controls-themes/templates/badge';
import { themeClasses } from '../utils/theme';
import { expect, type Locator } from '@playwright/test';

export class NgnBadgeHarness {
  public readonly classes = themeClasses(badgeControlTemplate);
  public readonly locator: Locator;
  public readonly badge: Locator;

  constructor(hostLocator: Locator) {
    this.locator = hostLocator;
    this.badge = hostLocator.locator(this.classes.root);
  }

  public async expectVisible(visible: boolean) {
    if (visible) {
      await expect(this.badge).toBeVisible();
    } else {
      await expect(this.badge).toHaveCount(0);
    }
  }

  public async expectText(text: string) {
    await expect(this.badge).toHaveText(text);
  }
}
