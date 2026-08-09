import { Component, computed, signal } from '@angular/core';
import { JigCheckbox } from '@awdlab/jig/checkbox';
import { JigErrors } from '@awdlab/jig/errors';
import { JigHint } from '@awdlab/jig/hint';

@Component({
  selector: 'jig-demo-checkbox-validation',
  imports: [JigCheckbox, JigErrors, JigHint],
  template: `
    <div class="flex flex-col gap-2">
      <jig-checkbox
        [value]="accepted()"
        (valueChange)="accepted.set($event)"
        jigErrors
        jigErrorsShowOn="always"
        [jigErrorsCustom]="errors()"
        [jigErrorsHint]="termsHint"
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
