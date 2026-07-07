import { Component, computed, signal } from '@angular/core';
import { NgnErrors } from '@ngneers/controls/errors';
import { NgnHint } from '@ngneers/controls/hint';
import { NgnRadio, NgnRadioGroup } from '@ngneers/controls/radio';

@Component({
  selector: 'ngn-demo-radio-validation',
  imports: [NgnErrors, NgnHint, NgnRadioGroup, NgnRadio],
  template: `
    <div class="flex flex-col gap-2">
      <ngn-radio-group
        [value]="value()"
        (valueChange)="value.set($event)"
        ngnErrors
        ngnErrorsShowOn="always"
        [ngnErrorsCustom]="errors()"
        [ngnErrorsHint]="sizeHint"
      >
        <ngn-radio value="small">Small</ngn-radio>
        <ngn-radio value="medium">Medium</ngn-radio>
        <ngn-radio value="large">Large</ngn-radio>
      </ngn-radio-group>
      <ngn-hint #sizeHint />
    </div>
  `,
})
export class Demo_Radio_Validation {
  protected readonly value = signal<string | undefined>(undefined);
  protected readonly errors = computed(() => (this.value() ? null : { required: 'Select a size' }));
}
