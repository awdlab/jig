import { kbdControlTemplate } from '@awdlab/jig-themes/templates/kbd';
import { expect, type Locator } from '@playwright/test';

import { themeClasses } from '../utils/theme';

export class NgnKbdHarness {
  public readonly classes = themeClasses(kbdControlTemplate);
  public readonly locator: Locator;
  public readonly key: Locator;

  constructor(hostLocator: Locator) {
    this.locator = hostLocator;
    this.key = hostLocator.locator(this.classes.key);
  }

  public async expectText(text: string) {
    await expect(this.key).toHaveText(text);
  }
}
