import { type Locator, expect } from '@playwright/test';
import { themeClasses } from '../utils/theme.js';
import { inplaceControlTemplate } from '@awdlab/jig-themes/templates/inplace';
import { JigHarness } from '../harness.js';

export class JigInplaceHarness extends JigHarness {
  public readonly classes = themeClasses(inplaceControlTemplate);

  public readonly display: Locator;
  public readonly content: Locator;

  constructor(locator: Locator) {
    super(locator);
    this.display = this.locator.locator(this.classes['display']);
    this.content = this.locator.locator(this.classes['content']);
  }

  public expectDisplayVisible(visible = true) {
    if (visible) {
      return expect(this.display).toBeVisible();
    }
    return expect(this.display).not.toBeVisible();
  }

  public expectContentVisible(visible = true) {
    if (visible) {
      return expect(this.content).toBeVisible();
    }
    return expect(this.content).not.toBeVisible();
  }

  public async clickDisplay() {
    await this.display.click();
  }
}
