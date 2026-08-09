import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgnErrors } from '@awdlab/jig/errors';
import { NgnHint } from '@awdlab/jig/hint';
import { NgnInput } from '@awdlab/jig/input';
import { NgnInputField } from '@awdlab/jig/input-field';

@Component({
  selector: 'awd-demo-input-field-validation',
  imports: [FormsModule, NgnErrors, NgnHint, NgnInput, NgnInputField],
  template: `
    <awd-input-field [label]="'Project name'" [labelKind]="'on'" class="w-72">
      <input ngnInput name="project" ngModel required ngnErrors [ngnErrorsHint]="projectHint" />
    </awd-input-field>
    <awd-hint #projectHint />
  `,
})
export class Demo_InputField_Validation {}
