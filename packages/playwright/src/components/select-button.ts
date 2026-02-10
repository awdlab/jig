import { type Locator, expect } from '@playwright/test';
import { themeClasses } from '../utils/theme';
import { selectButtonControlTemplate } from '@ngneers/controls-themes/templates/select-button';

export class NgnSelectButtonHarness {
  public readonly classes = themeClasses(selectButtonControlTemplate);

  public readonly locator: Locator;

  constructor(locator: Locator) {
    this.locator = locator;
  }

  // Placeholder methods - implementation pending
}
