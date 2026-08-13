import { expect, type Locator } from '@playwright/test';
import { themeClasses } from '../utils/theme.js';
import { inputFieldControlTemplate } from '@awdlab/jig-themes/templates/input-field';
import { JigHarness } from '../harness.js';

export class JigInputFieldHarness<
  T extends Record<string, unknown> = Record<string, unknown>,
> extends JigHarness {
  public readonly classes = themeClasses(inputFieldControlTemplate);

  /** Harnesses for the controls projected into the field, as built by the factory. */
  public readonly children: T;

  public readonly label: Locator;
  public readonly requiredMarker: Locator;
  public readonly clearButton: Locator;

  constructor(locator: Locator, children?: (locator: Locator) => T) {
    super(locator);
    this.children = children?.(locator) ?? ({} as T);
    this.label = locator.locator(this.classes.label);
    this.requiredMarker = locator.locator(this.classes['required-marker']);
    this.clearButton = locator.locator(this.classes['clear-button']);
  }

  public expectLabel(text: string): Promise<void> {
    return expect(this.label).toHaveText(text);
  }

  public async clear(): Promise<void> {
    await this.clearButton.click();
  }

  /** The field mirrors the projected control's filled state onto its own root. */
  public async expectFilled(filled = true): Promise<void> {
    const asFilled = this.locator.and(this.page.locator(this.classes.filled));
    await expect(asFilled).toHaveCount(filled ? 1 : 0);
  }
}
