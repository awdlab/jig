import { Component } from '@angular/core';
import { NgnInput } from '@awdlab/jig/input';
import { NgnInputField } from '@awdlab/jig/input-field';

@Component({
  selector: 'awd-demo-input-states',
  imports: [NgnInput, NgnInputField],
  template: `
    Default:
    <awd-input-field>
      <input ngnInput value="Some Text" />
    </awd-input-field>
    Readonly:
    <awd-input-field>
      <input ngnInput value="Some Text" readonly />
    </awd-input-field>
    Disabled:
    <awd-input-field>
      <input ngnInput value="Some Text" disabled />
    </awd-input-field>
    Invalid:
    <awd-input-field>
      <input ngnInput value="Some Text" [invalidOn]="'immediate'" invalid />
    </awd-input-field>
    Invalid + Readonly:
    <awd-input-field>
      <input ngnInput value="Some Text" [invalidOn]="'immediate'" invalid readonly />
    </awd-input-field>
    Invalid + Disabled:
    <awd-input-field>
      <input ngnInput value="Some Text" [invalidOn]="'immediate'" invalid disabled />
    </awd-input-field>
  `,
  host: { class: 'w-48' },
})
export class Demo_Input_States {}
