import { Component, computed, signal } from '@angular/core';
import { NgnEditInplace } from '@ngneers/controls/edit-inplace';
import { NgnErrors } from '@ngneers/controls/errors';
import { NgnHint } from '@ngneers/controls/hint';

@Component({
  selector: 'ngn-demo-edit-inplace-validation',
  imports: [NgnEditInplace, NgnErrors, NgnHint],
  template: `
    <div class="flex flex-col gap-2">
      <ngn-edit-inplace
        [value]="value()"
        (valueChange)="value.set($event)"
        ngnErrors
        ngnErrorsShowOn="always"
        [ngnErrorsCustom]="errors()"
        [ngnErrorsHint]="nameHint"
      />
    </div>
    <ngn-hint #nameHint />
  `,
  host: { style: 'display: block; width: 220px;' },
})
export class Demo_EditInplace_Validation {
  protected readonly value = signal('');
  protected readonly errors = computed(() =>
    this.value().trim() ? null : { required: 'Enter a display value' }
  );
}
