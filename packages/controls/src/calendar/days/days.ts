import { JsonPipe, NgTemplateOutlet } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { NgnTemplate } from '@ngneers/controls/api';

import { WEEK_DAYS, WeekDay } from '../types';

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
    const weeks: WeekModel[] = [];

    let remainingDays = this._daysInMonth();
    let currentDay = 1;

    const _firstDayOfMonthDistance = this._firstDayOfMonth() - this._firstDayOfWeekIndex();
    const firstDayOffset =
      _firstDayOfMonthDistance < 0 ? 7 + _firstDayOfMonthDistance : _firstDayOfMonthDistance;

    let currentWeek: WeekModel = { days: [] };

    // Fill the first week with days from the previous month if needed
    for (let i = 0; i < firstDayOffset; i++) {
      const previousMonthDay = this._daysInPreviousMonth() - firstDayOffset + i + 1;
      currentWeek.days.push({
        date: previousMonthDay,
        isCurrentMonth: false,
      });
    }

    while (remainingDays > 0) {
      // If the current week is full, push it to the weeks array and start a new week
      if (currentWeek.days.length === 7) {
        weeks.push(currentWeek);
        currentWeek = { days: [] };
      }

      // Add the current day to the week
      currentWeek.days.push({
        date: currentDay,
        isCurrentMonth: true,
      });

      // Increment the day and decrement the remaining days
      currentDay++;
      remainingDays--;

      // If we reach the end of the month, reset the current day
      if (currentDay > this._daysInMonth()) {
        currentDay = 1;
      }
    }
    // Fill the last week with days from the next month if needed
    currentDay = 1;
    while (currentWeek.days.length < 7) {
      currentWeek.days.push({
        date: currentDay,
        isCurrentMonth: false,
      });
      currentDay++;
    }
    // Push the last week to the weeks array
    if (currentWeek.days.length > 0) {
      weeks.push(currentWeek);
    }
    return {
      weeks: weeks,
    };
  });
}
