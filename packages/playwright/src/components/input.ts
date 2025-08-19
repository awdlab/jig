import { Locator, expect } from '@playwright/test';
import { themeClasses } from '../utils/theme';
import { inputControlTemplate } from '@ngneers/controls-themes/templates/input';

export class NgnInputHarness {
  public readonly classes = themeClasses(inputControlTemplate);

  public readonly locator: Locator;

  constructor(locator: Locator) {
    this.locator = locator;
  }

  public expectValue(value: string): Promise<void> {
    return expect(this.locator).toHaveValue(value);
  }
  public clear(): Promise<void> {
    return this.locator.clear();
  }

  public fill(value: string): Promise<void> {
    return this.locator.fill(value);
  }

  public pressSequentially(text: string): Promise<void> {
    return this.locator.pressSequentially(text, { delay: 5 });
  }

  public press(key: string): Promise<void> {
    return this.locator.press(key);
  }
}
