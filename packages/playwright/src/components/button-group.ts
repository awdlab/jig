import { expect, type Locator } from '@playwright/test';
import { JigButtonHarness } from './button.js';
import { JigHarness } from '../harness.js';

export class JigButtonGroupHarness extends JigHarness {
  public readonly buttons: Locator;

  constructor(locator: Locator) {
    super(locator);
    this.buttons = locator.locator('button[jigButton]');
  }

  public async expectItemCount(count: number) {
    await expect(this.buttons).toHaveCount(count);
  }

  public getButtonAt(index: number): JigButtonHarness {
    return new JigButtonHarness(this.buttons.nth(index));
  }
}
