import { DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { NgnCalendar } from '@awdlab/jig/calendar';
import { NgnInputField } from '@awdlab/jig/input-field';

@Component({
  selector: 'awd-demo-calendar-base',
  imports: [NgnCalendar, NgnInputField, DatePipe],
  template: `
    <awd-input-field>
      <awd-calendar [inputId]="'test-input'" [value]="value()" (valueChange)="value.set($event)" />
    </awd-input-field>
    {{ value() | date: 'medium' }}
  `,
})
export class Demo_Calendar_Base {
  protected readonly value = signal<Date | null>(new Date());
}
