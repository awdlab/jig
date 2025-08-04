import { Locator, expect } from '@playwright/test';
import { NgnInputHarness } from './input';
import { NgnInputFieldHarness } from './input-field';

export class NgnInputMaskHarness {
  public readonly input: NgnInputHarness;
  public readonly inputField: NgnInputFieldHarness;
  public readonly mask: Locator;

  constructor(locator: Locator) {
    this.input = new NgnInputHarness(locator.locator('input[ngnInput]').first());
    this.inputField = new NgnInputFieldHarness(locator.locator('ngn-input-field').first());
    this.mask = this.inputField.locator.locator('.ngn-input-mask').first();
  }

  public expectTextWithMask(textWithMask: string): Promise<void> {
    return expect(this.mask).toHaveText(textWithMask, { useInnerText: true });
  }
}
