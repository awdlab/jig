import { expect, type Locator } from '@playwright/test';
import { themeClasses } from '../utils/theme';
import { listBoxControlTemplate } from '@ngneers/controls-themes/templates/list-box';
import { NgnScrollerHarness } from './scroller';

export class NgnListBoxHarness {
  public readonly classes = themeClasses(listBoxControlTemplate);
  public readonly group: Locator;
  public readonly item: Locator;
  public readonly itemHighlighted: Locator;
  public readonly itemSelected: Locator;
  public readonly scroller: NgnScrollerHarness;

  constructor(public locator: Locator) {
    this.group = locator.locator(this.classes['group']);
    this.item = locator.locator(this.classes['item']);
    this.itemHighlighted = locator.locator(this.classes['item-highlighted']);
    this.itemSelected = locator.locator(this.classes['item-selected']);
    this.scroller = new NgnScrollerHarness(locator.locator(`${this.classes['scroller']}`));
  }

  public expectItemsCount(count: number) {
    return expect(this.item).toHaveCount(count);
  }
}
