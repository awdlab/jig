import { expect, type Locator } from '@playwright/test';
import { themeClasses } from '../utils/theme.js';
import { toolbarControlTemplate } from '@awdlab/jig-themes/templates/toolbar';
import { toolbarRegionControlTemplate } from '@awdlab/jig-themes/templates/toolbar-region';
import { JigHarness } from '../harness.js';

export type ToolbarPlacement = 'start' | 'center' | 'end';

export class JigToolbarHarness extends JigHarness {
  public readonly classes = themeClasses(toolbarControlTemplate);
  public readonly regionClasses = themeClasses(toolbarRegionControlTemplate);
  public readonly item: Locator;
  public readonly itemVisible: Locator;
  public readonly itemOverflowing: Locator;
  public readonly overflowTrigger: Locator;

  constructor(locator: Locator) {
    super(locator);
    this.item = locator.locator(this.regionClasses['item']);
    this.itemVisible = locator.locator(
      `${this.regionClasses['item']}:not(${this.regionClasses['item-overflowing']})`
    );
    this.itemOverflowing = locator.locator(this.regionClasses['item-overflowing']);
    this.overflowTrigger = locator.locator(
      `${this.classes['overflow-trigger']}:not(${this.classes['overflow-trigger-hidden']})`
    );
  }

  /** Each placement owns a popover, so this is always scoped to one of them. */
  public popoverContentIn(placement: ToolbarPlacement): Locator {
    return this.placement(placement).locator(this.classes['popover-content']);
  }

  public placement(placement: ToolbarPlacement): Locator {
    return this.locator.locator(this.classes[`placement-${placement}`]);
  }

  /** Items of one placement that are visible in the bar (not collapsed). */
  public visibleItemsIn(placement: ToolbarPlacement): Locator {
    return this.placement(placement).locator(
      `${this.regionClasses['item']}:not(${this.regionClasses['item-overflowing']})`
    );
  }

  public overflowingItemsIn(placement: ToolbarPlacement): Locator {
    return this.placement(placement).locator(this.regionClasses['item-overflowing']);
  }

  public triggerIn(placement: ToolbarPlacement): Locator {
    return this.placement(placement).locator(this.classes['overflow-trigger']);
  }

  public async openOverflow(placement: ToolbarPlacement) {
    await this.triggerIn(placement).locator(this.classes['overflow-button']).click();
  }

  public async expectVisibleTexts(placement: ToolbarPlacement, texts: string[]) {
    await expect(this.visibleItemsIn(placement)).toHaveText(texts);
  }

  public async expectOverflowingTexts(placement: ToolbarPlacement, texts: string[]) {
    await expect(this.overflowingItemsIn(placement)).toHaveText(texts);
  }

  public async expectTriggerVisible(placement: ToolbarPlacement, visible: boolean) {
    const trigger = this.triggerIn(placement);
    if (visible) {
      await expect(trigger).not.toHaveClass(
        new RegExp(this.classes['overflow-trigger-hidden'].replace('.', ''))
      );
    } else {
      await expect(trigger).toHaveClass(
        new RegExp(this.classes['overflow-trigger-hidden'].replace('.', ''))
      );
    }
  }
}
