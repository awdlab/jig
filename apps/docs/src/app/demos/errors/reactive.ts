import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AwdErrors } from '@awdlab/jig/errors';
import { AwdHint } from '@awdlab/jig/hint';
import { AwdInput } from '@awdlab/jig/input';
import { AwdInputField } from '@awdlab/jig/input-field';

@Component({
  selector: 'jig-demo-errors-reactive',
  imports: [ReactiveFormsModule, AwdErrors, AwdHint, AwdInput, AwdInputField],
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
