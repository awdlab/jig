import { Component } from '@angular/core';
import { AwdCalendar } from '@awdlab/jig/calendar';

@Component({
  selector: 'jig-demo-calendar-inline-time',
  imports: [AwdCalendar],
  template: ` <jig-calendar [inputId]="'test-input'" [inline]="true" [showTime]="true" /> `,
})
export class Demo_Calendar_InlineTime {}
