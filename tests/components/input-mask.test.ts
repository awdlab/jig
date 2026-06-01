import test, { expect } from '@playwright/test';
import { NgnInputMaskHarness } from '@ngneers/controls-playwright';
import { loadComponent } from '../helper/load-component';
import { expectScreenshot } from '../helper/screenshot';

test('base', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      imports: ['input', 'inputMask', 'inputField'],
      template: `<ngn-input-field>
        <ngn-input-mask [mask]="inputs().mask">
          <input ngnInput>
        </ngn-input-mask>
      </ngn-input-field>`,
    },
    {
      inputs: {
        mask: 'time',
      },
    }
  );

  const inputMask = new NgnInputMaskHarness(page.locator('ngn-input-mask').first());
  await inputMask.input.expectValue('');
  await inputMask.expectTextWithMask('HH:MM:SS');
  await expectScreenshot(page, testInfo, 'initial-state');

  await inputMask.input.press('1');
  await inputMask.input.expectValue('1');
  await inputMask.expectTextWithMask('1H:MM:SS');

  await inputMask.input.press('2');
  await inputMask.input.expectValue('12');
  await inputMask.expectTextWithMask('12:MM:SS');

  await inputMask.input.press('3');
  await inputMask.input.expectValue('12:3');
  await inputMask.expectTextWithMask('12:3M:SS');

  await inputMask.input.press('Backspace');
  await inputMask.input.expectValue('12:');
  await inputMask.expectTextWithMask('12:MM:SS');
  await expectScreenshot(page, testInfo, 'half');

  await inputMask.input.press('4');
  await inputMask.input.expectValue('12:4');
  await inputMask.expectTextWithMask('12:4M:SS');

  await page.waitForTimeout(50);
  await inputMask.input.press('ArrowLeft');
  await inputMask.input.press('Backspace');
  await page.waitForTimeout(50);
  await inputMask.input.expectValue('12:4');
  await inputMask.expectTextWithMask('12:4M:SS');
  await page.waitForTimeout(50);
  await inputMask.input.press('Backspace');
  await inputMask.input.expectValue('10:4');
  await inputMask.expectTextWithMask('10:4M:SS');

  await inputMask.input.press('1');
  await inputMask.input.expectValue('11:4');
  await inputMask.expectTextWithMask('11:4M:SS');
  await inputMask.input.press('2');
  await inputMask.input.expectValue('11:2');
  await inputMask.expectTextWithMask('11:2M:SS');
  await inputMask.input.press('3');
  await inputMask.input.expectValue('11:23');
  await inputMask.expectTextWithMask('11:23:SS');

  await inputMask.input.press('Backspace');
  await inputMask.input.press('Backspace');
  await inputMask.input.press('Backspace');
  await inputMask.input.press('Backspace');
  await inputMask.input.press('Backspace');

  await inputMask.input.expectValue('');
  await inputMask.expectTextWithMask('HH:MM:SS');

  await inputMask.input.pressSequentially('123456');
  await inputMask.input.expectValue('12:34:56');
  await inputMask.expectTextWithMask('12:34:56');
  await expectScreenshot(page, testInfo, 'end');
});

test('time mask with segment validation', async ({ page }) => {
  await loadComponent(
    page,
    {
      imports: ['input', 'inputMask', 'inputField'],
      template: `<ngn-input-field>
        <ngn-input-mask [mask]="inputs().mask">
          <input ngnInput>
        </ngn-input-mask>
      </ngn-input-field>`,
    },
    {
      inputs: {
        mask: 'time',
      },
    }
  );

  const inputMask = new NgnInputMaskHarness(page.locator('ngn-input-mask').first());
  await inputMask.input.expectValue('');
  await inputMask.expectTextWithMask('HH:MM:SS');

  // Type valid hour digits 1, 2
  await inputMask.input.press('1');
  await inputMask.input.expectValue('1');

  await inputMask.input.press('2');
  await inputMask.input.expectValue('12');

  // Cursor auto-advances past separator; type valid minute digits 3, 0
  await inputMask.input.press('3');
  await inputMask.input.expectValue('12:3');

  await inputMask.input.press('0');
  await inputMask.input.expectValue('12:30');

  // Type seconds
  await inputMask.input.press('4');
  await inputMask.input.expectValue('12:30:4');

  await inputMask.input.press('5');
  await inputMask.input.expectValue('12:30:45');
  await inputMask.expectTextWithMask('12:30:45');
});

test('number segment auto-complete on unambiguous digit', async ({ page }) => {
  await loadComponent(
    page,
    {
      imports: ['input', 'inputMask', 'inputField'],
      template: `<ngn-input-field>
        <ngn-input-mask [mask]="inputs().mask">
          <input ngnInput>
        </ngn-input-mask>
      </ngn-input-field>`,
    },
    {
      inputs: {
        mask: 'time12',
      },
    }
  );

  const inputMask = new NgnInputMaskHarness(page.locator('ngn-input-mask').first());
  await inputMask.input.expectValue('');

  // Type '3' → 30-39 all exceed max 12, so left-pad to '03' which is valid → auto-completes to '03'
  await inputMask.input.press('3');
  await inputMask.input.expectValue('03');
});

test('number segment rejects digits exceeding max', async ({ page }) => {
  await loadComponent(
    page,
    {
      imports: ['input', 'inputMask', 'inputField'],
      template: `<ngn-input-field>
        <ngn-input-mask [mask]="inputs().mask">
          <input ngnInput>
        </ngn-input-mask>
      </ngn-input-field>`,
    },
    {
      inputs: {
        mask: 'time12',
      },
    }
  );

  const inputMask = new NgnInputMaskHarness(page.locator('ngn-input-mask').first());
  await inputMask.input.expectValue('');

  // Type '1' → valid first digit (10-12 are in range 1-12)
  await inputMask.input.press('1');
  await inputMask.input.expectValue('1');

  // Type '5' → would form 15, exceeds max 12 → rejected, value stays '1'
  await inputMask.input.press('5');
  await inputMask.input.expectValue('1');

  // Type '2' → forms 12 which is valid → accepted
  await inputMask.input.press('2');
  await inputMask.input.expectValue('12');
});

test('arrow up/down increments/decrements segment', async ({ page }) => {
  await loadComponent(
    page,
    {
      imports: ['input', 'inputMask', 'inputField'],
      template: `<ngn-input-field>
        <ngn-input-mask [mask]="inputs().mask">
          <input ngnInput>
        </ngn-input-mask>
      </ngn-input-field>`,
    },
    {
      inputs: {
        mask: 'time',
      },
    }
  );

  const inputMask = new NgnInputMaskHarness(page.locator('ngn-input-mask').first());
  const inputEl = page.locator('input').first();
  await inputMask.input.expectValue('');

  // Focus the input
  await inputEl.focus();

  // ArrowUp on empty → fills defaults then increments hour
  await inputMask.input.press('ArrowUp');
  await inputMask.input.expectValue('01:00:00');

  // ArrowUp again → hour increments to 02
  await inputMask.input.press('ArrowUp');
  await inputMask.input.expectValue('02:00:00');

  await inputMask.clear();
  await inputMask.input.expectValue('');

  // Type '230000' → '23:00:00'
  await inputMask.input.pressSequentially('230000');
  await inputMask.input.expectValue('23:00:00');

  // Move cursor to start (hour segment)
  await inputMask.input.press('Home');
  await page.waitForTimeout(50);

  // ArrowUp → hour 23+1 wraps to 00 → '00:00:00'
  await inputMask.input.press('ArrowUp');
  await inputMask.input.expectValue('00:00:00');

  // ArrowDown → hour 00-1 wraps to 23 → '23:00:00'
  await inputMask.input.press('ArrowDown');
  await inputMask.input.expectValue('23:00:00');
});

test('enum segment typing and arrow cycling', async ({ page }) => {
  await loadComponent(
    page,
    {
      imports: ['input', 'inputMask', 'inputField'],
      template: `<ngn-input-field>
        <ngn-input-mask [mask]="inputs().mask">
          <input ngnInput>
        </ngn-input-mask>
      </ngn-input-field>`,
    },
    {
      inputs: {
        mask: 'time12',
      },
    }
  );

  const inputMask = new NgnInputMaskHarness(page.locator('ngn-input-mask').first());
  await inputMask.input.expectValue('');

  // Type '123000' → fills hour, minute, and second segments
  await inputMask.input.pressSequentially('123000');
  await inputMask.input.expectValue('12:30:00');

  // Press 'p' → matches 'PM' enum value, fills segment → '12:30:00 PM'
  await inputMask.input.press('p');
  await inputMask.input.expectValue('12:30:00 PM');

  // ArrowUp → cycles enum from PM to AM → '12:30:00 AM'
  await inputMask.input.press('ArrowUp');
  await inputMask.input.expectValue('12:30:00 AM');

  // ArrowDown → cycles enum from AM back to PM → '12:30:00 PM'
  await inputMask.input.press('ArrowDown');
  await inputMask.input.expectValue('12:30:00 PM');
});

test('date mask basic input', async ({ page }) => {
  await loadComponent(
    page,
    {
      imports: ['input', 'inputMask', 'inputField'],
      template: `<ngn-input-field>
        <ngn-input-mask [mask]="inputs().mask">
          <input ngnInput>
        </ngn-input-mask>
      </ngn-input-field>`,
    },
    {
      inputs: {
        mask: 'date',
      },
    }
  );

  const inputMask = new NgnInputMaskHarness(page.locator('ngn-input-mask').first());
  await inputMask.input.expectValue('');
  await inputMask.expectTextWithMask('MM/DD/YYYY');

  // Type full date '06152026'
  await inputMask.input.pressSequentially('06152026');
  await inputMask.input.expectValue('06/15/2026');
  await inputMask.expectTextWithMask('06/15/2026');
});

test('paste applies valid data and rejects invalid data', async ({ page }) => {
  await loadComponent(
    page,
    {
      imports: ['input', 'inputMask', 'inputField'],
      template: `<ngn-input-field>
        <ngn-input-mask [mask]="inputs().mask">
          <input ngnInput>
        </ngn-input-mask>
      </ngn-input-field>`,
    },
    {
      inputs: {
        mask: 'time',
      },
    }
  );

  const inputMask = new NgnInputMaskHarness(page.locator('ngn-input-mask').first());
  const inputEl = page.locator('input').first();
  await inputMask.input.expectValue('');

  const simulatePaste = (text: string) =>
    page.evaluate(t => {
      const input = document.querySelector('input') as HTMLInputElement;
      const beforeInputEvent = new InputEvent('beforeinput', {
        bubbles: true,
        cancelable: true,
        inputType: 'insertFromPaste',
        data: t,
      });
      input.dispatchEvent(beforeInputEvent);
    }, text);

  // Valid paste: '123456' → '12:34:56' (separators auto-inserted)
  await inputEl.focus();
  await simulatePaste('123456');
  await inputMask.input.expectValue('12:34:56');

  // Valid paste with separators: '08:45:30' → '08:45:30'
  await inputMask.clear();
  await simulatePaste('08:45:30');
  await inputMask.input.expectValue('08:45:30');

  // Invalid paste: '331200' → hour 33 > 23, rejected, value unchanged
  await inputMask.clear();
  await simulatePaste('331200');
  await inputMask.input.expectValue('');

  // Invalid paste: '127500' → minute 75 > 59, rejected
  await simulatePaste('127500');
  await inputMask.input.expectValue('');
});
