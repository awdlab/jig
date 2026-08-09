import { chromium } from '@playwright/test';

const [selector, out, scheme, width] = process.argv.slice(2);

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: Number(width), height: 900 },
  colorScheme: scheme as 'light' | 'dark',
  deviceScaleFactor: 1,
});
await page.goto('http://localhost:4200', { waitUntil: 'networkidle' });
const el = page.locator(selector!);
await el.scrollIntoViewIfNeeded();
await page.waitForTimeout(2500);
await el.screenshot({ path: out! });
await browser.close();
