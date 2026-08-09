import { expect, type Locator } from '@playwright/test';
import { themeClasses } from '../utils/theme';
import { scrollerControlTemplate } from '@awdlab/jig-themes/templates/scroller';

export class AwdScrollerHarness {
  public readonly classes = themeClasses(scrollerControlTemplate);
  public readonly scrollarea: Locator;
  public readonly item: Locator;
  public readonly itemSticky: Locator;

  constructor(public locator: Locator) {
    this.scrollarea = locator;
    this.item = locator.locator(`> :not(${this.classes['item-sticky']})`);
    this.itemSticky = locator.locator(this.classes['item-sticky']);
  }

  public expectItemsCount(count: number): Promise<void> {
    return expect(this.item).toHaveCount(count);
  }

  public expectStickyItemsCount(count: number): Promise<void> {
    return expect(this.itemSticky).toHaveCount(count);
  }

  public expectItemsCountBetween(min: number, max: number): Promise<void> {
    return expect(async () => {
      const count = await this.item.count();
      if (count < min || count > max) {
        throw new Error(`Expected item count to be between ${min} and ${max}, but got ${count}`);
      }
    }).toPass();
  }

  public expectItemsTexts(texts: string[]): Promise<void> {
    return expect(this.item).toHaveText(texts);
  }

  public expectStickyItemsTexts(texts: string[]): Promise<void> {
    return expect(this.itemSticky).toHaveText(texts);
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

  public async scrollToIndex(index: number, itemHeight?: number): Promise<void> {
    if (!itemHeight) {
      await this.item.nth(index).scrollIntoViewIfNeeded();
      return;
    }
    const scrollAmount = index * itemHeight;
    await this.scrollarea.evaluate((el, amount) => {
      // The scroll port may be the scroller itself or an ancestor that owns the
      // overflow (list-box, tree, table).
      let port: Element | null = el;
      while (port && getComputedStyle(port).overflowY === 'visible') {
        port = port.parentElement;
      }
      (port ?? el).scrollTo({ top: amount });
    }, scrollAmount);
  }
}
