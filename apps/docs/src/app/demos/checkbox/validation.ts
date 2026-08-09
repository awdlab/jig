import { Component, computed, signal } from '@angular/core';
import { AwdCheckbox } from '@awdlab/jig/checkbox';
import { AwdErrors } from '@awdlab/jig/errors';
import { AwdHint } from '@awdlab/jig/hint';

@Component({
  selector: 'jig-demo-checkbox-validation',
  imports: [AwdCheckbox, AwdErrors, AwdHint],
  template: `
    <div class="flex flex-col gap-2">
      <jig-checkbox
        [value]="accepted()"
        (valueChange)="accepted.set($event)"
        ngnErrors
        ngnErrorsShowOn="always"
        [ngnErrorsCustom]="errors()"
        [ngnErrorsHint]="termsHint"
      />
    </div>
    <jig-hint #termsHint />
  `,
})
export class Demo_Checkbox_Validation {
  protected readonly accepted = signal(false);
  protected readonly errors = computed(() =>
    this.accepted() ? null : { required: 'Accept the terms to continue' }
  );
}
