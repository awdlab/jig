import { DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { JigCalendar } from '@awdlab/jig/calendar';
import { JigInputField } from '@awdlab/jig/input-field';

@Component({
  selector: 'jig-demo-calendar-base',
  imports: [JigCalendar, JigInputField, DatePipe],
  template: `
    <jig-input-field>
      <jig-calendar [inputId]="'test-input'" [value]="value()" (valueChange)="value.set($event)" />
    </jig-input-field>
    {{ value() | date: 'medium' }}
  `,
})
export class Demo_Calendar_Base {
  protected readonly value = signal<Date | null>(new Date());
}
