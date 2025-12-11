import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { NgnCalendar } from '@ngneers/controls/calendar';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-demo-calendar-base',
  imports: [NgnCalendar],
  template: `
    <ngn-calendar [inputId]="'test-input'" [value]="value()" (valueChange)="value.set($event)" />
    {{ value() }}
  `,
})
export class Demo_Calendar_Base {
  protected readonly value = signal<Date | null>(new Date());
}
