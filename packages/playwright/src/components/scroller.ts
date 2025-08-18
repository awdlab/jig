import { expect, Locator } from '@playwright/test';
import { themeClasses } from '../utils/theme';
import { scrollerControlTemplate } from '@ngneers/controls-themes/templates/scroller';

export class NgnScrollerHarness {
  public readonly classes = themeClasses(scrollerControlTemplate);
  public readonly scrollarea: Locator;
  public readonly item: Locator;
  public readonly itemSticky: Locator;

  constructor(public locator: Locator) {
    this.scrollarea = locator.locator(this.classes['scrollarea']);
    this.item = locator.locator(this.classes['item']);
    this.itemSticky = locator.locator(this.classes['item-sticky']);
  }

  public expectItemsCount(count: number): Promise<void> {
    return expect(this.item).toHaveCount(count);
  }

  public expectItemsTexts(texts: string[]): Promise<void> {
    return expect(this.item).toHaveText(texts);
  }

  public clickItemByIndex(index: number): Promise<void> {
    return this.item.nth(index).click();
  }

  public clickItemByText(text: string): Promise<void> {
    return this.item.filter({ hasText: new RegExp(`^\\s*${text}\\s*$`, 'i') }).click();
  }

  public getItemByIndex(index: number): Locator {
    return this.item.nth(index);
  }

  public getItemByText(text: string): Locator {
    return this.item.filter({ hasText: new RegExp(`^\\s*${text}\\s*$`, 'i') });
  }
}
