import { Component, computed, signal } from '@angular/core';
import { NgnErrors } from '@awdlab/jig/errors';
import { NgnHint } from '@awdlab/jig/hint';
import { NgnRadio, NgnRadioGroup } from '@awdlab/jig/radio';

@Component({
  selector: 'awd-demo-radio-validation',
  imports: [NgnErrors, NgnHint, NgnRadioGroup, NgnRadio],
  template: `
    <div class="flex flex-col gap-2">
      <awd-radio-group
        [value]="value()"
        (valueChange)="value.set($event)"
        ngnErrors
        ngnErrorsShowOn="always"
        [ngnErrorsCustom]="errors()"
        [ngnErrorsHint]="sizeHint"
      >
        <awd-radio value="small">Small</awd-radio>
        <awd-radio value="medium">Medium</awd-radio>
        <awd-radio value="large">Large</awd-radio>
      </awd-radio-group>
      <awd-hint #sizeHint />
    </div>
  `,
})
export class Demo_Radio_Validation {
  protected readonly value = signal<string | undefined>(undefined);
  protected readonly errors = computed(() => (this.value() ? null : { required: 'Select a size' }));
}
