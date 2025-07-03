import { JsonPipe, NgTemplateOutlet } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { NgnTemplate } from '@ngneers/controls/api';

import { WEEK_DAYS, WeekDay } from '../types';

// Configuration: Number of weeks to show before and after the current month
const WEEKS_BEFORE = 1;
const WEEKS_AFTER = 1;

type MonthModel = {
  weeks: WeekModel[];
};

type WeekModel = {
  days: DayModel[];
};

type DayModel = {
  date: number;
  isCurrentMonth: boolean;
};

@Component({
  selector: 'ngn-calendar-days',
  templateUrl: './days.html',
  styleUrls: ['./days.scss'], // TODO: refactor into theme
  imports: [NgTemplateOutlet, NgnTemplate, JsonPipe],
})
export class CalendarDays {
  public readonly year = input.required<number>();
  public readonly month = input.required<number>();
  public readonly firstDayOfWeek = input.required<WeekDay>();

  private readonly _firstDayOfWeekIndex = computed(() => WEEK_DAYS.indexOf(this.firstDayOfWeek()));
  private readonly _daysInMonth = computed(() => new Date(this.year(), this.month(), 0).getDate());
  private readonly _daysInPreviousMonth = computed(() =>
    new Date(this.year(), this.month() - 1, 0).getDate()
  );
  private readonly _firstDayOfMonth = computed(() =>
    new Date(this.year(), this.month() - 1, 1).getDay()
  );

  protected readonly monthModel = computed((): MonthModel => {
    const firstDayOfMonth = this._firstDayOfMonth();
    const firstDayOfWeek = this._firstDayOfWeekIndex();
    const daysInMonth = this._daysInMonth();
    const daysInPreviousMonth = this._daysInPreviousMonth();

    // Calculate how many days from previous month to show
    const firstDayOffset = (firstDayOfMonth - firstDayOfWeek + 7) % 7;

    // Calculate additional days to show before and after
    const additionalDaysBefore = WEEKS_BEFORE * 7;
    const additionalDaysAfter = WEEKS_AFTER * 7;

    // Build all days
    const allDays: DayModel[] = [];

    // Additional previous month days (full weeks before)
    for (
      let day = daysInPreviousMonth - firstDayOffset - additionalDaysBefore + 1;
      day <= daysInPreviousMonth - firstDayOffset;
      day++
    ) {
      allDays.push({
        date: day,
        isCurrentMonth: false,
      });
    }

    // Days from previous month to complete the first week
    for (let i = firstDayOffset - 1; i >= 0; i--) {
      allDays.push({
        date: daysInPreviousMonth - i,
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      allDays.push({
        date: day,
        isCurrentMonth: true,
      });
    }

    // Days from next month to complete the last week
    const remainingDaysInLastWeek = (7 - (allDays.length % 7)) % 7;
    for (let day = 1; day <= remainingDaysInLastWeek; day++) {
      allDays.push({
        date: day,
        isCurrentMonth: false,
      });
    }

    // Additional next month days (full weeks after)
    let nextMonthDay = remainingDaysInLastWeek + 1;
    for (let i = 0; i < additionalDaysAfter; i++) {
      allDays.push({
        date: nextMonthDay,
        isCurrentMonth: false,
      });
      nextMonthDay++;
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
}
