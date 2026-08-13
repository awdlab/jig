import { kbdControlTemplate } from '@awdlab/jig-themes/templates/kbd';
import { expect, type Locator } from '@playwright/test';

import { themeClasses } from '../utils/theme.js';
import { JigHarness } from '../harness.js';

export class JigKbdHarness extends JigHarness {
  public readonly classes = themeClasses(kbdControlTemplate);
  public readonly key: Locator;

  constructor(hostLocator: Locator) {
    super(hostLocator);
    this.key = hostLocator.locator(this.classes.key);
  }

  public override async expectText(text: string) {
    await expect(this.key).toHaveText(text);
  }
}
