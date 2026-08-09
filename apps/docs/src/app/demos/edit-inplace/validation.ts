import { Component, computed, signal } from '@angular/core';
import { JigEditInplace } from '@awdlab/jig/edit-inplace';
import { JigErrors } from '@awdlab/jig/errors';
import { JigHint } from '@awdlab/jig/hint';

@Component({
  selector: 'jig-demo-edit-inplace-validation',
  imports: [JigEditInplace, JigErrors, JigHint],
  template: `
    <div class="flex flex-col gap-2">
      <jig-edit-inplace
        [value]="value()"
        (valueChange)="value.set($event)"
        jigErrors
        jigErrorsShowOn="always"
        [jigErrorsCustom]="errors()"
        [jigErrorsHint]="nameHint"
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
