import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { JigErrors } from '@awdlab/jig/errors';
import { JigHint } from '@awdlab/jig/hint';
import { JigInput } from '@awdlab/jig/input';
import { JigInputField } from '@awdlab/jig/input-field';

@Component({
  selector: 'jig-demo-errors-reactive',
  imports: [ReactiveFormsModule, JigErrors, JigHint, JigInput, JigInputField],
  template: `
    <div class="flex flex-col gap-1">
      <jig-input-field [label]="'Email'" [labelKind]="'on'" class="w-72">
        <input ngnInput [formControl]="email" ngnErrors [ngnErrorsHint]="emailHint" />
      </jig-input-field>
      <jig-hint #emailHint />
    </div>
  `,
})
export class Demo_Errors_Reactive {
  protected readonly email = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });
}
