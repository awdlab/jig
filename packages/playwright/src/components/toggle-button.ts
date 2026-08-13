import { expect } from '@playwright/test';
import { themeClasses } from '../utils/theme.js';
import { toggleButtonControlTemplate } from '@awdlab/jig-themes/templates/toggle-button';
import { JigHarness } from '../harness.js';

export class JigToggleButtonHarness extends JigHarness {
  public readonly classes = themeClasses(toggleButtonControlTemplate);

  public async expectActive(active: boolean) {
    if (active) {
      await expect(this.locator).toHaveClass(new RegExp(this.classes.active));
    } else {
      await expect(this.locator).not.toHaveClass(new RegExp(this.classes.active));
    }
  }
}
