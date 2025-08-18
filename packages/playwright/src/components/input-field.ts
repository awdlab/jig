import { Locator } from '@playwright/test';
import { themeClasses } from '../utils/theme';
import { inputFieldControlTemplate } from '@ngneers/controls-themes/templates/input-field';

export class NgnInputFieldHarness {
  public readonly classes = themeClasses(inputFieldControlTemplate);

  constructor(public locator: Locator) {}
}
