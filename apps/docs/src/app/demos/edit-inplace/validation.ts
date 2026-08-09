import { Component, computed, signal } from '@angular/core';
import { AwdEditInplace } from '@awdlab/jig/edit-inplace';
import { AwdErrors } from '@awdlab/jig/errors';
import { AwdHint } from '@awdlab/jig/hint';

@Component({
  selector: 'jig-demo-edit-inplace-validation',
  imports: [AwdEditInplace, AwdErrors, AwdHint],
  template: `
    <div class="flex flex-col gap-2">
      <jig-edit-inplace
        [value]="value()"
        (valueChange)="value.set($event)"
        ngnErrors
        ngnErrorsShowOn="always"
        [ngnErrorsCustom]="errors()"
        [ngnErrorsHint]="nameHint"
      />
    </div>
    <jig-hint #nameHint />
  `,
  host: { style: 'display: block; width: 220px;' },
})
export class Demo_EditInplace_Validation {
  protected readonly value = signal('');
  protected readonly errors = computed(() =>
    this.value().trim() ? null : { required: 'Enter a display value' }
  );
}
