import type { Locator } from '@playwright/test';
import { filterBarControlTemplate } from '@awdlab/jig-themes/templates/filter-bar';
import { themeClasses } from '../utils/theme.js';
import { JigBadgeHarness } from './badge.js';
import { JigChipHarness } from './chip.js';
import { JigFilterBuilderHarness } from './filter-builder.js';
import { JigInputHarness } from './input.js';
import { JigHarness } from '../harness.js';

export class JigFilterBarHarness extends JigHarness {
  public readonly classes = themeClasses(filterBarControlTemplate);

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

  public filterBuilder(): JigFilterBuilderHarness {
    return new JigFilterBuilderHarness(this.locator.locator(this.classes['filter']['root']));
  }
}
