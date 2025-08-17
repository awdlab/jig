import { expect, Page } from '@playwright/test';

export function expectScreenshot(page: Page) {
  return expect(page).toHaveScreenshot({ fullPage: true });
}
