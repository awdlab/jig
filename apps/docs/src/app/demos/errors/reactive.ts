import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgnErrors } from '@awdlab/jig/errors';
import { NgnHint } from '@awdlab/jig/hint';
import { NgnInput } from '@awdlab/jig/input';
import { NgnInputField } from '@awdlab/jig/input-field';

@Component({
  selector: 'awd-demo-errors-reactive',
  imports: [ReactiveFormsModule, NgnErrors, NgnHint, NgnInput, NgnInputField],
  template: `
    <div class="flex flex-col gap-1">
      <awd-input-field [label]="'Email'" [labelKind]="'on'" class="w-72">
        <input ngnInput [formControl]="email" ngnErrors [ngnErrorsHint]="emailHint" />
      </awd-input-field>
      <awd-hint #emailHint />
    </div>
  `,
})
export class Demo_Errors_Reactive {
  protected readonly email = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });
}
