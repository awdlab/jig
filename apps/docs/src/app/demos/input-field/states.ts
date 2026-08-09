import { Component } from '@angular/core';
import { JigInput } from '@awdlab/jig/input';
import { JigInputField } from '@awdlab/jig/input-field';

@Component({
  imports: [JigInput, JigInputField],
  selector: 'jig-demo-input-field-states',
  template: `
    Default:
    <jig-input-field>
      <input ngnInput value="Some Text" />
    </jig-input-field>
    Disabled:
    <jig-input-field>
      <input ngnInput value="Some Text" disabled />
    </jig-input-field>
    Readonly:
    <jig-input-field>
      <input ngnInput value="Some Text" readonly />
    </jig-input-field>
    Invalid:
    <jig-input-field>
      <input ngnInput value="Some Text" [invalidOn]="'immediate'" invalid />
    </jig-input-field>
    Invalid + Disabled:
    <jig-input-field>
      <input ngnInput value="Some Text" [invalidOn]="'immediate'" invalid disabled />
    </jig-input-field>
    Invalid + Readonly:
    <jig-input-field>
      <input ngnInput value="Some Text" [invalidOn]="'immediate'" invalid readonly />
    </jig-input-field>
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
