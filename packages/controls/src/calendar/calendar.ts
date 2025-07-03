import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { NgnTemplate, valueControlBaseProvider } from '@ngneers/controls/api';

import { CalendarTemplates } from './calendar-templates';
import { CalendarDays } from './days/days';
import { CalendarMonths } from './months/months';
import { WeekDay } from './types';

@Component({
  selector: 'ngn-calendar',
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.scss'], // TODO: refactor into theme
  imports: [NgTemplateOutlet, NgnTemplate, CalendarMonths, CalendarDays],
  providers: [valueControlBaseProvider(Calendar)],
})
export class Calendar extends CalendarTemplates {
  protected readonly year = computed(() => this.value()?.getFullYear() || new Date().getFullYear());
  protected readonly month = computed(() => this.value()?.getMonth() || new Date().getMonth());
  protected readonly firstDayOfWeek = input<WeekDay>('monday');
}
