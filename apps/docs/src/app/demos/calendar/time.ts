import { Component } from '@angular/core';
import { NgnCalendar } from '@awdlab/jig/calendar';
import { NgnInputField } from '@awdlab/jig/input-field';

@Component({
  selector: 'awd-demo-calendar-time',
  imports: [NgnCalendar, NgnInputField],
  template: `<awd-input-field>
    <awd-calendar [inputId]="'test-input'" [showTime]="true" [format]="'MM/dd/yyyy h:mm a'" />
  </awd-input-field>`,
})
export class Demo_Calendar_Time {}
