import { Component, computed, signal } from '@angular/core';
import { NgnErrors } from '@ngneers/controls/errors';
import { NgnHint } from '@ngneers/controls/hint';
import { NgnSelectButton } from '@ngneers/controls/select-button';

@Component({
  selector: 'ngn-demo-select-button-validation',
  imports: [NgnErrors, NgnHint, NgnSelectButton],
  template: `
    <div class="flex flex-col gap-2">
      <ngn-select-button
        [options]="options"
        [value]="value()"
        (valueChange)="value.set($event)"
        ngnErrors
        ngnErrorsShowOn="always"
        [ngnErrorsCustom]="errors()"
        [ngnErrorsHint]="priorityHint"
      />
    </div>
    <ngn-hint #priorityHint />
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
