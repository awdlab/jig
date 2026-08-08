import { Component, signal } from '@angular/core';
import { email, FormField, form, minLength, required } from '@angular/forms/signals';
import { NgnErrors } from '@ngneers/controls/errors';
import { NgnHint } from '@ngneers/controls/hint';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputField } from '@ngneers/controls/input-field';

@Component({
  selector: 'ngn-demo-errors-signal-forms',
  imports: [FormField, NgnErrors, NgnHint, NgnInput, NgnInputField],
  template: `
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <ngn-input-field [label]="'Email'" [labelKind]="'on'" class="w-72">
          <input ngnInput [formField]="userForm.email" ngnErrors [ngnErrorsHint]="emailHint" />
        </ngn-input-field>
        <ngn-hint #emailHint />
      </div>

      <div class="flex flex-col gap-1">
        <ngn-input-field [label]="'Password'" [labelKind]="'on'" class="w-72">
          <input
            ngnInput
            type="password"
            [formField]="userForm.password"
            ngnErrors
            [ngnErrorsHint]="passwordHint"
          />
        </ngn-input-field>
        <ngn-hint #passwordHint />
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
