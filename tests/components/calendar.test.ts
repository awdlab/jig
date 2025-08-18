import test, { expect } from '@playwright/test';
import { loadComponent } from '../load-component';
import { expectScreenshot } from '../helper/screenshot';
import { NgnCalendarHarness } from 'packages/playwright/src/components/calendar';

test('first day of week', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<ngn-calendar [value]="inputs().value" [firstDayOfWeek]="inputs().firstDayOfWeek" (valueChange)="output('value', $event)" />`,
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
