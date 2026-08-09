import type { Locator } from '@playwright/test';
import { themeClasses } from '../utils/theme';
import { breadcrumbControlTemplate } from '@awdlab/jig-themes/templates/breadcrumb';
import { JigItemViewHarness } from './item-view';
import { AwdMenuHarness } from './menu';

export class AwdBreadcrumbHarness {
  public readonly classes = themeClasses(breadcrumbControlTemplate);

  public readonly itemView: JigItemViewHarness;
  public readonly overflowMenu: AwdMenuHarness;

  constructor(public locator: Locator) {
    this.itemView = new JigItemViewHarness(this.locator.locator(this.classes['item-view']['root']));
    this.overflowMenu = new AwdMenuHarness(this.locator.locator(this.classes['menu']['root']));
  }
}
