import { expect, type Locator } from '@playwright/test';
import { themeClasses } from '../utils/theme';
import { menuControlTemplate } from '@awdlab/jig-themes/templates/menu';
import { JigPopoverHarness } from './popover';

export class JigMenuHarness {
  public readonly classes = themeClasses(menuControlTemplate);
  public readonly popover: JigPopoverHarness;
  public readonly item: Locator;

  constructor(public locator: Locator) {
    this.popover = new JigPopoverHarness(locator.locator(this.classes['popover']['root']));
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
    return new JigMenuHarness(item.locator('jig-menu').first());
  }
}
