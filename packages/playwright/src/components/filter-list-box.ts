import type { Locator } from '@playwright/test';
import { filterListBoxControlTemplate } from '@awdlab/jig-themes/templates/filter-list-box';
import { themeClasses } from '../utils/theme.js';
import { JigAttributeFilterHarness } from './attribute-filter.js';
import { JigBadgeHarness } from './badge.js';
import { JigChipHarness } from './chip.js';
import { JigInputHarness } from './input.js';
import { JigListBoxHarness } from './list-box.js';
import { JigHarness } from '../harness.js';

export class JigFilterListBoxHarness extends JigHarness {
  public readonly classes = themeClasses(filterListBoxControlTemplate);

  public searchInput(): JigInputHarness {
    return new JigInputHarness(this.locator.locator(this.classes['search-input']['root']));
  }

  public filterTrigger(): Locator {
    return this.locator.locator(this.classes['filter-trigger']['root']);
  }

  /** The count badge wrapping the filter trigger. */
  public badge(): Locator {
    return new JigBadgeHarness(this.locator).badge;
  }

  public chips(): Locator {
    return this.locator.locator(this.classes['chip']['root']);
  }

  public chip(index: number): JigChipHarness {
    return new JigChipHarness(this.chips().nth(index));
  }

  public removeChip(index: number): Promise<void> {
    return this.chip(index).close();
  }

  /** The "clear all filters" action of the built-in empty state. */
  public clearAllButton(): Locator {
    return this.locator.locator(this.classes['clear-all-button']['root']);
  }

  public attributeFilter(): JigAttributeFilterHarness {
    return new JigAttributeFilterHarness(this.locator.locator(this.classes['filter']['root']));
  }

  public listBox(): JigListBoxHarness {
    return new JigListBoxHarness(this.locator.locator(this.classes['list-box']['root']));
  }
}
