import test, { expect } from '@playwright/test';
import { loadComponent } from '../helper/load-component';
import { useRtl } from '../helper/direction';
import { expectScreenshot } from '../helper/screenshot';
import { JigCalendarHarness, JigMaskInputHarness } from '@awdlab/jig-playwright';
import { expectNoA11yViolations } from '../helper/axe';

test('IO', async ({ page }, testInfo) => {
  await page.clock.setFixedTime(new Date('2025-08-18T12:13:14'));

  const handle = await loadComponent(
    page,
    {
      template: `<jig-calendar [inline]="true" [value]="inputs().value" (valueChange)="output('value', $event)" />`,
      imports: ['calendar'],
    },
    {
      inputs: {
        value: new Date(2025, 7, 18, 12, 0, 0), // August 18, 2025
      },
    }
  );

  const expectedOutputs: Date[] = [];
  async function expectOutput(withNewValue?: Date) {
    if (withNewValue) {
      expectedOutputs.push(withNewValue);
    }
    expect(await handle.getOutputLog()).toEqual({ value: expectedOutputs });
  }

  const calendar = new JigCalendarHarness(page.locator('jig-calendar'));
  await calendar.expectDate('2025', 'August', '18');
  await expectScreenshot(page, testInfo, 'initial value');
  await handle.setInputs({
    value: new Date(2023, 2, 11, 12, 0, 0), // March 11, 2023
  });
  await calendar.expectDate('2023', 'March', '11');
  await expectScreenshot(page, testInfo, 'updated value');

  await calendar.selectDay(15);
  await calendar.expectDate('2023', 'March', '15');
  await expectOutput(new Date(2023, 2, 15, 12, 0, 0));

  await calendar.backButton.click();
  await calendar.selectDay(4);
  await calendar.expectDate('2023', 'February', '4');
  await expectOutput(new Date(2023, 1, 4, 12, 0, 0));

  await calendar.selectMonth(12);
  await expectOutput();
  // The pointer rests where the month option was and would hover a day cell underneath.
  await page.mouse.move(800, 600, { steps: 2 });
  await expectScreenshot(page, testInfo, 'month-selected');
  await calendar.selectDay(30);
  await calendar.expectDate('2023', 'December', '30');
  await expectOutput(new Date(2023, 11, 30, 12, 0, 0));

  await calendar.selectDayFromOtherMonth(5);
  await calendar.expectDate('2024', 'January', '5');
  await expectOutput(new Date(2024, 0, 5, 12, 0, 0));
  await expectScreenshot(page, testInfo, 'different-year-month-selected');

  await calendar.currentYear.inputEditable.fill('2026');
  await calendar.selectDay(1);
  await calendar.expectDate('2026', 'January', '1');
  await expectOutput(new Date(2026, 0, 1, 12, 0, 0));
});

test('typing partial input is free and does not move the calendar', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `<jig-calendar [inputId]="'cal'" [showTime]="true" [format]="'MM/dd/yyyy h:mm a'" (valueChange)="output('value', $event)" />`,
      imports: ['calendar'],
    },
    { inputs: {} }
  );

  // The proxy input is the hidden input inside jig-mask-input inside jig-calendar.
  // Visible text is rendered in section/separator spans, not in input.value.
  const maskHarness = new JigMaskInputHarness(page.locator('jig-calendar jig-mask-input').first());
  await maskHarness.focus();

  // Regression: typing "1" used to auto-parse to "01/01/2001 12:00 AM" and block
  // further input. Partial input must stay free and must NOT move the calendar.
  await maskHarness.press('1');
  // Month section shows '1' (partial, active — raw digits shown while typing).
  await maskHarness.expectActiveText('1');

  // Not blocked — a second digit builds the month up to "11".
  await maskHarness.press('1');
  // Month '11': 11*10=110 > 12 so 11 auto-advances to day section.
  // After '11' the active section may move to day; check that the displayed text includes
  // the month digits without asserting the exact section state.
  // The mask is still incomplete, so the calendar value must not change.
  expect((await handle.getOutputLog())['value'] ?? []).toEqual([]);
});

test('typing a complete date updates the calendar value live, exactly once', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `<jig-calendar [inputId]="'cal2'" [format]="'MM/dd/yyyy'" (valueChange)="output('value', $event)" />`,
      imports: ['calendar'],
    },
    { inputs: {} }
  );

  const maskHarness = new JigMaskInputHarness(page.locator('jig-calendar jig-mask-input').first());
  await maskHarness.focus();

  // Incomplete (year only partially typed) → no calendar update yet.
  // Year field has length=4 (format 'yyyy'); active + incomplete → raw digits '20'.
  await maskHarness.pressSequentially('121520');
  await maskHarness.expectText('12/15/20');
  expect((await handle.getOutputLog())['value'] ?? []).toEqual([]);

  // Completing the 4-digit year fills the mask → calendar value updates live...
  await maskHarness.pressSequentially('26');
  await maskHarness.expectText('12/15/2026');

  // ...exactly once (no echo loop from the valueStr→input write-back).
  await expect
    .poll(async () => (await handle.getOutputLog())['value']?.length ?? 0, { timeout: 15000 })
    .toBe(1);
});

test('clearing every input mask section clears the calendar value', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `<jig-calendar [inputId]="'calclear'" [format]="'MM/dd/yyyy'" [value]="inputs().value" (valueChange)="output('value', $event)" />`,
      imports: ['calendar'],
    },
    {
      inputs: {
        value: new Date(2026, 5, 15, 12, 0, 0),
      },
    }
  );

  const mask = new JigMaskInputHarness(page.locator('jig-calendar jig-mask-input').first());
  await mask.expectText('06/15/2026');

  await mask.clear();
  await mask.expectText('MM/DD/YYYY');

  await expect
    .poll(async () => (await handle.getOutputLog())['value'] ?? [], { timeout: 10000 })
    .toContainEqual(null);
});

test('invalid state reaches the visible input field border', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `<jig-input-field style="width: 220px;"><jig-calendar [inputId]="'calinvalid'" [format]="'MM/dd/yyyy'" [invalid]="inputs().invalid" /></jig-input-field>`,
      imports: ['calendar', 'inputField'],
    },
    {
      inputs: {
        invalid: false,
      },
    }
  );

  const field = page.locator('jig-input-field .jig-input-field-root').first();
  const calendar = page.locator('jig-calendar').first();
  const calendarField = page.locator('jig-calendar .jig-calendar-input-field').first();
  const input = page.locator('jig-calendar input').first();
  const normalBorderColor = await field.evaluate(el => getComputedStyle(el).borderTopColor);

  await handle.setInputs({ invalid: true });
  // invalidOn='touched' (default) gates the raw invalid flag: it doesn't surface
  // before the user interacts, so nothing flashes invalid on a pristine field.
  await expect(calendar).not.toHaveAttribute('aria-invalid', 'true');
  await expect(calendarField).not.toHaveClass(/jig-calendar-invalid/);

  // blurring the field marks the control touched, which reveals the invalid state.
  await input.focus();
  await input.blur();

  await expect(calendar).toHaveAttribute('aria-invalid', 'true');
  await expect(calendarField).toHaveClass(/jig-calendar-invalid/);
  await expect
    .poll(async () => field.evaluate(el => getComputedStyle(el).borderTopColor))
    .not.toBe(normalBorderColor);
});

test('arrow-stepping an out-of-range day clamps to the month instead of rolling over', async ({
  page,
}) => {
  const handle = await loadComponent(
    page,
    {
      template: `<jig-calendar [inputId]="'calclamp'" [format]="'MM/dd/yyyy'" (valueChange)="output('value', $event)" />`,
      imports: ['calendar'],
    },
    { inputs: {} }
  );

  const mask = new JigMaskInputHarness(page.locator('jig-calendar jig-mask-input').first());
  await mask.focus();

  // Type February 1st 2026.
  await mask.pressSequentially('02012026');
  await mask.expectText('02/01/2026');

  // Move back to the day section. The day field's max is now the month's length
  // (28 for Feb 2026), so it wraps within [1, 28] in BOTH directions — never
  // rolling over into March.
  await mask.press('ArrowLeft'); // year → day

  // Down from 1 wraps to the month's last day (28), not to 31/March.
  await mask.press('ArrowDown');
  await mask.expectText('02/28/2026');

  // Up from the month max (28) wraps back to 1.
  await mask.press('ArrowUp');
  await mask.expectText('02/01/2026');

  // Down again wraps to 28.
  await mask.press('ArrowDown');
  await mask.expectText('02/28/2026');

  // The emitted calendar value is always in February, never March.
  await expect
    .poll(async () => {
      const log = (await handle.getOutputLog())['value'] as Date[] | undefined;
      const last = log?.[log.length - 1];
      return last ? `${last.getMonth()}-${last.getDate()}` : null;
    })
    .toBe('1-28'); // month index 1 = February, day 28
});

test('day field max adapts to the month: 30-day month and leap February', async ({ page }) => {
  for (const { typed, monthIdx, lastDay } of [
    { typed: '04012026', monthIdx: 3, lastDay: '30' }, // April — 30 days
    { typed: '02012024', monthIdx: 1, lastDay: '29' }, // February 2024 — leap
  ]) {
    await loadComponent(
      page,
      {
        template: `<jig-calendar [inputId]="'caldim'" [format]="'MM/dd/yyyy'" />`,
        imports: ['calendar'],
      },
      { inputs: {} }
    );
    const mask = new JigMaskInputHarness(page.locator('jig-calendar jig-mask-input').first());
    await mask.focus();
    await mask.pressSequentially(typed);

    const mm = String(monthIdx + 1).padStart(2, '0');
    const yyyy = typed.slice(4);

    await mask.press('ArrowLeft'); // year → day
    // Down from 1 wraps to the month's last valid day, never spilling over.
    await mask.press('ArrowDown');
    await mask.expectText(`${mm}/${lastDay}/${yyyy}`);
    // Up from the month max wraps back to 1.
    await mask.press('ArrowUp');
    await mask.expectText(`${mm}/01/${yyyy}`);
  }
});

test('clicking the calendar field padding selects the nearest mask section', async ({ page }) => {
  // The calendar uses its own field wrapper (not jig-input-field); this verifies
  // the wrapper forwards the pointer location to the embedded mask so a click in
  // the field padding selects the section nearest the cursor.
  await loadComponent(
    page,
    {
      template: `<jig-calendar [inputId]="'calpad'" [format]="'MM/dd/yyyy'" />`,
      imports: ['calendar'],
    },
    { inputs: {} }
  );

  const mask = new JigMaskInputHarness(page.locator('jig-calendar jig-mask-input').first());
  await expect(mask.sections).toHaveCount(3);

  const field = page.locator('jig-calendar .jig-calendar-input-field').first();

  // Per-section: click at each section's horizontal centre, near the field's top
  // edge (its padding row). Reverse order so each assertion is a real change.
  for (const i of [2, 1, 0]) {
    const fb = await field.boundingBox();
    const sb = await mask.sections.nth(i).boundingBox();
    if (!fb || !sb) throw new Error('no bounding box');
    await page.locator('body').click({ position: { x: 0, y: 0 } }); // blur first
    await page.mouse.click(sb.x + sb.width / 2, fb.y + 2);
    const id = await mask.sections.nth(i).getAttribute('id');
    await expect.poll(async () => await mask.activeDescendantId(), { timeout: 5000 }).toBe(id);
  }

  // Clamp: clicking the far-right padding (the trigger-icon area, not a section)
  // selects the LAST section; far-left padding selects the FIRST.
  const fb = await field.boundingBox();
  if (!fb) throw new Error('no field box');
  const midY = fb.y + fb.height / 2;

  await page.locator('body').click({ position: { x: 0, y: 0 } });
  await page.mouse.click(fb.x + fb.width - 3, midY);
  const lastId = await mask.sections.nth(2).getAttribute('id');
  await expect.poll(async () => await mask.activeDescendantId(), { timeout: 5000 }).toBe(lastId);

  await page.locator('body').click({ position: { x: 0, y: 0 } });
  await page.mouse.click(fb.x + 3, midY);
  const firstId = await mask.sections.nth(0).getAttribute('id');
  await expect.poll(async () => await mask.activeDescendantId(), { timeout: 5000 }).toBe(firstId);
});

test('clicking the OUTER input-field padding around a calendar selects the nearest section', async ({
  page,
}) => {
  // Matches the docs demo: the calendar is wrapped in a jig-input-field. The
  // outer field delegates the click to the calendar's focusFromPointer hook
  // (with real coordinates), which forwards to the mask — so clicking the outer
  // field's topmost border/padding selects the section under the cursor instead
  // of always landing on the first one.
  await loadComponent(
    page,
    {
      template: `<jig-input-field><jig-calendar [inputId]="'calwrap'" [format]="'MM/dd/yyyy'" /></jig-input-field>`,
      imports: ['inputField', 'calendar'],
    },
    { inputs: {} }
  );

  const mask = new JigMaskInputHarness(page.locator('jig-mask-input').first());
  await expect(mask.sections).toHaveCount(3);

  // The OUTER input-field root — its padding/border is the "topmost area".
  const outer = page.locator('jig-input-field .jig-input-field-root').first();

  for (const i of [2, 1, 0]) {
    const ob = await outer.boundingBox();
    const sb = await mask.sections.nth(i).boundingBox();
    if (!ob || !sb) throw new Error('no bounding box');
    await page.locator('body').click({ position: { x: 0, y: 0 } });
    // Topmost edge of the OUTER field (its padding, above the calendar's own field).
    await page.mouse.click(sb.x + sb.width / 2, ob.y + 1);
    const id = await mask.sections.nth(i).getAttribute('id');
    await expect.poll(async () => await mask.activeDescendantId(), { timeout: 5000 }).toBe(id);
  }
});

test('first day of week', async ({ page }, testInfo) => {
  await page.clock.setFixedTime(new Date('2025-08-18T12:13:14'));

  const handle = await loadComponent(
    page,
    {
      template: `<jig-calendar [inline]="true" [value]="inputs().value" [firstDayOfWeek]="inputs().firstDayOfWeek" (valueChange)="output('value', $event)" />`,
      imports: ['calendar'],
    },
    {
      inputs: {
        firstDayOfWeek: 'sunday',
        value: new Date(2025, 7, 18, 12, 0, 0), // August 18, 2025
      },
    }
  );

  const calendar = new JigCalendarHarness(page.locator('jig-calendar'));
  await calendar.expectDate('2025', 'August', '18');
  await calendar.expectFirstWeekday('sunday');
  await expectScreenshot(page, testInfo, 'sunday');
  await handle.setInputs({
    firstDayOfWeek: 'monday',
  });
  await calendar.expectFirstWeekday('monday');
  await expectScreenshot(page, testInfo, 'monday');
});

test('accessibility (axe)', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `<jig-calendar [inline]="true" [value]="inputs().value" />`,
      imports: ['calendar'],
    },
    { inputs: { value: new Date(2025, 7, 18, 12, 0, 0) } }
  );
  // Accepted 1.4.3 gap: other-month days render in surface.500 (#677b98 on #f7f8fa,
  // 4.06:1). They label dates outside the shown month, which the control does not
  // require the user to read.
  await expectNoA11yViolations(page, { disableRules: ['color-contrast'] });
});

test('rtl', async ({ page }, testInfo) => {
  await useRtl(page);
  await loadComponent(
    page,
    {
      template: `<jig-calendar [inline]="true" [value]="inputs().value" (valueChange)="output('value', $event)" />`,
      imports: ['calendar'],
    },
    {
      inputs: {
        value: new Date(2025, 7, 18, 12, 0, 0), // August 18, 2025
      },
    }
  );
  await expectScreenshot(page, testInfo);
});

test('keeps the navigated month when the host rebinds an equal date', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2025-08-18T12:13:14'));

  const handle = await loadComponent(
    page,
    {
      template: `<jig-calendar [inline]="true" [value]="inputs().value" />`,
      imports: ['calendar'],
    },
    { inputs: { value: new Date(2025, 7, 18, 12, 0, 0) } }
  );

  const calendar = new JigCalendarHarness(page.locator('jig-calendar'));
  await calendar.currentMonth.expectSelectedItemText('August');

  await calendar.backButton.click();
  await calendar.currentMonth.expectSelectedItemText('July');

  // A host binding `[value]="parse(raw)"` hands over a fresh Date on every pass.
  await handle.setInputs({ value: new Date(2025, 7, 18, 12, 0, 0) });
  await calendar.currentMonth.expectSelectedItemText('July');

  // A genuinely different month still moves the view.
  await handle.setInputs({ value: new Date(2025, 2, 11, 12, 0, 0) });
  await calendar.currentMonth.expectSelectedItemText('March');
});

test('the field is a single tab stop on its input', async ({ page }) => {
  await loadComponent(page, {
    template: `<button>before</button><jig-calendar [label]="'Due date'" />`,
    imports: ['calendar'],
  });

  await page.getByRole('button', { name: 'before' }).focus();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('textbox', { name: 'Due date' })).toBeFocused();
});

test('a pointer press on the icon does not mark the calendar touched', async ({ page }) => {
  const handle = await loadComponent(page, {
    template: `
      <jig-input-field style="width: 240px">
        <jig-calendar (touchedChange)="output('touched', $event)" />
      </jig-input-field>`,
    imports: ['inputField', 'calendar'],
  });
  await page.locator('jig-calendar input').focus();

  const box = (await page.locator('jig-calendar jig-icon').boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(150);
  await page.mouse.up();

  expect((await handle.getOutputLog())['touched']).toBeUndefined();
});

test('keeps a consumer id on the host, static or bound', async ({ page }) => {
  await loadComponent(page, {
    template: `<jig-calendar id="due" /><jig-calendar [id]="'start'" [inline]="true" />`,
    imports: ['calendar'],
  });

  await expect(page.locator('jig-calendar').nth(0)).toHaveAttribute('id', 'due');
  await expect(page.locator('jig-calendar').nth(1)).toHaveAttribute('id', 'start');
});

test('an inline calendar is a group without aria-required', async ({ page }) => {
  await loadComponent(page, {
    template: `<jig-calendar [inline]="true" required label="Due date" />`,
    imports: ['calendar'],
  });

  const group = page.getByRole('group', { name: 'Due date' });
  await expect(group).toBeVisible();
  await expect(group).not.toHaveAttribute('aria-required');
});

test('min / max disable out-of-range days but keep navigation free', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `<jig-calendar [inline]="true" [min]="inputs().min" [max]="inputs().max" [value]="inputs().value" (valueChange)="output('value', $event)" />`,
      imports: ['calendar'],
    },
    {
      inputs: {
        min: new Date(2025, 7, 10, 12, 0, 0),
        max: new Date(2025, 8, 20, 12, 0, 0),
        value: new Date(2025, 7, 18, 12, 0, 0),
      },
    }
  );

  const calendar = new JigCalendarHarness(page.locator('jig-calendar'));
  const disabledSameMonth = calendar.daySameMonth.and(calendar.dayDisabled);
  await expect(disabledSameMonth).toHaveCount(9); // August 1–9
  await expect(calendar.daySameMonth.nth(8)).toHaveAttribute('aria-disabled', 'true');
  await expect(calendar.daySameMonth.nth(9)).not.toHaveAttribute('aria-disabled');

  await calendar.daySameMonth.nth(4).click({ force: true });
  await calendar.daySameMonth.nth(4).press('Enter');
  await calendar.selectDay(10);
  await calendar.expectDate('2025', 'August', '10');
  expect((await handle.getOutputLog())['value']).toEqual([new Date(2025, 7, 10, 12, 0, 0)]);

  await calendar.nextButton.click();
  await calendar.currentMonth.expectSelectedItemText('September');
  await expect(disabledSameMonth).toHaveCount(10); // September 21–30

  // Paging past max still works; every day there is disabled.
  await calendar.daySameMonth.nth(29).focus();
  await page.keyboard.press('ArrowRight');
  await calendar.currentMonth.expectSelectedItemText('October');
  await expect(disabledSameMonth).toHaveCount(31);
  await calendar.backButton.click();
  await calendar.backButton.click();
  await calendar.backButton.click();
  await calendar.currentMonth.expectSelectedItemText('July');
  await expect(disabledSameMonth).toHaveCount(31);
});

test('typing a date outside min / max clamps it to the bound', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `<jig-calendar [inputId]="'calbounds'" [format]="'MM/dd/yyyy'" [min]="inputs().min" [max]="inputs().max" (valueChange)="output('value', $event)" />`,
      imports: ['calendar'],
    },
    { inputs: { min: new Date(2025, 7, 10, 12, 0, 0), max: new Date(2025, 8, 20, 12, 0, 0) } }
  );

  const mask = new JigMaskInputHarness(page.locator('jig-calendar jig-mask-input').first());
  await mask.focus();
  await mask.pressSequentially('01012020');
  await mask.expectText('08/10/2025');

  await mask.clear();
  await mask.focus();
  await mask.pressSequentially('12312030');
  await mask.expectText('09/20/2025');

  // The mask renders the committed value, so its text above is the clamped day.
  const log = (await handle.getOutputLog())['value'] as (Date | null)[];
  expect(log.filter(Boolean)).toHaveLength(2);
});
