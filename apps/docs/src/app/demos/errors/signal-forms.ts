import { Component, signal } from '@angular/core';
import { email, FormField, form, minLength, required } from '@angular/forms/signals';
import { JigErrors } from '@awdlab/jig/errors';
import { JigHint } from '@awdlab/jig/hint';
import { JigInput } from '@awdlab/jig/input';
import { JigInputField } from '@awdlab/jig/input-field';

@Component({
  selector: 'jig-demo-errors-signal-forms',
  imports: [FormField, JigErrors, JigHint, JigInput, JigInputField],
  template: `
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <jig-input-field [label]="'Email'" [labelKind]="'on'" class="w-72">
          <input jigInput [formField]="userForm.email" jigErrors [jigErrorsHint]="emailHint" />
        </jig-input-field>
        <jig-hint #emailHint />
      </div>

      <div class="flex flex-col gap-1">
        <jig-input-field [label]="'Password'" [labelKind]="'on'" class="w-72">
          <input
            jigInput
            type="password"
            [formField]="userForm.password"
            jigErrors
            [jigErrorsHint]="passwordHint"
          />
        </jig-input-field>
        <jig-hint #passwordHint />
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
