import { NgClass } from '@angular/common';
import { Component, input, linkedSignal, signal } from '@angular/core';
import { NgnItem } from '@ngneers/controls/api';
import {
  injectThemeTemplate,
  NgnTemplate,
  valueControlBaseProvider,
} from '@ngneers/controls/api/ng';
import { NgnInput } from '@ngneers/controls/input';
import { NgnSelect } from '@ngneers/controls/select';
import { calendarControlTemplate } from '@ngneers/controls-themes/templates/calendar';

import { CalendarTemplates } from './calendar-templates';
import { CalendarDays } from './days/days';
import { CalendarMonths } from './months/months';
import { CalendarTime } from './time/time';
import { DayModel, WeekDay } from './types';

function generateYearOptions(): NgnItem[] {
  const MAX_ITEMS = 200;
  const currentYear = new Date().getFullYear();
  return Array.from({ length: MAX_ITEMS }, (_, i) => ({
    label: (currentYear - MAX_ITEMS / 2 + i).toString(),
    value: currentYear - MAX_ITEMS / 2 + i,
  }));
}

/**
 * @category control
 */
@Component({
  selector: 'ngn-calendar',
  templateUrl: './calendar.html',
  imports: [NgnTemplate, NgClass, NgnInput, NgnSelect, CalendarMonths, CalendarDays, CalendarTime],
  providers: [valueControlBaseProvider(NgnCalendar)],
})
export class NgnCalendar extends CalendarTemplates {
  protected readonly theme = injectThemeTemplate(calendarControlTemplate);
  protected readonly year = linkedSignal(
    () => this.value()?.getFullYear() || new Date().getFullYear()
  );
  protected readonly month = linkedSignal(() => this.value()?.getMonth() ?? new Date().getMonth());
  /**
   * Set the first day of the week.
   */
  public readonly firstDayOfWeek = input<WeekDay>('monday');
  /**
   * Whether to show the time input.
   */
  public readonly showTime = input<boolean>(false);
  /**
   * Whether to show seconds in the time input.
   */
  public readonly showSeconds = input<boolean>(false);

  protected readonly currentView = signal<'days' | 'months'>('days');
  protected readonly yearOptions = generateYearOptions();

  protected readonly previousMonth = () => {
    const currentMonth = this.month();
    const currentYear = this.year();
    if (currentMonth === 0) {
      this.year.set(currentYear - 1);
      this.month.set(11); // December
    } else {
      this.month.set(currentMonth - 1);
    }
  };

  protected readonly nextMonth = () => {
    const currentMonth = this.month();
    const currentYear = this.year();
    if (currentMonth === 11) {
      this.year.set(currentYear + 1);
      this.month.set(0); // January
    } else {
      this.month.set(currentMonth + 1);
    }
  };

  protected readonly previousYear = () => {
    this.year.set(this.year() - 1);
  };

  protected readonly nextYear = () => {
    this.year.set(this.year() + 1);
  };

  protected switchToView(view: 'days' | 'months') {
    this.currentView.set(view);
  }

  protected selectMonth(index: number) {
    this.month.set(index);
    this.switchToView('days');
  }

  protected selectYear(year: number) {
    this.year.set(year);
  }

  protected selectDay(day: DayModel) {
    const newValue = new Date(this.value() || new Date());
    newValue.setFullYear(this.year());
    newValue.setMonth(this.month() + day.monthOffset);
    newValue.setDate(day.date);
    this.onChange(newValue);
  }

  protected changeTime(newTime: Date | null) {
    if (!newTime) {
      this.onChange(null);
      return;
    }
    const currentValue = this.value();
    if (currentValue) {
      const newValue = new Date(currentValue);
      newValue.setHours(newTime.getHours());
      newValue.setMinutes(newTime.getMinutes());
      newValue.setSeconds(newTime.getSeconds());
      this.onChange(newValue);
    }
  }
}
