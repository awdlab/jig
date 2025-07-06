import { Component, input, linkedSignal, signal } from '@angular/core';
import { NgnTemplate, valueControlBaseProvider } from '@ngneers/controls/api';

import { CalendarTemplates } from './calendar-templates';
import { CalendarDays } from './days/days';
import { CalendarMonths } from './months/months';
import { CalendarTime } from './time/time';
import { DayModel, WeekDay } from './types';

@Component({
  selector: 'ngn-calendar',
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.scss'], // TODO: refactor into theme
  imports: [NgnTemplate, CalendarMonths, CalendarDays, CalendarTime],
  providers: [valueControlBaseProvider(Calendar)],
})
export class Calendar extends CalendarTemplates {
  protected readonly year = linkedSignal(
    () => this.value()?.getFullYear() || new Date().getFullYear()
  );
  protected readonly month = linkedSignal(() => this.value()?.getMonth() || new Date().getMonth());
  protected readonly firstDayOfWeek = input<WeekDay>('monday');
  protected readonly showSeconds = input<boolean>(false);

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
    const newValue = new Date(this.year(), this.month() + day.monthOffset, day.date);
    this.value.set(newValue);
    this.onChange(newValue);
  }
}
