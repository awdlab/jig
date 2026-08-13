import { badgeControlTemplate } from '@awdlab/jig-themes/templates/badge';
import { themeClasses } from '../utils/theme.js';
import { expect, type Locator } from '@playwright/test';
import { JigHarness } from '../harness.js';

export class JigBadgeHarness extends JigHarness {
  public readonly classes = themeClasses(badgeControlTemplate);
  public readonly badge: Locator;

  constructor(hostLocator: Locator) {
    super(hostLocator);
    this.badge = hostLocator.locator(this.classes.root);
  }

  public override async expectVisible(visible: boolean) {
    if (visible) {
      await expect(this.badge).toBeVisible();
    } else {
      await expect(this.badge).toHaveCount(0);
    }
  }

  public override async expectText(text: string) {
    await expect(this.badge).toHaveText(text);
  }
}
