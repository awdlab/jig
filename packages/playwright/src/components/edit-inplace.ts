import { type Locator, expect } from '@playwright/test';
import { themeClasses } from '../utils/theme';
import { editInplaceControlTemplate } from '@awdlab/jig-themes/templates/edit-inplace';
import { NgnInplaceHarness } from './inplace';

export class NgnEditInplaceHarness {
  public readonly classes = themeClasses(editInplaceControlTemplate);

  public readonly inplace: NgnInplaceHarness;
  public readonly input: Locator;
  public readonly closeButton: Locator;

  constructor(public locator: Locator) {
    this.inplace = new NgnInplaceHarness(this.locator.locator(this.classes['inplace']['root']));
    this.input = this.locator.locator(this.classes['default-edit-input']);
    this.closeButton = this.locator.locator(this.classes['default-edit-close-button']);
  }

  public async fillInput(value: string) {
    await this.input.fill(value);
  }

  public async expectInputValue(value: string) {
    await expect(this.input).toHaveValue(value);
  }

  public async clickCloseButton() {
    await this.closeButton.click();
  }

  public async pressEnter() {
    await this.input.press('Enter');
  }
}
