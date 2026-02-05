import { expect, type Locator } from '@playwright/test';
import { themeClasses } from '../utils/theme';
import { menuControlTemplate } from '@ngneers/controls-themes/templates/menu';
import { NgnPopoverHarness } from './popover';

export class NgnMenuHarness {
  public readonly classes = themeClasses(menuControlTemplate);
  public readonly popover: NgnPopoverHarness;
  public readonly item: Locator;

  constructor(public locator: Locator) {
    this.popover = new NgnPopoverHarness(locator.locator(this.classes['popover']));
    this.item = locator.locator(this.classes['item']);
  }

  public async expectItemCount(count: number) {
    await expect(this.item).toHaveCount(count);
  }

  public async getItemByIndex(index: number) {
    return this.item.nth(index);
  }

  public async openChildMenuByIndex(index: number) {
    const item = this.item.nth(index);
    await item.click();
    return new NgnMenuHarness(item.locator('ngn-menu').first());
  }
}
