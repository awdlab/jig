import { Component, computed, signal } from '@angular/core';
import { NgnErrors } from '@awdlab/jig/errors';
import { NgnHint } from '@awdlab/jig/hint';
import { NgnSelectButton } from '@awdlab/jig/select-button';

@Component({
  selector: 'awd-demo-select-button-validation',
  imports: [NgnErrors, NgnHint, NgnSelectButton],
  template: `
    <div class="flex flex-col gap-2">
      <awd-select-button
        [options]="options"
        [value]="value()"
        (valueChange)="value.set($event)"
        ngnErrors
        ngnErrorsShowOn="always"
        [ngnErrorsCustom]="errors()"
        [ngnErrorsHint]="priorityHint"
      />
    </div>
    <awd-hint #priorityHint />
  `,
})
export class Demo_SelectButton_Validation {
  protected readonly options = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
  ] as const;
  protected readonly value = signal<string | null>(null);
  protected readonly errors = computed(() =>
    this.value() ? null : { required: 'Choose a priority' }
  );
}
