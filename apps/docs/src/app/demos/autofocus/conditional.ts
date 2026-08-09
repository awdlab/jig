import { Component, signal } from '@angular/core';
import { AwdAutofocus } from '@awdlab/jig/directives';
import { AwdInput } from '@awdlab/jig/input';
import { AwdInputField } from '@awdlab/jig/input-field';
import { AwdSwitch } from '@awdlab/jig/switch';

@Component({
  selector: 'jig-demo-autofocus-conditional',
  imports: [AwdAutofocus, AwdInput, AwdInputField, AwdSwitch],
  template: `
    <div class="flex flex-col items-start gap-3">
      <jig-switch [(value)]="autofocus" [label]="'Autofocus the second field'" />

      <jig-input-field [label]="'First'" class="w-72">
        <input ngnInput />
      </jig-input-field>

      <jig-input-field [label]="'Second'" class="w-72">
        <input ngnInput [ngnAutofocus]="autofocus()" />
      </jig-input-field>
    </div>
  `,
})
export class Demo_Autofocus_Conditional {
  protected readonly autofocus = signal(false);
}
