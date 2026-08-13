import { messageControlTemplate } from '@awdlab/jig-themes/templates/message';
import { themeClasses } from '../utils/theme.js';
import { expect, type Locator } from '@playwright/test';
import { JigHarness } from '../harness.js';

export class JigMessageHarness extends JigHarness {
  public readonly classes = themeClasses(messageControlTemplate);

  public readonly content: Locator;
  public readonly icon: Locator;

  constructor(locator: Locator) {
    super(locator);
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
