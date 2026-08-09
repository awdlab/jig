import { Component, computed, signal } from '@angular/core';
import { NgnEditInplace } from '@awdlab/jig/edit-inplace';
import { NgnErrors } from '@awdlab/jig/errors';
import { NgnHint } from '@awdlab/jig/hint';

@Component({
  selector: 'awd-demo-edit-inplace-validation',
  imports: [NgnEditInplace, NgnErrors, NgnHint],
  template: `
    <div class="flex flex-col gap-2">
      <awd-edit-inplace
        [value]="value()"
        (valueChange)="value.set($event)"
        ngnErrors
        ngnErrorsShowOn="always"
        [ngnErrorsCustom]="errors()"
        [ngnErrorsHint]="nameHint"
      />
    </div>
    <awd-hint #nameHint />
  `,
  host: { style: 'display: block; width: 220px;' },
})
export class Demo_EditInplace_Validation {
  protected readonly value = signal('');
  protected readonly errors = computed(() =>
    this.value().trim() ? null : { required: 'Enter a display value' }
  );
}
