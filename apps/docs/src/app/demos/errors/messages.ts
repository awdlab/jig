import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgnErrors } from '@ngneers/controls/errors';
import { NgnHint } from '@ngneers/controls/hint';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputField } from '@ngneers/controls/input-field';

import type { NgnErrorsMessages } from '@ngneers/controls/errors';

@Component({
  selector: 'ngn-demo-errors-messages',
  imports: [ReactiveFormsModule, NgnErrors, NgnHint, NgnInput, NgnInputField],
  template: `
    <div class="flex flex-col gap-1">
      <ngn-input-field [label]="'Coupon code'" [labelKind]="'on'" class="w-72">
        <input
          ngnInput
          [formControl]="code"
          ngnErrors
          ngnErrorsMode="all"
          ngnErrorsShowOn="dirty"
          [ngnErrorsMessages]="messages"
          [ngnErrorsHint]="codeHint"
        />
      </ngn-input-field>
      <ngn-hint #codeHint />
    </div>
  `,
})
export class Demo_Errors_Messages {
  protected readonly code = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(6), Validators.pattern(/^[A-Z0-9-]*$/)],
  });

  /** Static strings and resolvers that read the error's params. */
  protected readonly messages: NgnErrorsMessages = {
    required: 'Enter the code from your invoice.',
    minlength: ({ params }) => `${params['requiredLength']} characters, please.`,
    pattern: 'Uppercase letters, digits and dashes only.',
  };
}
