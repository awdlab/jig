import { type Locator, expect } from '@playwright/test';
import { NgnInputHarness } from './input';
import { NgnInputFieldHarness } from './input-field';
import { themeClasses } from '../utils/theme';
import { inputMaskControlTemplate } from '@ngneers/controls-themes/templates/input-mask';

export class NgnInputMaskHarness {
  public readonly classes = themeClasses(inputMaskControlTemplate);

  public readonly input: NgnInputHarness;
  public readonly mask: Locator;

  constructor(locator: Locator) {
    this.input = new NgnInputHarness(locator.locator('input[ngnInput]').first());
    this.mask = locator.locator(this.classes.mask).first();
  }

  public async clear(): Promise<void> {
    await this.input.locator.press('Control+a');
    await this.input.locator.press('Delete');
  }

  public expectTextWithMask(textWithMask: string): Promise<void> {
    return expect(this.mask).toHaveText(textWithMask, { useInnerText: true });
  }
}
