import { type Page, type Locator } from '@playwright/test';

export async function mouseDownOnElement(page: Page, element: Locator) {
  const box = await element.boundingBox();
  if (!box) {
    throw new Error('Element is not visible');
  }
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
}
