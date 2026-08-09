import { Component } from '@angular/core';
import { JigCalendar } from '@awdlab/jig/calendar';
import { JigInputField } from '@awdlab/jig/input-field';

@Component({
  selector: 'jig-demo-calendar-time',
  imports: [JigCalendar, JigInputField],
  template: `<jig-input-field>
    <jig-calendar [inputId]="'test-input'" [showTime]="true" [format]="'MM/dd/yyyy h:mm a'" />
  </jig-input-field>`,
})
export class Demo_Calendar_Time {}
