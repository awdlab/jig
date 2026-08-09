import { Component, computed, signal } from '@angular/core';
import { NgnCheckbox } from '@awdlab/jig/checkbox';
import { NgnErrors } from '@awdlab/jig/errors';
import { NgnHint } from '@awdlab/jig/hint';

@Component({
  selector: 'awd-demo-checkbox-validation',
  imports: [NgnCheckbox, NgnErrors, NgnHint],
  template: `
    <div class="flex flex-col gap-2">
      <awd-checkbox
        [value]="accepted()"
        (valueChange)="accepted.set($event)"
        ngnErrors
        ngnErrorsShowOn="always"
        [ngnErrorsCustom]="errors()"
        [ngnErrorsHint]="termsHint"
      />
    </div>
    <awd-hint #termsHint />
  `,
})
export class Demo_Checkbox_Validation {
  protected readonly accepted = signal(false);
  protected readonly errors = computed(() =>
    this.accepted() ? null : { required: 'Accept the terms to continue' }
  );
}
