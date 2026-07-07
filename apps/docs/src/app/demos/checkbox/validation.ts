import { Component, computed, signal } from '@angular/core';
import { NgnCheckbox } from '@ngneers/controls/checkbox';
import { NgnErrors } from '@ngneers/controls/errors';
import { NgnHint } from '@ngneers/controls/hint';

@Component({
  selector: 'ngn-demo-checkbox-validation',
  imports: [NgnCheckbox, NgnErrors, NgnHint],
  template: `
    <div class="flex flex-col gap-2">
      <ngn-checkbox
        [value]="accepted()"
        (valueChange)="accepted.set($event)"
        ngnErrors
        ngnErrorsShowOn="always"
        [ngnErrorsCustom]="errors()"
        [ngnErrorsHint]="termsHint"
      />
    </div>
    <ngn-hint #termsHint />
  `,
})
export class Demo_Checkbox_Validation {
  protected readonly accepted = signal(false);
  protected readonly errors = computed(() =>
    this.accepted() ? null : { required: 'Accept the terms to continue' }
  );
}
