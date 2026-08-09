import { Component, computed, signal } from '@angular/core';
import { JigErrors } from '@awdlab/jig/errors';
import { JigHint } from '@awdlab/jig/hint';
import { JigSelectButton } from '@awdlab/jig/select-button';

@Component({
  selector: 'jig-demo-select-button-validation',
  imports: [JigErrors, JigHint, JigSelectButton],
  template: `
    <div class="flex flex-col gap-2">
      <jig-select-button
        [options]="options"
        [value]="value()"
        (valueChange)="value.set($event)"
        ngnErrors
        ngnErrorsShowOn="always"
        [ngnErrorsCustom]="errors()"
        [ngnErrorsHint]="priorityHint"
      />
    </div>
    <jig-hint #priorityHint />
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
