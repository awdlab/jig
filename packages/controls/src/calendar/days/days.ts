import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, input, output, TemplateRef } from '@angular/core';
import { injectThemeTemplate } from '@ngneers/controls/api';
import { NgnButton } from '@ngneers/controls/button';
import { I18n } from '@ngneers/controls/i18n';
import { NgnIcon } from '@ngneers/controls/icon';
import { calendarControlTemplate } from '@ngneers/controls-themes/templates/calendar';

import {
  DayModel,
  DayTemplateType,
  MONTHS,
  TimeTemplateType,
  WEEK_DAYS,
  WeekDay,
  WeekDayTemplateType,
  YearTemplateType,
} from '../types';

// Configuration: Number of weeks to show before and after the current month
const WEEKS_BEFORE = 1;
const WEEKS_AFTER = 1;

type MonthModel = {
  weeks: WeekModel[];
};

type WeekModel = {
  days: DayModel[];
};

@Component({
  selector: 'ngn-calendar-days',
  templateUrl: './days.html',
  imports: [NgTemplateOutlet, NgClass, NgnButton, NgnIcon],
})
export class CalendarDays {
  protected readonly theme = injectThemeTemplate(calendarControlTemplate);
  public readonly year = input.required<number>();
  public readonly month = input.required<number>();
  public readonly currentValue = input.required<Date | null>();
  public readonly firstDayOfWeek = input.required<WeekDay>();
  public readonly dayTemplate = input.required<TemplateRef<DayTemplateType>>();
  public readonly weekDayTemplate = input.required<TemplateRef<WeekDayTemplateType>>();
  public readonly timeTemplate = input.required<TemplateRef<TimeTemplateType>>();
  public readonly yearTemplate = input.required<TemplateRef<YearTemplateType>>();
  public readonly showTime = input.required<boolean>();
  public readonly showSeconds = input.required<boolean>();
  public readonly previousMonth = output();
  public readonly nextMonth = output();
  public readonly switchToMonthsView = output();
  public readonly daySelected = output<DayModel>();
  public readonly yearSelected = output<number>();
  public readonly timeChanged = output<Date | null>();

  protected readonly i18n = inject(I18n).translations;
  protected readonly todaysDay = new Date().getDate();
  protected readonly todaysMonth = new Date().getMonth();
  protected readonly todaysYear = new Date().getFullYear();
  protected readonly doTimeChange = (t: Date | null) => this.timeChanged.emit(t);
  protected readonly doYearChange = (t: number) => this.yearSelected.emit(t);

  protected readonly monthName = computed(() =>
    this.i18n[`calendar_months_${MONTHS[this.month()]}`]()
  );
  protected readonly weekDaysSorted = computed(() =>
    WEEK_DAYS.slice(this._firstDayOfWeekIndex())
      .concat(WEEK_DAYS.slice(0, this._firstDayOfWeekIndex()))
      .map(day => ({
        weekDay: day,
        translation: this.i18n[`calendar_weekdaysShort_${day}`],
      }))
  );

  private readonly _firstDayOfWeekIndex = computed(() => WEEK_DAYS.indexOf(this.firstDayOfWeek()));
  private readonly _daysInMonth = computed(() =>
    new Date(this.year(), this.month() + 1, 0).getDate()
  );
  private readonly _daysInPreviousMonth = computed(() =>
    new Date(this.year(), this.month(), 0).getDate()
  );
  private readonly _firstDayOfMonth = computed(() =>
    new Date(this.year(), this.month(), 1).getDay()
  );

  protected readonly monthModel = computed((): MonthModel => {
    const firstDayOfMonth = this._firstDayOfMonth();
    const firstDayOfWeek = this._firstDayOfWeekIndex();
    const daysInMonth = this._daysInMonth();
    const daysInPreviousMonth = this._daysInPreviousMonth();

    // Calculate starting point and total days needed
    const firstDayOffset = (firstDayOfMonth - firstDayOfWeek + 7) % 7;
    const daysFromPreviousMonth = firstDayOffset + WEEKS_BEFORE * 7;
    const daysToNextMonth = (7 - ((daysFromPreviousMonth + daysInMonth) % 7)) % 7;
    const totalDays = daysFromPreviousMonth + daysInMonth + daysToNextMonth + WEEKS_AFTER * 7;
    const startDay = daysInPreviousMonth - daysFromPreviousMonth + 1;

    // Build all days in one pass
    const allDays: DayModel[] = [];
    let currentDate = startDay;
    let currentMonth = -1; // -1 = previous, 0 = current, 1 = next

    for (let i = 0; i < totalDays; i++) {
      // Determine which month we're in
      if (currentDate > daysInPreviousMonth && currentMonth === -1) {
        currentDate = 1;
        currentMonth = 0;
      } else if (currentDate > daysInMonth && currentMonth === 0) {
        currentDate = 1;
        currentMonth = 1;
      }

      allDays.push({
        date: currentDate,
        monthOffset: currentMonth,
      });

      currentDate++;
    }

    // Group into weeks
    const weeks: WeekModel[] = [];
    for (let i = 0; i < allDays.length; i += 7) {
      weeks.push({
        days: allDays.slice(i, i + 7),
      });
    }

    return { weeks };
  });

  protected prev() {
    this.previousMonth.emit();
  }

  protected next() {
    this.nextMonth.emit();
  }

  protected selectYear(year: number) {
    this.yearSelected.emit(year);
  }
}
