import { Component, signal } from '@angular/core';
import { NgnAutofocus } from '@ngneers/controls/directives';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputField } from '@ngneers/controls/input-field';
import { NgnSwitch } from '@ngneers/controls/switch';

@Component({
  selector: 'ngn-demo-autofocus-conditional',
  imports: [NgnAutofocus, NgnInput, NgnInputField, NgnSwitch],
  template: `
    <div class="flex flex-col items-start gap-3">
      <ngn-switch [(value)]="autofocus" [label]="'Autofocus the second field'" />

      <ngn-input-field [label]="'First'" class="w-72">
        <input ngnInput />
      </ngn-input-field>

      <ngn-input-field [label]="'Second'" class="w-72">
        <input ngnInput [ngnAutofocus]="autofocus()" />
      </ngn-input-field>
    </div>
  `,
})
export class Demo_Autofocus_Conditional {
  protected readonly autofocus = signal(false);
}
