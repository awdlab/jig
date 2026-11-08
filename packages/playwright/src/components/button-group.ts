import { expect, type Locator } from '@playwright/test';
import { buttonGroupControlTemplate } from '@awdlab/jig-themes/templates/button-group';
import { themeClasses } from '../utils/theme.js';
import { JIG_CLASSES } from '../utils/classes.js';
import { JigButtonHarness } from './button.js';
import { JigHarness } from '../harness.js';

export class JigButtonGroupHarness extends JigHarness {
  public readonly classes = themeClasses(buttonGroupControlTemplate);

  public readonly buttons: Locator;

  constructor(locator: Locator) {
    super(locator);
    this.buttons = locator.locator(JIG_CLASSES.button.root);
  }

  public async expectItemCount(count: number) {
    await expect(this.buttons).toHaveCount(count);
  }

  public getButtonByIndex(index: number): JigButtonHarness {
    return new JigButtonHarness(this.buttons.nth(index));
  }
}
