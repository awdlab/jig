import { Component } from '@angular/core';
import { NgnCalendar } from '@awdlab/jig/calendar';
import { NgnInputField } from '@awdlab/jig/input-field';

@Component({
  selector: 'awd-demo-calendar-states',
  imports: [NgnCalendar, NgnInputField],
  template: `
    Default:
    <awd-input-field>
      <awd-calendar [inputId]="'calendar-states-default'" />
    </awd-input-field>
    Readonly:
    <awd-input-field>
      <awd-calendar [inputId]="'calendar-states-readonly'" readonly />
    </awd-input-field>
    Disabled:
    <awd-input-field>
      <awd-calendar [inputId]="'calendar-states-disabled'" disabled />
    </awd-input-field>
    Invalid:
    <awd-input-field>
      <awd-calendar [inputId]="'calendar-states-invalid'" [invalidOn]="'immediate'" invalid />
    </awd-input-field>
    Invalid + Readonly:
    <awd-input-field>
      <awd-calendar
        [inputId]="'calendar-states-invalid-readonly'"
        [invalidOn]="'immediate'"
        invalid
        readonly
      />
    </awd-input-field>
    Invalid + Disabled:
    <awd-input-field>
      <awd-calendar
        [inputId]="'calendar-states-invalid-disabled'"
        [invalidOn]="'immediate'"
        invalid
        disabled
      />
    </awd-input-field>
  `,
  host: { class: 'w-48' },
})
export class Demo_Calendar_States {}
