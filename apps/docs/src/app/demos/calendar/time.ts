import { Component } from '@angular/core';
import { AwdCalendar } from '@awdlab/jig/calendar';
import { AwdInputField } from '@awdlab/jig/input-field';

@Component({
  selector: 'jig-demo-calendar-time',
  imports: [AwdCalendar, AwdInputField],
  template: `<jig-input-field>
    <jig-calendar [inputId]="'test-input'" [showTime]="true" [format]="'MM/dd/yyyy h:mm a'" />
  </jig-input-field>`,
})
export class Demo_Calendar_Time {}
