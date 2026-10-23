import { expect, type Locator } from '@playwright/test';
import { filterBuilderControlTemplate } from '@awdlab/jig-themes/templates/filter-builder';
import { themeClasses } from '../utils/theme.js';
import { JIG_CLASSES } from '../utils/classes.js';
import { JigInputHarness } from './input.js';
import { JigSelectHarness } from './select.js';
import { JigHarness } from '../harness.js';

export class JigFilterBuilderHarness extends JigHarness {
  public readonly classes = themeClasses(filterBuilderControlTemplate);

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

  /** The trigger's one-line rendering of the applied filter (`input` mode). */
  public summary(): Locator {
    return this.locator.locator(this.classes['summary']);
  }

  public row(index: number): Locator {
    return this.locator.locator(this.classes['row']).nth(index);
  }

  /** The select that picks the row's property. */
  public propertySelect(index: number): JigSelectHarness {
    return new JigSelectHarness(this.row(index).locator(this.classes['property']['root']));
  }

  public operatorSelect(index: number): JigSelectHarness {
    return new JigSelectHarness(this.row(index).locator(this.classes['operator']['root']));
  }

  /** Select inside row using the 'value' ptClass (e.g. boolean operator or list select). */
  public valueSelect(index: number): JigSelectHarness {
    return new JigSelectHarness(this.row(index).locator(this.classes['value']['root']));
  }

  public valueInput(index: number): JigInputHarness {
    return new JigInputHarness(
      this.row(index).locator(`${this.classes['value']['root']} ${JIG_CLASSES.input['root']}`)
    );
  }

  public removeButton(index: number): Locator {
    return this.row(index).locator(this.classes['remove-btn']['root']);
  }

  public addConditionButton(): Locator {
    return this.locator.locator('[data-testid="filter-builder-add-rule"]');
  }

  public matchModeDivider(): Locator {
    return this.locator.locator('[data-testid="filter-builder-match-mode"]');
  }

  public clearButton(): Locator {
    return this.locator.locator('[data-testid="filter-builder-clear"]');
  }

  public applyButton(): Locator {
    return this.locator.locator('[data-testid="filter-builder-apply"]');
  }

  public cancelButton(): Locator {
    return this.locator.locator('[data-testid="filter-builder-cancel"]');
  }
}
