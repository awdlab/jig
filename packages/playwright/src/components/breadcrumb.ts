import type { Locator } from '@playwright/test';
import { themeClasses } from '../utils/theme';
import { breadcrumbControlTemplate } from '@awdlab/jig-themes/templates/breadcrumb';
import { JigItemViewHarness } from './item-view';
import { JigMenuHarness } from './menu';

export class JigBreadcrumbHarness {
  public readonly classes = themeClasses(breadcrumbControlTemplate);

  public readonly itemView: JigItemViewHarness;
  public readonly overflowMenu: JigMenuHarness;

  constructor(public locator: Locator) {
    this.itemView = new JigItemViewHarness(this.locator.locator(this.classes['item-view']['root']));
    this.overflowMenu = new JigMenuHarness(this.locator.locator(this.classes['menu']['root']));
  }
}
