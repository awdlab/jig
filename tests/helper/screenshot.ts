import { expect, Page, TestInfo } from '@playwright/test';

export function expectScreenshot(page: Page, testInfo: TestInfo, name?: string) {
  const fullName = `${testInfo.title}${name ? '-' + name : ''}.png`;
  return expect(page).toHaveScreenshot(fullName, { fullPage: true });
}
