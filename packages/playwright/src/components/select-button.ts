import { type Locator, expect } from '@playwright/test';
import { themeClasses } from '../utils/theme.js';
import { selectButtonControlTemplate } from '@awdlab/jig-themes/templates/select-button';
import { JigToggleButtonHarness } from './toggle-button.js';
import { JigHarness } from '../harness.js';

export class JigSelectButtonHarness extends JigHarness {
  public readonly classes = themeClasses(selectButtonControlTemplate);

  public readonly buttons: Locator;

  constructor(locator: Locator) {
    super(locator);
    this.buttons = locator.locator('jig-toggle-button');
  }

  public getButtonByIndex(index: number): JigToggleButtonHarness {
    return new JigToggleButtonHarness(this.buttons.nth(index));
  }

  public getButtonByTestId(testId: string): JigToggleButtonHarness {
    return new JigToggleButtonHarness(
      this.locator.locator(`jig-toggle-button[data-testid="${testId}"]`)
    );
  }

  public async clickButtonByIndex(index: number, force = false) {
    await this.getButtonByIndex(index).click({ force });
  }

  public async expectButtonCount(count: number) {
    await expect(this.buttons).toHaveCount(count);
  }

  public async expectSelected(index: number) {
    await this.getButtonByIndex(index).expectActive(true);
  }

  public async expectNoneSelected() {
    const count = await this.buttons.count();
    for (let i = 0; i < count; i++) {
      await this.getButtonByIndex(i).expectActive(false);
    }
  }

  public override async expectDisabled(disabled: boolean) {
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
