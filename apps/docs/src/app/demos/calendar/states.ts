import { Component } from '@angular/core';
import { JigCalendar } from '@awdlab/jig/calendar';
import { JigInputField } from '@awdlab/jig/input-field';

@Component({
  selector: 'jig-demo-calendar-states',
  imports: [JigCalendar, JigInputField],
  template: `
    <jig-input-field [label]="'Default'">
      <jig-calendar [inputId]="'calendar-states-default'" />
    </jig-input-field>
    <jig-input-field [label]="'Readonly'">
      <jig-calendar [inputId]="'calendar-states-readonly'" readonly />
    </jig-input-field>
    <jig-input-field [label]="'Disabled'">
      <jig-calendar [inputId]="'calendar-states-disabled'" disabled />
    </jig-input-field>
    <jig-input-field [label]="'Invalid'">
      <jig-calendar [inputId]="'calendar-states-invalid'" [invalidOn]="'immediate'" invalid />
    </jig-input-field>
    <jig-input-field [label]="'Invalid + Readonly'">
      <jig-calendar
        [inputId]="'calendar-states-invalid-readonly'"
        [invalidOn]="'immediate'"
        invalid
        readonly
      />
    </jig-input-field>
    <jig-input-field [label]="'Invalid + Disabled'">
      <jig-calendar
        [inputId]="'calendar-states-invalid-disabled'"
        [invalidOn]="'immediate'"
        invalid
        disabled
      />
    </jig-input-field>
  `,
  host: { class: 'w-48' },
})
export class Demo_Calendar_States {}
