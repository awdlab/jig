import { expect, type Locator } from '@playwright/test';
import { JigButtonHarness } from './button';

export class JigButtonGroupHarness {
  public readonly buttons: Locator;

  constructor(public locator: Locator) {
    this.buttons = locator.locator('button[ngnButton]');
  }

  public async expectItemCount(count: number) {
    await expect(this.buttons).toHaveCount(count);
  }

  public getButtonAt(index: number): JigButtonHarness {
    return new JigButtonHarness(this.buttons.nth(index));
  }
}
