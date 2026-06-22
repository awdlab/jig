import { Component } from '@angular/core';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputField } from '@ngneers/controls/input-field';

@Component({
  selector: 'ngn-demo-input-states',
  imports: [NgnInput, NgnInputField],
  template: `
    Default:
    <ngn-input-field>
      <input ngnInput value="Some Text" />
    </ngn-input-field>
    Readonly:
    <ngn-input-field>
      <input ngnInput value="Some Text" readonly />
    </ngn-input-field>
    Disabled:
    <ngn-input-field>
      <input ngnInput value="Some Text" disabled />
    </ngn-input-field>
    Invalid:
    <ngn-input-field>
      <input ngnInput value="Some Text" invalid />
    </ngn-input-field>
    Invalid + Readonly:
    <ngn-input-field>
      <input ngnInput value="Some Text" invalid readonly />
    </ngn-input-field>
    Invalid + Disabled:
    <ngn-input-field>
      <input ngnInput value="Some Text" invalid disabled />
    </ngn-input-field>
  `,
  host: { class: 'w-48' },
})
export class Demo_Input_States {}
