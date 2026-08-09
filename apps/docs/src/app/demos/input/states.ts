import { Component } from '@angular/core';
import { JigInput } from '@awdlab/jig/input';
import { JigInputField } from '@awdlab/jig/input-field';

@Component({
  selector: 'jig-demo-input-states',
  imports: [JigInput, JigInputField],
  template: `
    Default:
    <jig-input-field>
      <input ngnInput value="Some Text" />
    </jig-input-field>
    Readonly:
    <jig-input-field>
      <input ngnInput value="Some Text" readonly />
    </jig-input-field>
    Disabled:
    <jig-input-field>
      <input ngnInput value="Some Text" disabled />
    </jig-input-field>
    Invalid:
    <jig-input-field>
      <input ngnInput value="Some Text" [invalidOn]="'immediate'" invalid />
    </jig-input-field>
    Invalid + Readonly:
    <jig-input-field>
      <input ngnInput value="Some Text" [invalidOn]="'immediate'" invalid readonly />
    </jig-input-field>
    Invalid + Disabled:
    <jig-input-field>
      <input ngnInput value="Some Text" [invalidOn]="'immediate'" invalid disabled />
    </jig-input-field>
  `,
  host: { class: 'w-48' },
})
export class Demo_Input_States {}
