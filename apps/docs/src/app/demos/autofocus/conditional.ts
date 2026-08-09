import { Component, signal } from '@angular/core';
import { NgnAutofocus } from '@awdlab/jig/directives';
import { NgnInput } from '@awdlab/jig/input';
import { NgnInputField } from '@awdlab/jig/input-field';
import { NgnSwitch } from '@awdlab/jig/switch';

@Component({
  selector: 'awd-demo-autofocus-conditional',
  imports: [NgnAutofocus, NgnInput, NgnInputField, NgnSwitch],
  template: `
    <div class="flex flex-col items-start gap-3">
      <awd-switch [(value)]="autofocus" [label]="'Autofocus the second field'" />

      <awd-input-field [label]="'First'" class="w-72">
        <input ngnInput />
      </awd-input-field>

      <awd-input-field [label]="'Second'" class="w-72">
        <input ngnInput [ngnAutofocus]="autofocus()" />
      </awd-input-field>
    </div>
  `,
})
export class Demo_Autofocus_Conditional {
  protected readonly autofocus = signal(false);
}
