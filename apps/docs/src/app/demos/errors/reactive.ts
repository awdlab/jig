import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgnErrors } from '@ngneers/controls/errors';
import { NgnHint } from '@ngneers/controls/hint';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputField } from '@ngneers/controls/input-field';

@Component({
  selector: 'ngn-demo-errors-reactive',
  imports: [ReactiveFormsModule, NgnErrors, NgnHint, NgnInput, NgnInputField],
  template: `
    <div class="flex flex-col gap-1">
      <ngn-input-field [label]="'Email'" [labelKind]="'on'" class="w-72">
        <input ngnInput [formControl]="email" ngnErrors [ngnErrorsHint]="emailHint" />
      </ngn-input-field>
      <ngn-hint #emailHint />
    </div>
  `,
})
export class Demo_Errors_Reactive {
  protected readonly email = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });
}
