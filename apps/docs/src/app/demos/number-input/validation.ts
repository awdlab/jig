import { Component, computed, signal } from '@angular/core';
import { NgnErrors } from '@ngneers/controls/errors';
import { NgnHint } from '@ngneers/controls/hint';
import { NgnInputField } from '@ngneers/controls/input-field';
import { NgnNumberInput } from '@ngneers/controls/number-input';
import { NgnSpinButtons } from '@ngneers/controls/spin-buttons';

@Component({
  selector: 'ngn-demo-number-input-validation',
  imports: [NgnErrors, NgnHint, NgnInputField, NgnNumberInput, NgnSpinButtons],
  template: `
    <ngn-input-field [label]="'Quantity'" [labelKind]="'on'" class="w-44">
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
      <ngn-spin-buttons />
    </ngn-input-field>
    <ngn-hint #quantityHint />
  `,
})
export class Demo_NumberInput_Validation {
  protected readonly value = signal<number | null>(0);
  protected readonly errors = computed(() =>
    (this.value() ?? 0) >= 1 ? null : { min: { min: 1, actual: this.value() } }
  );
}
