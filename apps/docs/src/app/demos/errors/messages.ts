import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgnErrors } from '@awdlab/jig/errors';
import { NgnHint } from '@awdlab/jig/hint';
import { NgnInput } from '@awdlab/jig/input';
import { NgnInputField } from '@awdlab/jig/input-field';

import type { NgnErrorsMessages } from '@awdlab/jig/errors';

@Component({
  selector: 'awd-demo-errors-messages',
  imports: [ReactiveFormsModule, NgnErrors, NgnHint, NgnInput, NgnInputField],
  template: `
    <div class="flex flex-col gap-1">
      <awd-input-field [label]="'Coupon code'" [labelKind]="'on'" class="w-72">
        <input
          ngnInput
          [formControl]="code"
          ngnErrors
          ngnErrorsMode="all"
          ngnErrorsShowOn="dirty"
          [ngnErrorsMessages]="messages"
          [ngnErrorsHint]="codeHint"
        />
      </awd-input-field>
      <awd-hint #codeHint />
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
