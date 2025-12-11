import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { NgnCalendar } from '@ngneers/controls/calendar';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-demo-calendar-inline-time',
  imports: [NgnCalendar],
  template: `
    <ngn-calendar
      [inputId]="'test-input'"
      [inline]="true"
      [value]="value()"
      (valueChange)="value.set($event)"
      [showTime]="true"
    />
    {{ value() }}
  `,
})
export class Demo_Calendar_InlineTime {
  protected readonly value = signal<Date | null>(new Date());
}
