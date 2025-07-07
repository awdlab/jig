import { Locator, expect } from '@playwright/test';
import { NgnInputFieldHarness } from './input-field';

export class NgnTextFieldHarness {
  public readonly inputField: NgnInputFieldHarness;
  public readonly input: Locator;
  public readonly mask: Locator;

  constructor(locator: Locator) {
    this.inputField = new NgnInputFieldHarness(locator.locator('ngn-input-field').first());
    this.input = this.inputField.locator.locator('.ngn-text-field-input').first();
    this.mask = this.inputField.locator.locator('.ngn-text-field-mask').first();
  }

  public expectValue(value: string): Promise<void> {
    return expect(this.input).toHaveValue(value);
  }

  public expectTextWithMask(textWithMask: string): Promise<void> {
    return expect(this.mask).toHaveText(textWithMask, { useInnerText: true });
  }

  public clear(): Promise<void> {
    return this.input.clear();
  }

  public fill(value: string): Promise<void> {
    return this.input.fill(value);
  }

  public pressSequentially(text: string): Promise<void> {
    return this.input.pressSequentially(text);
  }

  public press(key: string): Promise<void> {
    return this.input.press(key);
  }
}
