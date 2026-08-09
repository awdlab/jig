import { expect, type Locator } from '@playwright/test';
import { themeClasses } from '../utils/theme';
import { itemViewControlTemplate } from '@awdlab/jig-themes/templates/item-view';

export class NgnItemViewHarness {
  public readonly classes = themeClasses(itemViewControlTemplate);
  public readonly item: Locator;
  public readonly itemVisible: Locator;
  public readonly itemOverflowing: Locator;
  public readonly overflowItem: Locator;

  constructor(public locator: Locator) {
    this.item = locator.locator(this.classes['item']);
    this.itemVisible = locator.locator(
      `${this.classes['item']}:not(${this.classes['item-overflowing']})`
    );
    this.itemOverflowing = locator.locator(this.classes['item-overflowing']);
    this.overflowItem = locator.locator(this.classes['more-items']);
  }

  public async expectItemCount(count: number) {
    await expect(this.item).toHaveCount(count);
  }

  public async expectItemVisibleCount(count: number) {
    await expect(this.itemVisible).toHaveCount(count);
  }

  public async expectItemOverflowingCount(count: number) {
    await expect(this.itemOverflowing).toHaveCount(count);
  }

  public async expectItemTexts(texts: string[]) {
    await expect(this.item).toHaveText(texts);
  }

  public async expectItemVisibleTexts(texts: string[]) {
    await expect(this.itemVisible).toHaveText(texts);
  }

  public async expectItemOverflowingTexts(texts: string[]) {
    await expect(this.itemOverflowing).toHaveText(texts);
  }

  public getItemByIndex(index: number) {
    return this.itemVisible.nth(index);
  }
}
