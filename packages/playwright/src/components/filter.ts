import { expect, Locator } from '@playwright/test';
import { filterControlTemplate } from '@ngneers/controls-themes/templates/filter';
import { themeClasses } from '../utils/theme';
import { NGN_CLASSES } from '../utils/classes';
import { NgnInputHarness } from './input';
import { NgnSelectHarness } from './select';

export class NgnFilterHarness {
  public readonly classes = themeClasses(filterControlTemplate);

  public readonly trigger: Locator;
  public readonly popoverContent: Locator;

  constructor(public locator: Locator) {
    this.trigger = locator.locator(this.classes['input-field']);
    this.popoverContent = locator.locator(this.classes['popover-content']);
  }

  public async expectOpened(opened = true): Promise<void> {
    await expect(this.popoverContent).toBeVisible({ visible: opened });
  }

  public async open(): Promise<void> {
    await this.trigger.click();
    await this.expectOpened(true);
  }

  public row(index: number): Locator {
    return this.locator.locator(this.classes['row']).nth(index);
  }

  public operatorSelect(index: number): NgnSelectHarness {
    return new NgnSelectHarness(this.row(index).locator(this.classes['operator']));
  }

  public valueInput(index: number): NgnInputHarness {
    return new NgnInputHarness(
      this.row(index).locator(`${this.classes['value']} ${NGN_CLASSES.input['']}`)
    );
  }

  public removeButton(index: number): Locator {
    return this.row(index).locator(`${this.classes['row-actions']} button`);
  }

  public addConditionButton(): Locator {
    return this.locator.locator('[data-testid="filter-add-rule"]');
  }

  public matchModeSelect(): NgnSelectHarness {
    return new NgnSelectHarness(this.locator.locator('[data-testid="filter-match-mode"]'));
  }

  public clearButton(): Locator {
    return this.locator.locator('[data-testid="filter-clear"]');
  }
}
