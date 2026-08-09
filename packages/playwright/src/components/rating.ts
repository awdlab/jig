import { ratingControlTemplate } from '@awdlab/jig-themes/templates/rating';
import { themeClasses } from '../utils/theme';
import { expect, type Locator } from '@playwright/test';

export class AwdRatingHarness {
  public readonly classes = themeClasses(ratingControlTemplate);
  public readonly locator: Locator;
  public readonly symbols: Locator;

  constructor(locator: Locator) {
    this.locator = locator;
    this.symbols = locator.locator(this.classes.symbol);
  }

  public async expectValue(value: number) {
    await expect(this.locator).toHaveAttribute('aria-valuenow', value.toString());
  }

  public async expectMax(max: number) {
    await expect(this.locator).toHaveAttribute('aria-valuemax', max.toString());
  }

  public async clickSymbol(index: number, position: 'left' | 'center' | 'right' = 'center') {
    const symbol = this.symbols.nth(index);
    const box = await symbol.boundingBox();
    if (!box) {
      throw new Error(`Symbol ${index} not found`);
    }
    const x = position === 'left' ? 2 : position === 'right' ? box.width - 2 : box.width / 2;
    await symbol.click({ position: { x, y: box.height / 2 } });
  }

  public async focus() {
    await this.locator.focus();
  }

  public async pressKey(key: string) {
    await this.locator.press(key);
  }
}
