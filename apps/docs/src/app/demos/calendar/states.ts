import { Component } from '@angular/core';
import { AwdCalendar } from '@awdlab/jig/calendar';
import { AwdInputField } from '@awdlab/jig/input-field';

@Component({
  selector: 'jig-demo-calendar-states',
  imports: [AwdCalendar, AwdInputField],
  template: `
    Default:
    <jig-input-field>
      <jig-calendar [inputId]="'calendar-states-default'" />
    </jig-input-field>
    Readonly:
    <jig-input-field>
      <jig-calendar [inputId]="'calendar-states-readonly'" readonly />
    </jig-input-field>
    Disabled:
    <jig-input-field>
      <jig-calendar [inputId]="'calendar-states-disabled'" disabled />
    </jig-input-field>
    Invalid:
    <jig-input-field>
      <jig-calendar [inputId]="'calendar-states-invalid'" [invalidOn]="'immediate'" invalid />
    </jig-input-field>
    Invalid + Readonly:
    <jig-input-field>
      <jig-calendar
        [inputId]="'calendar-states-invalid-readonly'"
        [invalidOn]="'immediate'"
        invalid
        readonly
      />
    </jig-input-field>
    Invalid + Disabled:
    <jig-input-field>
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
