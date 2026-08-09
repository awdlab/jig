import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JigErrors } from '@awdlab/jig/errors';
import { JigHint } from '@awdlab/jig/hint';
import { JigInput } from '@awdlab/jig/input';
import { JigInputField } from '@awdlab/jig/input-field';

@Component({
  selector: 'jig-demo-input-validation',
  imports: [FormsModule, JigErrors, JigHint, JigInput, JigInputField],
  template: `
    <jig-input-field [label]="'Email'" [labelKind]="'on'" class="w-72">
      <input jigInput name="email" ngModel required email jigErrors [jigErrorsHint]="emailHint" />
    </jig-input-field>
    <jig-hint #emailHint />
  `,
})
export class Demo_Input_Validation {}
