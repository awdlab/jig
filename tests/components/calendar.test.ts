import test, { expect } from '@playwright/test';
import { loadComponent } from '../helper/load-component';
import { expectScreenshot } from '../helper/screenshot';
import { NgnCalendarHarness } from '@ngneers/controls-playwright';

test('IO', async ({ page }, testInfo) => {
  await page.clock.setFixedTime(new Date('2025-08-18T12:13:14'));

  const handle = await loadComponent(
    page,
    {
      template: `<ngn-calendar [inline]="true" [value]="inputs().value" (valueChange)="output('value', $event)" />`,
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

  const calendar = new NgnCalendarHarness(page.locator('ngn-calendar'));
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

test('first day of week', async ({ page }, testInfo) => {
  await page.clock.setFixedTime(new Date('2025-08-18T12:13:14'));

  const handle = await loadComponent(
    page,
    {
      template: `<ngn-calendar [inline]="true" [value]="inputs().value" [firstDayOfWeek]="inputs().firstDayOfWeek" (valueChange)="output('value', $event)" />`,
      imports: ['calendar'],
    },
    {
      inputs: {
        firstDayOfWeek: 'sunday',
        value: new Date(2025, 7, 18, 12, 0, 0), // August 18, 2025
      },
    }
  );

  const calendar = new NgnCalendarHarness(page.locator('ngn-calendar'));
  await calendar.expectDate('2025', 'August', '18');
  await calendar.expectFirstWeekday('sunday');
  await expectScreenshot(page, testInfo, 'sunday');
  await handle.setInputs({
    firstDayOfWeek: 'monday',
  });
  await calendar.expectFirstWeekday('monday');
  await expectScreenshot(page, testInfo, 'monday');
});
