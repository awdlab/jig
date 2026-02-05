import {
  expect,
  type Locator,
  type Page,
  type PageAssertionsToHaveScreenshotOptions,
  type TestInfo,
} from '@playwright/test';

export function expectScreenshot(
  toScreenshot: Page | Locator,
  testInfo: TestInfo,
  name?: string,
  options?: PageAssertionsToHaveScreenshotOptions
) {
  testInfo.snapshotSuffix = '';
  const fullName = `${testInfo.title}${name ? '-' + name : ''}.png`;
  return expect(toScreenshot).toHaveScreenshot(fullName, {
    fullPage: 'addInitScript' in toScreenshot,
    ...options,
  });
}
