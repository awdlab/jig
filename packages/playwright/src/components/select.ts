import { expect, Locator } from '@playwright/test';
import { themeClasses } from '../utils/theme';
import { selectControlTemplate } from '@ngneers/controls-themes/templates/select';
import { NgnInputHarness } from './input';
import { NGN_CLASSES } from '../utils/classes';

export class NgnSelectHarness {
  public readonly classes = themeClasses(selectControlTemplate);
  public readonly editableInput: NgnInputHarness;

  constructor(public locator: Locator) {
    this.editableInput = new NgnInputHarness(
      locator.locator(`${this.classes['input-editable']} ${NGN_CLASSES.input['']}`)
    );
  }
}
