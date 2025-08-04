import { NgnPopoverHarness } from '@ngneers/controls-playwright';
import test from '@playwright/test';
import { NgnTextFieldHarness } from 'packages/playwright/src/components/text-field';

test('base', async ({ page }) => {
  await page.goto('http://localhost:4200/docs/text-field?story=base');

  const textField = new NgnTextFieldHarness(page.locator('ngn-text-field').first());
  await textField.expectValue('');
  await textField.fill('123');
  await textField.expectValue('123');
});

test('lazy', async ({ page }) => {
  await page.goto('http://localhost:4200/docs/text-field?story=mask');

  const textField = new NgnTextFieldHarness(page.locator('ngn-text-field').first());
  await textField.expectValue('');
  await textField.expectTextWithMask('HH:MM');

  await textField.press('1');
  await textField.expectValue('1');
  await textField.expectTextWithMask('1H:MM');

  await textField.press('2');
  await textField.expectValue('12');
  await textField.expectTextWithMask('12:MM');

  await textField.press('3');
  await textField.expectValue('12:3');
  await textField.expectTextWithMask('12:3M');

  await textField.press('Backspace');
  await textField.expectValue('12:');
  await textField.expectTextWithMask('12:MM');

  await textField.press('4');
  await textField.expectValue('12:4');
  await textField.expectTextWithMask('12:4M');

  await textField.press('ArrowLeft');
  await textField.press('Backspace');
  await textField.expectValue('12:4');
  await textField.expectTextWithMask('12:4M');
  await textField.press('Backspace');
  await textField.expectValue('10:4');
  await textField.expectTextWithMask('10:4M');

  await textField.press('1');
  await textField.expectValue('11:4');
  await textField.expectTextWithMask('11:4M');
  await textField.press('2');
  await textField.expectValue('11:2');
  await textField.expectTextWithMask('11:2M');
  await textField.press('3');
  await textField.expectValue('11:23');
  await textField.expectTextWithMask('11:23');

  await textField.press('Backspace');
  await textField.press('Backspace');
  await textField.press('Backspace');
  await textField.press('Backspace');
  await textField.press('Backspace');

  await textField.expectValue('');
  await textField.expectTextWithMask('HH:MM');

  await textField.pressSequentially('1234');
  await textField.expectValue('12:34');
  await textField.expectTextWithMask('12:34');
});
