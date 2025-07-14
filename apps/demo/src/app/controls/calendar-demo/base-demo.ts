import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgnCalendar } from '@ngneers/controls/calendar';

@Component({
  imports: [FormsModule, NgnCalendar],
  selector: 'ngn-calendar-base',
  template: `
    <ngn-calendar
      [inputId]="'test-input'"
      [ngModel]="value()"
      (ngModelChange)="value.set($event)"
      [showTime]="true"
    />
    {{ value() }}
  `,
})
export class Calendar_Base_Component {
  protected readonly value = signal<Date>(new Date());
}
