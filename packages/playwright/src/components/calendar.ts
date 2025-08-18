import { Locator, expect } from '@playwright/test';
import { calendarControlTemplate } from '@ngneers/controls-themes/templates/calendar';
import { themeClasses } from '../utils/theme';
import { NgnSelectHarness } from './select';
import type { WeekDay } from '@ngneers/controls/calendar';
import { translations } from '../utils/i18n';

export class NgnCalendarHarness {
  public readonly classes = themeClasses(calendarControlTemplate);

  public readonly backButton: Locator;
  public readonly nextButton: Locator;
  public readonly currentMonth: Locator;
  public readonly currentYear: NgnSelectHarness;
  public readonly days: Locator;
  public readonly day: Locator;
  public readonly daySelected: Locator;
  public readonly month: Locator;
  public readonly weekDay: Locator;

  constructor(public locator: Locator) {
    this.backButton = locator.locator(this.classes.previous);
    this.nextButton = locator.locator(this.classes.next);
    this.currentMonth = locator.locator(this.classes['current-month']);
    this.currentYear = new NgnSelectHarness(locator.locator(this.classes['current-year']));
    this.days = locator.locator(this.classes.days);
    this.day = locator.locator(this.classes.day);
    this.daySelected = locator.locator(this.classes['day-selected']);
    this.month = locator.locator(this.classes.month);
    this.weekDay = locator.locator(this.classes['week-day']);
  }

  public expectDate(year: string, month: string, day: string) {
    return Promise.all([
      this.currentYear.editableInput.expectValue(year),
      expect(this.currentMonth).toHaveText(month),
      expect(this.daySelected).toHaveText(day),
    ]);
  }

  public expectFirstWeekday(weekday: WeekDay) {
    return expect(this.weekDay.first()).toHaveText(translations.en.calendar.weekdaysShort[weekday]);
  }
}
