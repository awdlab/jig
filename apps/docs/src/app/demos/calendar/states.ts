import { Component } from '@angular/core';
import { NgnCalendar } from '@ngneers/controls/calendar';
import { NgnInputField } from '@ngneers/controls/input-field';

@Component({
  selector: 'ngn-demo-calendar-states',
  imports: [NgnCalendar, NgnInputField],
  template: `
    Default:
    <ngn-input-field>
      <ngn-calendar [inputId]="'calendar-states-default'" />
    </ngn-input-field>
    Readonly:
    <ngn-input-field>
      <ngn-calendar [inputId]="'calendar-states-readonly'" readonly />
    </ngn-input-field>
    Disabled:
    <ngn-input-field>
      <ngn-calendar [inputId]="'calendar-states-disabled'" disabled />
    </ngn-input-field>
    Invalid:
    <ngn-input-field>
      <ngn-calendar [inputId]="'calendar-states-invalid'" invalid />
    </ngn-input-field>
    Invalid + Readonly:
    <ngn-input-field>
      <ngn-calendar [inputId]="'calendar-states-invalid-readonly'" invalid readonly />
    </ngn-input-field>
    Invalid + Disabled:
    <ngn-input-field>
      <ngn-calendar [inputId]="'calendar-states-invalid-disabled'" invalid disabled />
    </ngn-input-field>
  `,
  host: { class: 'w-48' },
})
export class Demo_Calendar_States {}
