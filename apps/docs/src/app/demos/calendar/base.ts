import { DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { NgnCalendar } from '@ngneers/controls/calendar';
import { NgnInputField } from '@ngneers/controls/input-field';

@Component({
  selector: 'ngn-demo-calendar-base',
  imports: [NgnCalendar, NgnInputField, DatePipe],
  template: `
    <ngn-input-field>
      <ngn-calendar [inputId]="'test-input'" [value]="value()" (valueChange)="value.set($event)" />
    </ngn-input-field>
    {{ value() | date: 'medium' }}
  `,
})
export class Demo_Calendar_Base {
  protected readonly value = signal<Date | null>(new Date());
}
