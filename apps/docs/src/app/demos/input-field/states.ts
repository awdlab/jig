import { Component } from '@angular/core';
import { NgnInput } from '@awdlab/jig/input';
import { NgnInputField } from '@awdlab/jig/input-field';

@Component({
  imports: [NgnInput, NgnInputField],
  selector: 'awd-demo-input-field-states',
  template: `
    Default:
    <awd-input-field>
      <input ngnInput value="Some Text" />
    </awd-input-field>
    Disabled:
    <awd-input-field>
      <input ngnInput value="Some Text" disabled />
    </awd-input-field>
    Readonly:
    <awd-input-field>
      <input ngnInput value="Some Text" readonly />
    </awd-input-field>
    Invalid:
    <awd-input-field>
      <input ngnInput value="Some Text" [invalidOn]="'immediate'" invalid />
    </awd-input-field>
    Invalid + Disabled:
    <awd-input-field>
      <input ngnInput value="Some Text" [invalidOn]="'immediate'" invalid disabled />
    </awd-input-field>
    Invalid + Readonly:
    <awd-input-field>
      <input ngnInput value="Some Text" [invalidOn]="'immediate'" invalid readonly />
    </awd-input-field>
  `,
  styles: `
    :host {
      display: grid;
      grid-template-columns: fit-content(200px) 1fr;
      gap: 1rem;
      align-items: center;
    }
  `,
})
export class Demo_InputField_States {}
