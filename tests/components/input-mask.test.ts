import test from '@playwright/test';
import { NgnInputMaskHarness } from 'packages/playwright/src/components/input-mask';

test('base', async ({ page }) => {
  await page.goto('http://localhost:4200/docs/input-mask?story=base');

  const inputMask = new NgnInputMaskHarness(page.locator('ngn-input-mask').first());
  await inputMask.input.expectValue('');
  await inputMask.expectTextWithMask('HH:MM');

  await inputMask.input.press('1');
  await inputMask.input.expectValue('1');
  await inputMask.expectTextWithMask('1H:MM');

  await inputMask.input.press('2');
  await inputMask.input.expectValue('12');
  await inputMask.expectTextWithMask('12:MM');

  await inputMask.input.press('3');
  await inputMask.input.expectValue('12:3');
  await inputMask.expectTextWithMask('12:3M');

  await inputMask.input.press('Backspace');
  await inputMask.input.expectValue('12:');
  await inputMask.expectTextWithMask('12:MM');

  await inputMask.input.press('4');
  await inputMask.input.expectValue('12:4');
  await inputMask.expectTextWithMask('12:4M');

  await inputMask.input.press('ArrowLeft');
  await inputMask.input.press('Backspace');
  await inputMask.input.expectValue('12:4');
  await inputMask.expectTextWithMask('12:4M');
  await inputMask.input.press('Backspace');
  await inputMask.input.expectValue('10:4');
  await inputMask.expectTextWithMask('10:4M');

  await inputMask.input.press('1');
  await inputMask.input.expectValue('11:4');
  await inputMask.expectTextWithMask('11:4M');
  await inputMask.input.press('2');
  await inputMask.input.expectValue('11:2');
  await inputMask.expectTextWithMask('11:2M');
  await inputMask.input.press('3');
  await inputMask.input.expectValue('11:23');
  await inputMask.expectTextWithMask('11:23');

  await inputMask.input.press('Backspace');
  await inputMask.input.press('Backspace');
  await inputMask.input.press('Backspace');
  await inputMask.input.press('Backspace');
  await inputMask.input.press('Backspace');

  await inputMask.input.expectValue('');
  await inputMask.expectTextWithMask('HH:MM');

  await inputMask.input.pressSequentially('1234');
  await inputMask.input.expectValue('12:34');
  await inputMask.expectTextWithMask('12:34');
});
