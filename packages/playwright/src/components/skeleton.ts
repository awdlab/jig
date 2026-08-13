import { skeletonControlTemplate } from '@awdlab/jig-themes/templates/skeleton';
import { themeClasses } from '../utils/theme';
import { expect, type Locator } from '@playwright/test';

export class JigSkeletonHarness {
  public readonly classes = themeClasses(skeletonControlTemplate);

  public readonly locator: Locator;

  constructor(locator: Locator) {
    this.locator = locator;
  }

  public async expectVisible() {
    await expect(this.locator).toBeVisible();
  }

  public async expectHidden() {
    await expect(this.locator).toHaveAttribute('aria-hidden', 'true');
  }

  public async expectSize(width: number, height: number) {
    const box = await this.locator.boundingBox();
    expect(box?.width).toBeCloseTo(width, 0);
    expect(box?.height).toBeCloseTo(height, 0);
  }

  public async borderRadius() {
    return await this.locator.evaluate(el => getComputedStyle(el).borderTopLeftRadius);
  }
}
