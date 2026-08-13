import test, { expect } from '@playwright/test';
import { JigInputHarness } from '@awdlab/jig-playwright';
import { loadComponent } from '../helper/load-component';
import { useRtl } from '../helper/direction';
import { expectScreenshot } from '../helper/screenshot';
import { expectNoA11yViolations } from '../helper/axe';

test('base', async ({ page }, testInfo) => {
  const handle = await loadComponent(page, {
    template: `
      <jig-input-field>
        <input jigInput />
      </jig-input-field>
    `,
    imports: ['input', 'inputField'],
  });
  const textField = new JigInputHarness(page.locator('input[jigInput]').first());
  await textField.expectValue('');
  await textField.fill('123');
  await textField.expectValue('123');
  await expectScreenshot(page, testInfo);
});

test('field padding belongs to the input', async ({ page }) => {
  await loadComponent(page, {
    template: `
      <jig-input-field showClearButton>
        <input jigInput value="Hello world" />
      </jig-input-field>
    `,
    imports: ['input', 'inputField'],
  });

  const input = page.locator('input[jigInput]').first();
  const box = (await page.locator('jig-input-field > div').first().boundingBox())!;
  const midY = box.y + box.height / 2;
  const caret = () => input.evaluate((el: HTMLInputElement) => el.selectionStart);

  // Clicking the padding places the caret at the nearest text position instead of
  // focusing with whatever selection the browser happens to restore.
  await page.mouse.click(box.x + 3, midY);
  expect(await input.evaluate(el => document.activeElement === el)).toBe(true);
  expect(await caret()).toBe(0);

  await page.mouse.click(box.x + box.width - 60, midY);
  expect(await caret()).toBe(11);

  // Vertical padding follows the browser's line-relative hit testing:
  // above the text line -> start, below it -> end.
  await page.mouse.click(box.x + box.width - 60, box.y + 2);
  expect(await caret()).toBe(0);
  await page.mouse.click(box.x + 60, box.y + box.height - 2);
  expect(await caret()).toBe(11);

  // Selection drags start in the padding, natively.
  await page.mouse.move(box.x + 3, midY);
  await page.mouse.down();
  await page.mouse.move(box.x + 45, midY, { steps: 5 });
  await page.mouse.up();
  const [start, end] = await input.evaluate((el: HTMLInputElement) => [
    el.selectionStart,
    el.selectionEnd,
  ]);
  expect(start).toBe(0);
  expect(end).toBeGreaterThan(0);
});

test('accessibility (axe)', async ({ page }) => {
  // input-field label provides the accessible name (wired to the input's id).
  await loadComponent(page, {
    template: `
      <jig-input-field label="Full name">
        <input jigInput />
      </jig-input-field>
    `,
    imports: ['input', 'inputField'],
  });
  await expectNoA11yViolations(page);
});

test('rtl', async ({ page }, testInfo) => {
  await useRtl(page);
  await loadComponent(page, {
    template: `
      <jig-input-field>
        <input jigInput />
      </jig-input-field>
    `,
    imports: ['input', 'inputField'],
  });
  await expectScreenshot(page, testInfo);
});
