import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgnErrors } from '@ngneers/controls/errors';
import { NgnHint } from '@ngneers/controls/hint';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputField } from '@ngneers/controls/input-field';

@Component({
  selector: 'ngn-demo-input-field-validation',
  imports: [FormsModule, NgnErrors, NgnHint, NgnInput, NgnInputField],
  template: `
    <ngn-input-field [label]="'Project name'" [labelKind]="'on'" class="w-72">
      <input ngnInput name="project" ngModel required ngnErrors [ngnErrorsHint]="projectHint" />
    </ngn-input-field>
    <ngn-hint #projectHint />
  `,
})
export class Demo_InputField_Validation {}
