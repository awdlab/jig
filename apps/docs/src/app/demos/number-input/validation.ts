import { Component, computed, signal } from '@angular/core';
import { NgnErrors } from '@awdlab/jig/errors';
import { NgnHint } from '@awdlab/jig/hint';
import { NgnInputField } from '@awdlab/jig/input-field';
import { NgnNumberInput } from '@awdlab/jig/number-input';
import { NgnSpinButtons } from '@awdlab/jig/spin-buttons';

@Component({
  selector: 'awd-demo-number-input-validation',
  imports: [NgnErrors, NgnHint, NgnInputField, NgnNumberInput, NgnSpinButtons],
  template: `
    <awd-input-field [label]="'Quantity'" [labelKind]="'on'" class="w-44">
      <input
        ngnNumberInput
        [min]="1"
        [value]="value()"
        (valueChange)="value.set($event)"
        ngnErrors
        ngnErrorsShowOn="always"
        [ngnErrorsCustom]="errors()"
        [ngnErrorsHint]="quantityHint"
      />
      <awd-spin-buttons />
    </awd-input-field>
    <awd-hint #quantityHint />
  `,
})
export class Demo_NumberInput_Validation {
  protected readonly value = signal<number | null>(0);
  protected readonly errors = computed(() =>
    (this.value() ?? 0) >= 1 ? null : { min: { min: 1, actual: this.value() } }
  );
}
