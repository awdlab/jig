import { Locator } from '@playwright/test';
import { themeClasses } from '../utils/theme';
import { breadcrumbControlTemplate } from '@ngneers/controls-themes/templates/breadcrumb';
import { NgnItemViewHarness } from './item-view';
import { NgnMenuHarness } from './menu';

export class NgnBreadcrumbHarness {
  public readonly classes = themeClasses(breadcrumbControlTemplate);

  public readonly itemView: NgnItemViewHarness;
  public readonly overflowMenu: NgnMenuHarness;

  constructor(public locator: Locator) {
    this.itemView = new NgnItemViewHarness(
      this.locator.locator(this.classes.$deps['item-view']['root'])
    );
    this.overflowMenu = new NgnMenuHarness(
      this.locator.locator(this.classes.$deps['menu']['root'])
    );
  }
}
