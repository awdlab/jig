import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgnErrors } from '@ngneers/controls/errors';
import { NgnHint } from '@ngneers/controls/hint';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputField } from '@ngneers/controls/input-field';

@Component({
  selector: 'ngn-demo-input-validation',
  imports: [FormsModule, NgnErrors, NgnHint, NgnInput, NgnInputField],
  template: `
    <ngn-input-field [label]="'Email'" [labelKind]="'on'" class="w-72">
      <input ngnInput name="email" ngModel required email ngnErrors [ngnErrorsHint]="emailHint" />
    </ngn-input-field>
    <ngn-hint #emailHint />
  `,
})
export class Demo_Input_Validation {}
