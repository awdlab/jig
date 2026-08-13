import { spinnerControlTemplate } from '@awdlab/jig-themes/templates/spinner';
import { themeClasses } from '../utils/theme.js';
import { expect, type Locator } from '@playwright/test';
import { JigHarness } from '../harness.js';

export class JigSpinnerHarness extends JigHarness {
  public readonly classes = themeClasses(spinnerControlTemplate);

  public readonly svg: Locator;
  public readonly circle: Locator;

  constructor(locator: Locator) {
    super(locator);
    this.svg = locator.locator(this.classes.svg);
    this.circle = locator.locator(this.classes.circle);
  }

  public override async expectVisible() {
    await expect(this.locator).toBeVisible();
    await expect(this.svg).toBeVisible();
    await expect(this.circle).toBeVisible();
  }

  public async expectRole() {
    await expect(this.locator).toHaveAttribute('role', 'status');
  }
}
