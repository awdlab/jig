import type { Locator } from '@playwright/test';

export class JigButtonHarness {
  constructor(public locator: Locator) {}
}
