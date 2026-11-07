import { expect, type Locator } from '@playwright/test';
import { themeClasses } from '../utils/theme.js';
import { menuControlTemplate } from '@awdlab/jig-themes/templates/menu';
import { JigPopoverHarness } from './popover.js';
import { JigHarness } from '../harness.js';

export class JigMenuHarness extends JigHarness {
  public readonly classes = themeClasses(menuControlTemplate);
  public readonly popover: JigPopoverHarness;
  /** The `role="menu"` list of this menu (not of its submenus). */
  public readonly menu: Locator;
  public readonly item: Locator;

  constructor(locator: Locator) {
    super(locator);
    this.popover = new JigPopoverHarness(locator.locator(this.classes['popover']['root']));
    this.menu = locator.locator(this.classes.root).first();
    this.item = locator.locator(this.classes['item']);
  }

  /** A popover menu renders its list lazily, so a closed one has none. */
  public async expectOpened(opened = true) {
    if (opened) {
      await expect(this.menu).toBeVisible();
    } else {
      await expect(this.menu).toHaveCount(0);
    }
  }

  public async expectItemCount(count: number) {
    await expect(this.item).toHaveCount(count);
  }

  public getItemByIndex(index: number): Locator {
    return this.item.nth(index);
  }

  /** A menu item of this menu or one of its open submenus, by accessible name. */
  public getItemByLabel(label: string): Locator {
    return this.locator.getByRole('menuitem', { name: label });
  }

  public async openChildMenuByIndex(index: number) {
    const item = this.item.nth(index);
    await item.click();
    return new JigMenuHarness(item.locator('xpath=following-sibling::jig-menu[1]'));
  }
}
