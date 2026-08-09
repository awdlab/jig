import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AwdErrors } from '@awdlab/jig/errors';
import { AwdHint } from '@awdlab/jig/hint';
import { AwdInput } from '@awdlab/jig/input';
import { AwdInputField } from '@awdlab/jig/input-field';

@Component({
  selector: 'jig-demo-input-field-validation',
  imports: [FormsModule, AwdErrors, AwdHint, AwdInput, AwdInputField],
  template: `
    <jig-input-field [label]="'Project name'" [labelKind]="'on'" class="w-72">
      <input ngnInput name="project" ngModel required ngnErrors [ngnErrorsHint]="projectHint" />
    </jig-input-field>
    <jig-hint #projectHint />
  `,
})
export class Demo_InputField_Validation {}
