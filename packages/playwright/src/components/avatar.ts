import { Locator, expect } from '@playwright/test';

export class NgnAvatarHarness {
  constructor(public locator: Locator) {}

  public expectInitials(expected: string) {
    return expect(this.locator.locator('.ngn-avatar-initials')).toHaveText(expected);
  }

  public expectImageSrc(expected: string) {
    return expect(this.locator.locator('.ngn-avatar-image')).toHaveAttribute('src', expected);
  }
}
