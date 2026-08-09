import { expect, type Locator } from '@playwright/test';
import { NgnButtonHarness } from './button';

export class NgnButtonGroupHarness {
  public readonly buttons: Locator;

  constructor(public locator: Locator) {
    this.buttons = locator.locator('button[ngnButton]');
  }

  public async expectItemCount(count: number) {
    await expect(this.buttons).toHaveCount(count);
  }

  public getButtonAt(index: number): NgnButtonHarness {
    return new NgnButtonHarness(this.buttons.nth(index));
  }
}
