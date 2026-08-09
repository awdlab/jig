import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AwdErrors } from '@awdlab/jig/errors';
import { AwdHint } from '@awdlab/jig/hint';
import { AwdInput } from '@awdlab/jig/input';
import { AwdInputField } from '@awdlab/jig/input-field';

@Component({
  selector: 'jig-demo-input-validation',
  imports: [FormsModule, AwdErrors, AwdHint, AwdInput, AwdInputField],
  template: `
    <jig-input-field [label]="'Email'" [labelKind]="'on'" class="w-72">
      <input ngnInput name="email" ngModel required email ngnErrors [ngnErrorsHint]="emailHint" />
    </jig-input-field>
    <jig-hint #emailHint />
  `,
})
export class Demo_Input_Validation {}
