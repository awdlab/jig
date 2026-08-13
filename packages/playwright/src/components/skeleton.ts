import { skeletonControlTemplate } from '@awdlab/jig-themes/templates/skeleton';
import { themeClasses } from '../utils/theme.js';
import { expect } from '@playwright/test';
import { JigHarness } from '../harness.js';

export class JigSkeletonHarness extends JigHarness {
  public readonly classes = themeClasses(skeletonControlTemplate);

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
