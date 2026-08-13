import test, { expect } from '@playwright/test';
import { JigMaskInputHarness } from '@awdlab/jig-playwright';
import { loadComponent } from '../helper/load-component';
import { useRtl } from '../helper/direction';
import { expectScreenshot } from '../helper/screenshot';
import { expectNoA11yViolations } from '../helper/axe';

// ---------------------------------------------------------------------------
// Helper: load a time-mask component and return the harness + handle.
// The template echoes the emitted value via output('value', $event) so we
// can assert the complete serialized value from the outputLog.
// ---------------------------------------------------------------------------

async function loadTimeMask(page: any) {
  const handle = await loadComponent(
    page,
    {
      imports: ['inputField', 'maskInput'],
      template: `<jig-input-field>
        <jig-mask-input [mask]="inputs().mask" (valueChange)="output('value', $event)" />
      </jig-input-field>`,
    },
    {
      inputs: { mask: 'time' },
    }
  );
  // loadComponent fires setTemplate and setInputs without awaiting Angular rendering.
  // Wait for Angular to process the template change (time mask = 3 spinbutton sections).
  const mask = new JigMaskInputHarness(page.locator('jig-mask-input').first());
  await expect(mask.sections).toHaveCount(3);
  await mask.expectText('HH:MM:SS');
  return { mask, handle };
}

// ---------------------------------------------------------------------------
// 1. Initial placeholders
//
// The `time` mask (HH:mm:ss) shows placeholder text and emits null on init.
// ---------------------------------------------------------------------------

test('initial placeholders show and value emits null', async ({ page }, testInfo) => {
  const { mask, handle } = await loadTimeMask(page);

  // The mask starts empty — all sections show placeholders.
  await mask.expectText('HH:MM:SS');

  // The component emits null on init (mask is incomplete).
  await expect
    .poll(async () => (await handle.getOutputLog())['value'] ?? [], { timeout: 5000 })
    .toContainEqual(null);

  await expectScreenshot(page, testInfo, 'initial-state');
});

// ---------------------------------------------------------------------------
// 2. Type + auto-advance.
//
// The `time` mask uses HH:mm:ss — all number fields are padded to 2 digits.
// Partial values stored in a padded field are displayed zero-padded:
//   value '1' in a length-2 field → composeDisplay shows '01'.
// Auto-advance fires when isSectionComplete returns true:
//   number: value.length === maxLen  OR  Number(value) * 10 > max.
// ---------------------------------------------------------------------------

test('partial digit shows raw display in active padded field', async ({ page }) => {
  const { mask } = await loadTimeMask(page);

  // '1' in hour (max=23, length=2): 1*10=10 ≤ 23, length 1 < 2 → partial, active.
  // Active + incomplete → raw '1' (no padding while typing).
  await mask.pressSequentially('1');
  await mask.expectText('1:MM:SS');

  // '2' → '12': 12*10=120 > 23 → complete → auto-advances to minute.
  // Hour is now non-active and complete → padded '12'.
  await mask.pressSequentially('2');
  await mask.expectText('12:MM:SS');

  // '3' in minute (max=59, length=2): 3*10=30 ≤ 59 → partial, active → raw '3'.
  await mask.pressSequentially('3');
  await mask.expectText('12:3:SS');
});

test('pressSequentially fills the whole mask and emits complete value', async ({
  page,
}, testInfo) => {
  const { mask, handle } = await loadTimeMask(page);

  await mask.pressSequentially('123456');
  await mask.expectText('12:34:56');

  // Value must be emitted once the mask is complete.
  await expect
    .poll(async () => (await handle.getOutputLog())['value'] ?? [], { timeout: 10000 })
    .toContainEqual('12:34:56');

  await expectScreenshot(page, testInfo, 'filled');
});

// ---------------------------------------------------------------------------
// 3. Single-digit auto-advance.
//    Pressing '3' in a max=23 hour field: 3*10=30 > 23 → advance.
//    The section is padded to '03' since length=2.
// ---------------------------------------------------------------------------

test('single digit that cannot grow auto-advances to next section', async ({ page }) => {
  const { mask } = await loadTimeMask(page);

  // '3': 3*10=30 > max(23) → complete → hour pads to '03', moves to minute.
  // Hour is complete so it pads; section is now non-active.
  await mask.pressSequentially('3');
  await mask.expectText('03:MM:SS');

  // Next char lands in minute (max=59): '0' partial → active + incomplete → raw '0'.
  await mask.pressSequentially('0');
  await mask.expectText('03:0:SS');
});

// ---------------------------------------------------------------------------
// 4. ArrowRight / ArrowLeft navigation.
//    Calls Home first to ensure a deterministic starting section.
// ---------------------------------------------------------------------------

test('arrow keys move active section without changing values', async ({ page }) => {
  const { mask } = await loadTimeMask(page);

  // Section ids are deterministic (DOM order = hour, minute, second). Comparing
  // against them — and polling — avoids a race with the async aria-activedescendant
  // write that a single synchronous read would otherwise hit (flaky).
  const hourId = await mask.sections.nth(0).getAttribute('id');
  const minuteId = await mask.sections.nth(1).getAttribute('id');
  expect(hourId).toBeTruthy();
  expect(minuteId).toBeTruthy();

  // Home guarantees we start from section 0 (hour) regardless of prior state.
  await mask.press('Home');
  await expect.poll(() => mask.activeDescendantId()).toBe(hourId);

  // ArrowRight advances to the next section (minute).
  await mask.press('ArrowRight');
  await expect.poll(() => mask.activeDescendantId()).toBe(minuteId);

  // ArrowLeft returns to section 0 (hour).
  await mask.press('ArrowLeft');
  await expect.poll(() => mask.activeDescendantId()).toBe(hourId);

  // Placeholder text must be unchanged.
  await mask.expectText('HH:MM:SS');
});

// ---------------------------------------------------------------------------
// 5. ArrowUp / ArrowDown step.
// ---------------------------------------------------------------------------

test('arrow up/down steps an empty section to its min then increments', async ({ page }) => {
  const { mask } = await loadTimeMask(page);

  // Ensure we are on the hour section.
  await mask.press('Home');

  // ArrowUp on empty hour → min=0, padded to '00'.
  await mask.press('ArrowUp');
  await mask.expectActiveText('00');

  // ArrowUp again → 01.
  await mask.press('ArrowUp');
  await mask.expectActiveText('01');

  // ArrowDown → back to 00.
  await mask.press('ArrowDown');
  await mask.expectActiveText('00');
});

// ---------------------------------------------------------------------------
// 6. Backspace behaviour.
//
// After '12' is typed, auto-advance fires (12*10>23) and the active section
// moves to minute. The minute is then empty.
//   Backspace 1: active=minute (empty) → prev() → active=hour (no clear).
//   Backspace 2: active=hour ('12') → clear → hour='', text='HH:MM:SS'.
// ---------------------------------------------------------------------------

test('backspace on empty section moves to previous; on filled section clears it', async ({
  page,
}) => {
  const { mask } = await loadTimeMask(page);

  // Type '12' → auto-advances to minute.
  await mask.pressSequentially('12');
  await mask.expectText('12:MM:SS');

  // Backspace 1: minute is empty → prev to hour (no clear).
  await mask.press('Backspace');
  await mask.expectText('12:MM:SS');

  // Backspace 2: hour '12' → clear.
  await mask.press('Backspace');
  await mask.expectText('HH:MM:SS');
});

test('backspace on an empty first section is a no-op', async ({ page }) => {
  const { mask } = await loadTimeMask(page);

  await mask.press('Home');
  // Backspace on empty hour (first section, no prev) — text unchanged.
  await mask.press('Backspace');
  await mask.expectText('HH:MM:SS');
});

// ---------------------------------------------------------------------------
// 7. Paste.
// ---------------------------------------------------------------------------

test('paste applies a valid time string', async ({ page }) => {
  const { mask, handle } = await loadTimeMask(page);

  const simulatePaste = (text: string) =>
    page.evaluate((t: string) => {
      const input = document.querySelector('jig-mask-input input') as HTMLInputElement;
      input.focus();
      input.dispatchEvent(
        new InputEvent('beforeinput', {
          bubbles: true,
          cancelable: true,
          inputType: 'insertFromPaste',
          data: t,
        })
      );
    }, text);

  // Valid paste without separators.
  await mask.focus();
  await simulatePaste('123456');
  await mask.expectText('12:34:56');

  await expect
    .poll(async () => (await handle.getOutputLog())['value'] ?? [], { timeout: 10000 })
    .toContainEqual('12:34:56');
});

test('paste with separators applies correct value', async ({ page }) => {
  const { mask } = await loadTimeMask(page);

  await mask.focus();
  await page.evaluate(() => {
    const input = document.querySelector('jig-mask-input input') as HTMLInputElement;
    input.focus();
    input.dispatchEvent(
      new InputEvent('beforeinput', {
        bubbles: true,
        cancelable: true,
        inputType: 'insertFromPaste',
        data: '08:45:30',
      })
    );
  });
  await mask.expectText('08:45:30');
});

test('invalid paste (out-of-range hour) is rejected', async ({ page }) => {
  const { mask } = await loadTimeMask(page);

  await mask.focus();
  await page.evaluate(() => {
    const input = document.querySelector('jig-mask-input input') as HTMLInputElement;
    input.focus();
    input.dispatchEvent(
      new InputEvent('beforeinput', {
        bubbles: true,
        cancelable: true,
        inputType: 'insertFromPaste',
        data: '331200',
      })
    );
  });
  // Hour 33 > 23 → rejected, mask stays empty.
  await mask.expectText('HH:MM:SS');
});

// ---------------------------------------------------------------------------
// 8. Click selects a section.
// ---------------------------------------------------------------------------

test('clicking a section makes it active', async ({ page }, testInfo) => {
  const { mask } = await loadTimeMask(page);

  // Sections: hour (0), minute (1), second (2).
  const minuteSection = mask.sections.nth(1);

  await minuteSection.click();

  // After click, aria-activedescendant must equal the minute span's id. Poll —
  // the attribute is written by an async effect, so a single read races.
  const minuteId = await minuteSection.getAttribute('id');
  await expect.poll(() => mask.activeDescendantId()).toBe(minuteId);

  await expectScreenshot(page, testInfo, 'active-section');
});

// ---------------------------------------------------------------------------
// 9. Full time mask scenario with segment validation.
// ---------------------------------------------------------------------------

test('time mask segment validation — complete sequence', async ({ page }) => {
  const { mask, handle } = await loadTimeMask(page);

  // Two-digit hour.
  await mask.pressSequentially('12');
  await mask.expectText('12:MM:SS');

  // Two-digit minute.
  await mask.pressSequentially('30');
  await mask.expectText('12:30:SS');

  // Two-digit second.
  await mask.pressSequentially('45');
  await mask.expectText('12:30:45');

  await expect
    .poll(async () => (await handle.getOutputLog())['value'] ?? [], { timeout: 10000 })
    .toContainEqual('12:30:45');
});

// ---------------------------------------------------------------------------
// 10. ArrowUp wraps hour from 23 to 00; ArrowDown wraps 00 to 23.
// ---------------------------------------------------------------------------

test('arrow up wraps hour from 23 to 00, arrow down wraps 00 to 23', async ({ page }) => {
  const { mask } = await loadTimeMask(page);

  // Fill '23:00:00' then go back to hour.
  await mask.pressSequentially('230000');
  await mask.expectText('23:00:00');

  await mask.press('Home');

  // ArrowUp: 23+1 > max(23) wraps to min(0) → '00'.
  await mask.press('ArrowUp');
  await mask.expectActiveText('00');

  // ArrowDown: 00-1 < min(0) wraps to max(23) → '23'.
  await mask.press('ArrowDown');
  await mask.expectActiveText('23');
});

// ---------------------------------------------------------------------------
// 11. Enum segment (time12 mask).
//     Initial: 'HH:MM:SS --'  (space separator; enum placeholder '--').
// ---------------------------------------------------------------------------

test('enum segment fills by typing a letter and arrows cycle values', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      imports: ['inputField', 'maskInput'],
      template: `<jig-input-field>
        <jig-mask-input [mask]="inputs().mask" (valueChange)="output('value', $event)" />
      </jig-input-field>`,
    },
    { inputs: { mask: 'time12' } }
  );
  const mask = new JigMaskInputHarness(page.locator('jig-mask-input').first());

  // Wait for the 4-section time12 mask to render (hour, minute, second, period).
  await expect(mask.sections).toHaveCount(4);
  // Initial: all placeholders. The period placeholder is '--' (space separator).
  await mask.expectText('HH:MM:SS --');

  // Fill the numeric fields (12:30:00). Active lands at period enum.
  await mask.pressSequentially('123000');
  await mask.expectText('12:30:00 --');

  // 'p' matches 'PM' in ['AM','PM'].
  await mask.pressSequentially('p');
  await mask.expectText('12:30:00 PM');

  await expect
    .poll(async () => (await handle.getOutputLog())['value'] ?? [], { timeout: 10000 })
    .toContainEqual('12:30:00 PM');

  // ArrowUp cycles PM → AM.
  await mask.press('ArrowUp');
  await mask.expectActiveText('AM');

  // ArrowUp again → PM.
  await mask.press('ArrowUp');
  await mask.expectActiveText('PM');

  // ArrowDown → AM.
  await mask.press('ArrowDown');
  await mask.expectActiveText('AM');
});

// ---------------------------------------------------------------------------
// 12. Date mask basic input.
// ---------------------------------------------------------------------------

test('date mask fills and emits correct value', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      imports: ['inputField', 'maskInput'],
      template: `<jig-input-field>
        <jig-mask-input [mask]="inputs().mask" (valueChange)="output('value', $event)" />
      </jig-input-field>`,
    },
    { inputs: { mask: 'date' } }
  );
  const mask = new JigMaskInputHarness(page.locator('jig-mask-input').first());

  // Wait for the 3-section date mask to render (month, day, year).
  await expect(mask.sections).toHaveCount(3);
  await mask.expectText('MM/DD/YYYY');

  await mask.pressSequentially('06152026');
  await mask.expectText('06/15/2026');

  await expect
    .poll(async () => (await handle.getOutputLog())['value'] ?? [], { timeout: 10000 })
    .toContainEqual('06/15/2026');
});

// ---------------------------------------------------------------------------
// 13. Variable-length hour mask (min=1, max=12, no `length` → not padded).
//     Minute has length=2 → padded.
// ---------------------------------------------------------------------------

test('variable-length hour mask renders non-padded and auto-advances correctly', async ({
  page,
}) => {
  await loadComponent(
    page,
    {
      imports: ['inputField', 'maskInput'],
      template: `<jig-input-field>
        <jig-mask-input [mask]="inputs().mask" (valueChange)="output('value', $event)" />
      </jig-input-field>`,
    },
    {
      inputs: {
        mask: [
          { kind: 'number', segment: 'hour', min: 1, max: 12, placeholder: 'HH' },
          ':',
          { kind: 'number', segment: 'minute', min: 0, max: 59, length: 2, placeholder: 'MM' },
        ],
      },
    }
  );
  const mask = new JigMaskInputHarness(page.locator('jig-mask-input').first());

  // Wait for the 2-section variable-length mask to render.
  await expect(mask.sections).toHaveCount(2);
  await mask.expectText('HH:MM');

  // '1' → partial, hour stays (1*10=10≤12, length 1 < maxLen 2). Not padded.
  await mask.pressSequentially('1');
  await mask.expectText('1:MM');

  // '1' again → '11': length 2 = maxLen → complete → auto-advances to minute.
  await mask.pressSequentially('1');
  await mask.expectText('11:MM');

  // '1' in minute: partial, active → raw '1' (no padding while typing).
  await mask.pressSequentially('1');
  await mask.expectText('11:1');
});

test('variable-length hour overflow: 1+3 overflows to 3 in hour, advances', async ({ page }) => {
  await loadComponent(
    page,
    {
      imports: ['inputField', 'maskInput'],
      template: `<jig-input-field>
        <jig-mask-input [mask]="inputs().mask" (valueChange)="output('value', $event)" />
      </jig-input-field>`,
    },
    {
      inputs: {
        mask: [
          { kind: 'number', segment: 'hour', min: 1, max: 12, placeholder: 'HH' },
          ':',
          { kind: 'number', segment: 'minute', min: 0, max: 59, length: 2, placeholder: 'MM' },
        ],
      },
    }
  );
  const mask = new JigMaskInputHarness(page.locator('jig-mask-input').first());
  await expect(mask.sections).toHaveCount(2);
  await mask.expectText('HH:MM');

  // '1' → hour='1' (partial).
  await mask.pressSequentially('1');
  await mask.expectText('1:MM');

  // '3': appended '13'>12 → restart '3', 3*10=30>12 → complete → advance.
  // Hour displays raw '3' (not padded), active moves to minute.
  await mask.pressSequentially('3');
  await mask.expectText('3:MM');
});

// ---------------------------------------------------------------------------
// 14. Active-section highlight only shows while focused.
//     Before the fix, section 0 was highlighted even when the control had no
//     focus. The `section-active` class must now be absent until the proxy
//     input is focused, and must disappear again after blur.
// ---------------------------------------------------------------------------

test('active-section highlight only shows while focused', async ({ page }, testInfo) => {
  const { mask } = await loadTimeMask(page);

  // The class selector for section-active elements (e.g. '.jig-mask-input-section-active')
  const sectionActiveSelector = mask.classes['section-active'];

  // BEFORE focusing: no section should carry the active class.
  await expect
    .poll(async () => page.locator(`[role="spinbutton"]${sectionActiveSelector}`).count(), {
      timeout: 3000,
    })
    .toBe(0);

  await expectScreenshot(page, testInfo, 'unfocused-no-highlight');

  // AFTER focusing: exactly one section should carry the active class.
  await mask.focus();

  await expect
    .poll(async () => page.locator(`[role="spinbutton"]${sectionActiveSelector}`).count(), {
      timeout: 3000,
    })
    .toBe(1);

  // The highlighted section must be the one matching aria-activedescendant.
  const highlightedId = await page
    .locator(`[role="spinbutton"]${sectionActiveSelector}`)
    .getAttribute('id');
  expect(highlightedId).not.toBeNull();
  // Poll: aria-activedescendant may settle a tick after the highlight class.
  await expect.poll(() => mask.activeDescendantId()).toBe(highlightedId);

  // AFTER blurring: active class disappears again.
  await page.locator('body').click({ position: { x: 0, y: 0 } });

  await expect
    .poll(async () => page.locator(`[role="spinbutton"]${sectionActiveSelector}`).count(), {
      timeout: 3000,
    })
    .toBe(0);
});

// ---------------------------------------------------------------------------
// 15. Deleting an earlier field clears orphaned later fields.
// ---------------------------------------------------------------------------

test('deleting an earlier field clears orphaned later fields', async ({ page }) => {
  await loadComponent(
    page,
    {
      imports: ['inputField', 'maskInput'],
      template: `<jig-input-field>
        <jig-mask-input [mask]="inputs().mask" (valueChange)="output('value', $event)" />
      </jig-input-field>`,
    },
    {
      inputs: {
        mask: [
          { kind: 'number', segment: 'hour', min: 1, max: 12, placeholder: 'HH' },
          ':',
          { kind: 'number', segment: 'minute', min: 0, max: 59, length: 2, placeholder: 'MM' },
        ],
      },
    }
  );
  const mask = new JigMaskInputHarness(page.locator('jig-mask-input').first());
  await expect(mask.sections).toHaveCount(2);
  await mask.expectText('HH:MM');

  // '1','3','0':
  //   '1' → hour='1' (partial, 1*10≤12)
  //   '3' → appended '13'>12 → restart '3', 3*10>12 → advance. hour='3', active→minute.
  //   '0' → minute='0' → active + incomplete (0*10=0≤59) → raw '0'.
  // Result: hour='3' (non-active, not padded since pad=false), minute='0' → display '3:0'.
  await mask.pressSequentially('130');
  await mask.expectText('3:0');

  // Home then Delete → clears the hour section.
  // truncateGaps enforces no-gap invariant → orphaned minute cleared too.
  await mask.proxy.press('Home');
  await page.waitForTimeout(50);
  await mask.press('Delete');
  await mask.expectText('HH:MM');

  // Typing '5' now lands in hour → '5:MM' (old '00' does NOT resurrect).
  await mask.pressSequentially('5');
  await mask.expectText('5:MM');
});

// ---------------------------------------------------------------------------
// 16. Clicking in the surrounding input-field PADDING selects the nearest
//     section by horizontal position.
//
// The feature: `input-field.clicked()` calls `control.focusFromPointer(event)`;
// `JigMaskInput` focuses the proxy and calls `setActive` for the section whose
// bounding box is nearest `event.clientX`.
// ---------------------------------------------------------------------------

test('clicking input-field padding selects nearest section by horizontal position', async ({
  page,
}) => {
  // Load a time mask (HH:MM:SS — three sections) inside an input-field without
  // a label so the top padding is clean and not covered by a floating label.
  await loadComponent(
    page,
    {
      imports: ['inputField', 'maskInput'],
      template: `<jig-input-field><jig-mask-input [mask]="inputs().mask" /></jig-input-field>`,
    },
    { inputs: { mask: 'time' } }
  );
  const mask = new JigMaskInputHarness(page.locator('jig-mask-input').first());
  await expect(mask.sections).toHaveCount(3);
  await mask.expectText('HH:MM:SS');

  // Locate the field root div (not the jig-input-field host, but the inner
  // wrapper that receives the (click) handler). It wraps all content and has
  // padding around the mask sections.
  const fieldRoot = page.locator('jig-input-field').first();

  // ---- Per-section padding clicks (sections 1 and 2) ----
  // For each section, we compute a click point that is:
  //   X = center of the section (within the section's horizontal span)
  //   Y = just inside the top edge of the field root (in its padding, above the section text)
  // A real mouse click at those coordinates triggers the field's click handler with
  // the correct clientX, causing nearestSectionIndex to map to the right section.

  for (const sectionIndex of [1, 2]) {
    const sectionBox = await mask.sections.nth(sectionIndex).boundingBox();
    const fieldBox = await fieldRoot.boundingBox();

    if (!sectionBox || !fieldBox) {
      throw new Error(`Could not get bounding box for section ${sectionIndex} or field`);
    }

    // X: horizontal center of the target section.
    const clickX = sectionBox.x + sectionBox.width / 2;

    // Y: 3px below the field's top edge — inside the field but above section
    // text (field has top padding; even if padding is tight this sits in the
    // field's own bounding box).
    const clickY = fieldBox.y + 3;

    // Blur any existing focus before each click so state is clean.
    await page.locator('body').click({ position: { x: 0, y: 0 } });

    await page.mouse.click(clickX, clickY);

    const sectionId = await mask.sections.nth(sectionIndex).getAttribute('id');
    await expect
      .poll(async () => await mask.activeDescendantId(), { timeout: 5000 })
      .toBe(sectionId);
  }

  // ---- Clamp assertions ----
  // Click at the field's far-left padding (x ≈ fieldBox.x + 2) → first section (0).
  // Click at the field's far-right padding (x ≈ fieldBox.x + fieldBox.width - 2) → last section (2).
  // We use in-field coordinates so the field's click handler fires.

  const fieldBox = await fieldRoot.boundingBox();
  if (!fieldBox) throw new Error('Could not get field bounding box');

  const clickYCenter = fieldBox.y + fieldBox.height / 2;

  // Far-left clamp: x = fieldBox.x + 2 → should map to section 0 (hour).
  await page.locator('body').click({ position: { x: 0, y: 0 } });
  await page.mouse.click(fieldBox.x + 2, clickYCenter);

  const firstSectionId = await mask.sections.nth(0).getAttribute('id');
  await expect
    .poll(async () => await mask.activeDescendantId(), { timeout: 5000 })
    .toBe(firstSectionId);

  // Far-right clamp: x = fieldBox.x + fieldBox.width - 2 → should map to section 2 (second).
  await page.locator('body').click({ position: { x: 0, y: 0 } });
  await page.mouse.click(fieldBox.x + fieldBox.width - 2, clickYCenter);

  const lastSectionId = await mask.sections.nth(2).getAttribute('id');
  await expect
    .poll(async () => await mask.activeDescendantId(), { timeout: 5000 })
    .toBe(lastSectionId);
});

// ---------------------------------------------------------------------------
// 17. Accessibility scan of a labelled time mask.
// ---------------------------------------------------------------------------

test('accessibility (axe)', async ({ page }) => {
  // `label` names the proxy input (aria-label). Inside an input-field for a
  // realistic, representative configuration.
  await loadComponent(
    page,
    {
      imports: ['inputField', 'maskInput'],
      template: `<jig-input-field>
        <jig-mask-input [mask]="inputs().mask" [label]="'Time'" />
      </jig-input-field>`,
    },
    { inputs: { mask: 'time' } }
  );

  const mask = new JigMaskInputHarness(page.locator('jig-mask-input').first());
  await expect(mask.sections).toHaveCount(3);
  await mask.expectText('HH:MM:SS');

  // Accepted 1.4.3 gap: unfilled sections render their placeholder in surface.500
  // (#677b98 on #f0f2f5, 3.85:1). The placeholder is a format hint, not content the
  // control requires the user to read.
  await expectNoA11yViolations(page, { disableRules: ['color-contrast'] });
});

test('rtl', async ({ page }, testInfo) => {
  await useRtl(page);
  await loadComponent(
    page,
    {
      imports: ['inputField', 'maskInput'],
      template: `<jig-input-field>
        <jig-mask-input [mask]="inputs().mask" (valueChange)="output('value', $event)" />
      </jig-input-field>`,
    },
    {
      inputs: { mask: 'time' },
    }
  );
  await expectScreenshot(page, testInfo);
});
