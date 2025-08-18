import { Locator, expect } from '@playwright/test';
import { themeClasses } from '../utils/theme';
import { avatarControlTemplate } from '@ngneers/controls-themes/templates/avatar';

export class NgnAvatarHarness {
  public readonly classes = themeClasses(avatarControlTemplate);

  constructor(public locator: Locator) {}

  public expectInitials(expected: string) {
    return expect(this.locator.locator(this.classes.initials)).toHaveText(expected);
  }

  public expectImageSrc(expected: string) {
    return expect(this.locator.locator(this.classes.image)).toHaveAttribute('src', expected);
  }
}
