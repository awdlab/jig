import { expect, type Locator } from '@playwright/test';
import { themeClasses } from '../utils/theme';
import { listBoxControlTemplate } from '@awdlab/jig-themes/templates/list-box';
import { JigScrollerHarness } from './scroller';

export class JigListBoxHarness {
  public readonly classes = themeClasses(listBoxControlTemplate);
  public readonly group: Locator;
  public readonly item: Locator;
  public readonly itemHighlighted: Locator;
  public readonly itemSelected: Locator;
  public readonly scroller: JigScrollerHarness;

  constructor(public locator: Locator) {
    this.group = locator.locator(this.classes['group']);
    this.item = locator.locator(this.classes['item']);
    this.itemHighlighted = locator.locator(this.classes['item-highlighted']);
    this.itemSelected = locator.locator(this.classes['item-selected']);
    this.scroller = new JigScrollerHarness(locator.locator(this.classes['scroller']['root']));
  }

  public expectItemsCount(count: number) {
    return expect(this.item).toHaveCount(count);
  }
}
