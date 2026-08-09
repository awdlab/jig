import { chromium } from '@playwright/test';

const [selector, out, scheme, width, scrollTo, clickText] = process.argv.slice(2);

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: Number(width), height: 900 },
  colorScheme: scheme as 'light' | 'dark',
  deviceScaleFactor: 1,
});
await page.goto('http://localhost:4200', { waitUntil: 'networkidle' });
if (scrollTo) {
  await page.locator(scrollTo).scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
}
if (clickText) {
  await page.getByText(clickText, { exact: true }).first().click();
  await page.waitForTimeout(1500);
}
const el = page.locator(selector!);
await el.scrollIntoViewIfNeeded();
await page.waitForTimeout(2500);
await el.screenshot({ path: out! });
await browser.close();
