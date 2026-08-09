import type { Locator } from '@playwright/test';

export class AwdButtonHarness {
  constructor(public locator: Locator) {}
}
