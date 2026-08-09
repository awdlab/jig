import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgnErrors } from '@awdlab/jig/errors';
import { NgnHint } from '@awdlab/jig/hint';
import { NgnInput } from '@awdlab/jig/input';
import { NgnInputField } from '@awdlab/jig/input-field';

@Component({
  selector: 'awd-demo-input-validation',
  imports: [FormsModule, NgnErrors, NgnHint, NgnInput, NgnInputField],
  template: `
    <awd-input-field [label]="'Email'" [labelKind]="'on'" class="w-72">
      <input ngnInput name="email" ngModel required email ngnErrors [ngnErrorsHint]="emailHint" />
    </awd-input-field>
    <awd-hint #emailHint />
  `,
})
export class Demo_Input_Validation {}
