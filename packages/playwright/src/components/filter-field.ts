import { expect, type Locator } from '@playwright/test';
import { filterFieldControlTemplate } from '@awdlab/jig-themes/templates/filter-field';
import { themeClasses } from '../utils/theme.js';
import { JIG_CLASSES } from '../utils/classes.js';
import { JigInputHarness } from './input.js';
import { JigSelectHarness } from './select.js';
import { JigHarness } from '../harness.js';

export class JigFilterFieldHarness extends JigHarness {
  public readonly classes = themeClasses(filterFieldControlTemplate);

  public readonly trigger: Locator;
  public readonly popoverContent: Locator;

  constructor(locator: Locator) {
    super(locator);
    this.trigger = locator.locator(this.classes['input-field']['root']);
    this.popoverContent = locator.locator(this.classes['popover-content']);
  }

  public async expectOpened(opened = true): Promise<void> {
    await expect(this.popoverContent).toBeVisible({ visible: opened });
  }

  public async open(): Promise<void> {
    await this.trigger.click();
    await this.expectOpened(true);
  }

  public getRowByIndex(index: number): Locator {
    return this.locator.locator(this.classes['row']).nth(index);
  }

  public getOperatorSelectByIndex(index: number): JigSelectHarness {
    return new JigSelectHarness(
      this.getRowByIndex(index).locator(this.classes['operator']['root'])
    );
  }

  /** Select inside row using the 'value' ptClass (e.g. boolean operator or list select). */
  public getValueSelectByIndex(index: number): JigSelectHarness {
    return new JigSelectHarness(this.getRowByIndex(index).locator(this.classes['value']['root']));
  }

  public getValueInputByIndex(index: number): JigInputHarness {
    return new JigInputHarness(
      this.getRowByIndex(index).locator(
        `${this.classes['value']['root']} ${JIG_CLASSES.input['root']}`
      )
    );
  }

  public getRemoveButtonByIndex(index: number): Locator {
    return this.getRowByIndex(index).locator(this.classes['remove-btn']['root']);
  }

  public addConditionButton(): Locator {
    return this.locator.locator('[data-testid="filter-add-rule"]');
  }

  public matchModeDivider(): Locator {
    return this.locator.locator('[data-testid="filter-match-mode"]');
  }

  public clearButton(): Locator {
    return this.locator.locator('[data-testid="filter-clear"]');
  }

  public applyButton(): Locator {
    return this.locator.locator('[data-testid="filter-apply"]');
  }

  public cancelButton(): Locator {
    return this.locator.locator('[data-testid="filter-cancel"]');
  }
}
