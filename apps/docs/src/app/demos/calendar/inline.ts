import { Component } from '@angular/core';
import { JigCalendar } from '@awdlab/jig/calendar';

@Component({
  selector: 'jig-demo-calendar-inline',
  imports: [JigCalendar],
  template: ` <jig-calendar [inputId]="'test-input'" [inline]="true" /> `,
})
export class Demo_Calendar_Inline {}
