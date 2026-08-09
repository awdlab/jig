import { type Locator, expect } from '@playwright/test';
import { themeClasses } from '../utils/theme';
import { selectButtonControlTemplate } from '@awdlab/jig-themes/templates/select-button';
import { NgnToggleButtonHarness } from './toggle-button';

export class NgnSelectButtonHarness {
  public readonly classes = themeClasses(selectButtonControlTemplate);

  public readonly locator: Locator;
  public readonly buttons: Locator;

  constructor(locator: Locator) {
    this.locator = locator;
    this.buttons = locator.locator('awd-toggle-button');
  }

  public getButtonAt(index: number): NgnToggleButtonHarness {
    return new NgnToggleButtonHarness(this.buttons.nth(index));
  }

  public getButtonByTestId(testId: string): NgnToggleButtonHarness {
    return new NgnToggleButtonHarness(
      this.locator.locator(`awd-toggle-button[data-testid="${testId}"]`)
    );
  }

  public async clickButtonAt(index: number, force = false) {
    await this.getButtonAt(index).click(force);
  }

  public async expectButtonCount(count: number) {
    await expect(this.buttons).toHaveCount(count);
  }

  public async expectSelectedAt(index: number) {
    await this.getButtonAt(index).expectActive(true);
  }

  public async expectNoneSelected() {
    const count = await this.buttons.count();
    for (let i = 0; i < count; i++) {
      await this.getButtonAt(i).expectActive(false);
    }
  }

  public async expectDisabled(disabled: boolean) {
    const innerButtons = this.locator.locator('button');
    const count = await innerButtons.count();
    for (let i = 0; i < count; i++) {
      if (disabled) {
        await expect(innerButtons.nth(i)).toBeDisabled();
      } else {
        await expect(innerButtons.nth(i)).not.toBeDisabled();
      }
    }
  }
}
