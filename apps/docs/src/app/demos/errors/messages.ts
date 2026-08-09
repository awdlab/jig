import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { JigErrors } from '@awdlab/jig/errors';
import { JigHint } from '@awdlab/jig/hint';
import { JigInput } from '@awdlab/jig/input';
import { JigInputField } from '@awdlab/jig/input-field';

import type { JigErrorsMessages } from '@awdlab/jig/errors';

@Component({
  selector: 'jig-demo-errors-messages',
  imports: [ReactiveFormsModule, JigErrors, JigHint, JigInput, JigInputField],
  template: `
    <div class="flex flex-col gap-1">
      <jig-input-field [label]="'Coupon code'" [labelKind]="'on'" class="w-72">
        <input
          ngnInput
          [formControl]="code"
          ngnErrors
          ngnErrorsMode="all"
          ngnErrorsShowOn="dirty"
          [ngnErrorsMessages]="messages"
          [ngnErrorsHint]="codeHint"
        />
      </jig-input-field>
      <jig-hint #codeHint />
    </div>
  `,
})
export class Demo_Errors_Messages {
  protected readonly code = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(6), Validators.pattern(/^[A-Z0-9-]*$/)],
  });

  /** Static strings and resolvers that read the error's params. */
  protected readonly messages: JigErrorsMessages = {
    required: 'Enter the code from your invoice.',
    minlength: ({ params }) => `${params['requiredLength']} characters, please.`,
    pattern: 'Uppercase letters, digits and dashes only.',
  };
}
