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
        isCurrentMonth: currentMonth === 0,
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
}
