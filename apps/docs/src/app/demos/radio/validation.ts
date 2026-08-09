import { Component, computed, signal } from '@angular/core';
import { JigErrors } from '@awdlab/jig/errors';
import { JigHint } from '@awdlab/jig/hint';
import { JigRadio, JigRadioGroup } from '@awdlab/jig/radio';

@Component({
  selector: 'jig-demo-radio-validation',
  imports: [JigErrors, JigHint, JigRadioGroup, JigRadio],
  template: `
    <div class="flex flex-col gap-2">
      <jig-radio-group
        [value]="value()"
        (valueChange)="value.set($event)"
        ngnErrors
        ngnErrorsShowOn="always"
        [ngnErrorsCustom]="errors()"
        [ngnErrorsHint]="sizeHint"
      >
        <jig-radio value="small">Small</jig-radio>
        <jig-radio value="medium">Medium</jig-radio>
        <jig-radio value="large">Large</jig-radio>
      </jig-radio-group>
      <jig-hint #sizeHint />
    </div>
  `,
})
export class Demo_Radio_Validation {
  protected readonly value = signal<string | undefined>(undefined);
  protected readonly errors = computed(() => (this.value() ? null : { required: 'Select a size' }));
}
