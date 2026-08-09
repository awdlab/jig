import { expect, type Locator } from '@playwright/test';
import { AwdButtonHarness } from './button';

export class AwdButtonGroupHarness {
  public readonly buttons: Locator;

  constructor(public locator: Locator) {
    this.buttons = locator.locator('button[ngnButton]');
  }

  public async expectItemCount(count: number) {
    await expect(this.buttons).toHaveCount(count);
  }

  public getButtonAt(index: number): AwdButtonHarness {
    return new AwdButtonHarness(this.buttons.nth(index));
  }
}
