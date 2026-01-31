import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnCalendar } from '@ngneers/controls/calendar';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-demo-calendar-inline-time',
  imports: [NgnCalendar],
  template: ` <ngn-calendar [inputId]="'test-input'" [inline]="true" [showTime]="true" /> `,
})
export class Demo_Calendar_InlineTime {}
