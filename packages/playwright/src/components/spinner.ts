import { spinnerControlTemplate } from '@awdlab/jig-themes/templates/spinner';
import { themeClasses } from '../utils/theme';
import test, { expect, type Locator } from '@playwright/test';

export class NgnSpinnerHarness {
  public readonly classes = themeClasses(spinnerControlTemplate);

  public readonly locator: Locator;
  public readonly svg: Locator;
  public readonly circle: Locator;

  constructor(locator: Locator) {
    this.locator = locator;
    this.svg = locator.locator(this.classes.svg);
    this.circle = locator.locator(this.classes.circle);
  }

  public async expectVisible() {
    await expect(this.locator).toBeVisible();
    await expect(this.svg).toBeVisible();
    await expect(this.circle).toBeVisible();
  }

  public async expectRole() {
    await expect(this.locator).toHaveAttribute('role', 'status');
  }
}
