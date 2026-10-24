import { DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { JigCalendar } from '@awdlab/jig/calendar';
import { JigInputField } from '@awdlab/jig/input-field';

const today = new Date();

@Component({
  selector: 'jig-demo-calendar-bounds',
  imports: [JigCalendar, JigInputField, DatePipe],
  template: `
    <jig-input-field>
      <jig-calendar
        [inputId]="'bounds-input'"
        [min]="min"
        [max]="max"
        [value]="value()"
        (valueChange)="value.set($event)"
      />
    </jig-input-field>
    {{ value() | date: 'mediumDate' }}
  `,
})
export class Demo_Calendar_Bounds {
  protected readonly min = today;
  protected readonly max = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate());
  protected readonly value = signal<Date | null>(null);
}
