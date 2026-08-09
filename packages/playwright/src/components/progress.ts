import { progressControlTemplate } from '@awdlab/jig-themes/templates/progress';
import { themeClasses } from '../utils/theme';
import test, { expect, type Locator } from '@playwright/test';

export class AwdProgressHarness {
  public readonly classes = themeClasses(progressControlTemplate);

  public readonly locator: Locator;
  public readonly track: Locator;
  public readonly fill: Locator;
  public readonly fill2: Locator;
  public readonly svg: Locator;

  constructor(locator: Locator) {
    this.locator = locator;
    this.track = locator.locator(this.classes.track);
    this.fill = locator.locator(this.classes.fill);
    this.fill2 = locator.locator(this.classes.fill2);
    this.svg = locator.locator(this.classes.svg);
  }

  public async expectValue(value: number) {
    await expect(this.locator).toHaveAttribute('aria-valuenow', value.toString());
  }

  public async expectMin(min: number) {
    await expect(this.locator).toHaveAttribute('aria-valuemin', min.toString());
  }

  public async expectMax(max: number) {
    await expect(this.locator).toHaveAttribute('aria-valuemax', max.toString());
  }

  public async expectVisible() {
    await expect(this.locator).toBeVisible();
  }

  public async expectIndeterminate(indeterminate: boolean) {
    if (indeterminate) {
      await expect(this.fill2).toBeAttached();
    } else {
      await expect(this.fill2).not.toBeAttached();
    }
  }

  public async expectCircular(circular: boolean) {
    if (circular) {
      await expect(this.svg).toBeVisible();
    } else {
      await expect(this.svg).not.toBeAttached();
    }
  }
}
