import { NgClass } from '@angular/common';
import { Component, input, linkedSignal, signal } from '@angular/core';
import { injectThemeTemplate, NgnTemplate, valueControlBaseProvider } from '@ngneers/controls/api';
import { calendarControlTemplate } from '@ngneers/controls-themes/templates/calendar';

import { CalendarTemplates } from './calendar-templates';
import { CalendarDays } from './days/days';
import { CalendarMonths } from './months/months';
import { CalendarTime } from './time/time';
import { DayModel, WeekDay } from './types';
@Component({
  selector: 'ngn-calendar',
  templateUrl: './calendar.html',
  imports: [NgnTemplate, NgClass, CalendarMonths, CalendarDays, CalendarTime],
  providers: [valueControlBaseProvider(Calendar)],
})
export class Calendar extends CalendarTemplates {
  protected readonly theme = injectThemeTemplate(calendarControlTemplate);
  protected readonly year = linkedSignal(
    () => this.value()?.getFullYear() || new Date().getFullYear()
  );
  protected readonly month = linkedSignal(() => this.value()?.getMonth() || new Date().getMonth());
  public readonly firstDayOfWeek = input<WeekDay>('monday');
  public readonly showTime = input<boolean>(false);
  public readonly showSeconds = input<boolean>(false);

  protected readonly currentView = signal<'days' | 'months'>('days');

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
