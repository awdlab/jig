import { DatePipe } from '@angular/common';
import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { NgnCalendar } from '@ngneers/controls/calendar';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-demo-calendar-base',
  imports: [NgnCalendar, DatePipe],
  template: `
    <ngn-calendar [inputId]="'test-input'" [value]="value()" (valueChange)="value.set($event)" />
    {{ value() | date: 'medium' }}
  `,
})
export class Demo_Calendar_Base {
  protected readonly value = signal<Date | null>(new Date());
}
