import { Component } from '@angular/core';
import { NgnCalendar } from '@awdlab/jig/calendar';

@Component({
  selector: 'awd-demo-calendar-inline-time',
  imports: [NgnCalendar],
  template: ` <awd-calendar [inputId]="'test-input'" [inline]="true" [showTime]="true" /> `,
})
export class Demo_Calendar_InlineTime {}
