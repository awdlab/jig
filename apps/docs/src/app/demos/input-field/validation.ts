import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JigErrors } from '@awdlab/jig/errors';
import { JigHint } from '@awdlab/jig/hint';
import { JigInput } from '@awdlab/jig/input';
import { JigInputField } from '@awdlab/jig/input-field';

@Component({
  selector: 'jig-demo-input-field-validation',
  imports: [FormsModule, JigErrors, JigHint, JigInput, JigInputField],
  template: `
    <jig-input-field [label]="'Project name'" [labelKind]="'on'" class="w-72">
      <input jigInput name="project" ngModel required jigErrors [jigErrorsHint]="projectHint" />
    </jig-input-field>
    <jig-hint #projectHint />
  `,
})
export class Demo_InputField_Validation {}
