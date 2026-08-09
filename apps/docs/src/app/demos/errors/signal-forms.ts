import { Component, signal } from '@angular/core';
import { email, FormField, form, minLength, required } from '@angular/forms/signals';
import { NgnErrors } from '@awdlab/jig/errors';
import { NgnHint } from '@awdlab/jig/hint';
import { NgnInput } from '@awdlab/jig/input';
import { NgnInputField } from '@awdlab/jig/input-field';

@Component({
  selector: 'awd-demo-errors-signal-forms',
  imports: [FormField, NgnErrors, NgnHint, NgnInput, NgnInputField],
  template: `
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <awd-input-field [label]="'Email'" [labelKind]="'on'" class="w-72">
          <input ngnInput [formField]="userForm.email" ngnErrors [ngnErrorsHint]="emailHint" />
        </awd-input-field>
        <awd-hint #emailHint />
      </div>

      <div class="flex flex-col gap-1">
        <awd-input-field [label]="'Password'" [labelKind]="'on'" class="w-72">
          <input
            ngnInput
            type="password"
            [formField]="userForm.password"
            ngnErrors
            [ngnErrorsHint]="passwordHint"
          />
        </awd-input-field>
        <awd-hint #passwordHint />
      </div>
    </div>
  `,
})
export class Demo_Errors_SignalForms {
  protected readonly model = signal({ email: '', password: '' });
  protected readonly userForm = form(this.model, path => {
    required(path.email);
    email(path.email);
    required(path.password);
    minLength(path.password, 8);
  });
}
