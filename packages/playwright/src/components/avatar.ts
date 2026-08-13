import { expect } from '@playwright/test';
import { themeClasses } from '../utils/theme.js';
import { avatarControlTemplate } from '@awdlab/jig-themes/templates/avatar';
import { JigHarness } from '../harness.js';

export class JigAvatarHarness extends JigHarness {
  public readonly classes = themeClasses(avatarControlTemplate);

  public expectInitials(expected: string) {
    return expect(this.locator.locator(this.classes.initials)).toHaveText(expected);
  }

  public expectImageSrc(expected: string) {
    return expect(this.locator.locator(this.classes.image)).toHaveAttribute('src', expected);
  }
}
