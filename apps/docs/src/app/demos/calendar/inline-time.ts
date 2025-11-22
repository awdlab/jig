import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgnCalendar } from '@ngneers/controls/calendar';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-demo-calendar-inline-time',
  imports: [FormsModule, NgnCalendar],
  template: `
    <ngn-calendar
      [inputId]="'test-input'"
      [inline]="true"
      [ngModel]="value()"
      (ngModelChange)="value.set($event)"
      [showTime]="true"
    />
    {{ value() }}
  `,
})
export class Demo_Calendar_InlineTime {
  protected readonly value = signal<Date>(new Date());
}
