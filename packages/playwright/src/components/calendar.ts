import { type Locator, expect } from '@playwright/test';
import { calendarControlTemplate } from '@awdlab/jig-themes/templates/calendar';
import { themeClasses } from '../utils/theme.js';
import { JigSelectHarness } from './select.js';
import type { WeekDay } from '@awdlab/jig/calendar';
import { en } from '@awdlab/jig/i18n/translations/en';
import { JigHarness } from '../harness.js';

export class JigCalendarHarness extends JigHarness {
  public readonly classes = themeClasses(calendarControlTemplate);

  public readonly backButton: Locator;
  public readonly nextButton: Locator;
  public readonly currentMonth: JigSelectHarness;
  public readonly currentYear: JigSelectHarness;
  public readonly days: Locator;
  public readonly day: Locator;
  public readonly daySameMonth: Locator;
  public readonly dayOtherMonth: Locator;
  public readonly daySelected: Locator;
  public readonly weekDay: Locator;

  constructor(locator: Locator) {
    super(locator);
    this.backButton = locator.locator(this.classes.previous['root']);
    this.nextButton = locator.locator(this.classes.next['root']);
    this.currentMonth = new JigSelectHarness(
      locator.locator(this.classes['current-month']['root'])
    );
    this.currentYear = new JigSelectHarness(locator.locator(this.classes['current-year']['root']));
    this.days = locator.locator(this.classes.days);
    this.day = locator.locator(this.classes.day);
    this.daySameMonth = locator.locator(
      `${this.classes.day}:not(${this.classes['day-other-month']})`
    );
    this.dayOtherMonth = locator.locator(`${this.classes.day}${this.classes['day-other-month']}`);
    this.daySelected = locator.locator(this.classes['day-selected']);
    this.weekDay = locator.locator(this.classes['week-day']);
  }

  public expectDate(year: string, month: string, day: string) {
    return Promise.all([
      this.currentYear.inputEditable.expectValue(year),
      this.currentMonth.expectSelectedItemText(month),
      expect(this.daySelected).toHaveText(day),
    ]);
  }

  public expectFirstWeekday(weekday: WeekDay) {
    return expect(this.weekDay.first()).toHaveText(en.calendar.weekdaysShort[weekday]);
  }

  public selectDay(day: number) {
    return this.daySameMonth.nth(day - 1).click();
  }

  /**
   * Select a month in the calendar while in months view
   * @param month the month to select (1-12)
   */
  public async selectMonth(month: number) {
    await this.currentMonth.open();
    await this.currentMonth.clickItemByIndex(month - 1);
  }

  public async selectDayFromOtherMonth(day: number) {
    return this.dayOtherMonth.filter({ hasText: new RegExp(`^\\s*${day}\\s*$`) }).click();
  }
}
