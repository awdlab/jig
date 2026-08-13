import type { Locator } from '@playwright/test';
import { themeClasses } from '../utils/theme.js';
import { breadcrumbControlTemplate } from '@awdlab/jig-themes/templates/breadcrumb';
import { JigItemViewHarness } from './item-view.js';
import { JigMenuHarness } from './menu.js';
import { JigHarness } from '../harness.js';

export class JigBreadcrumbHarness extends JigHarness {
  public readonly classes = themeClasses(breadcrumbControlTemplate);

  public readonly itemView: JigItemViewHarness;
  public readonly overflowMenu: JigMenuHarness;

  constructor(locator: Locator) {
    super(locator);
    this.itemView = new JigItemViewHarness(this.locator.locator(this.classes['item-view']['root']));
    this.overflowMenu = new JigMenuHarness(this.locator.locator(this.classes['menu']['root']));
  }
}
