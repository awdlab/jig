import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgnCalendar } from '@ngneers/controls/calendar';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-demo-calendar-base',
  imports: [FormsModule, NgnCalendar],
  template: `
    <ngn-calendar
      [inputId]="'test-input'"
      [ngModel]="value()"
      (ngModelChange)="value.set($event)"
    />
    {{ value() }}
  `,
})
export class Demo_Calendar_Base {
  protected readonly value = signal<Date>(new Date());
}
