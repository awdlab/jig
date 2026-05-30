import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnCalendar } from '@ngneers/controls/calendar';
import { NgnInputField } from '@ngneers/controls/input-field';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-demo-calendar-time',
  imports: [NgnCalendar, NgnInputField],
  template: `<ngn-input-field>
    <ngn-calendar [inputId]="'test-input'" [showTime]="true" />
  </ngn-input-field>`,
})
export class Demo_Calendar_Time {}
