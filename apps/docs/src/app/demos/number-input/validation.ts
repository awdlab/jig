import { Component, computed, signal } from '@angular/core';
import { AwdErrors } from '@awdlab/jig/errors';
import { AwdHint } from '@awdlab/jig/hint';
import { AwdInputField } from '@awdlab/jig/input-field';
import { AwdNumberInput } from '@awdlab/jig/number-input';
import { AwdSpinButtons } from '@awdlab/jig/spin-buttons';

@Component({
  selector: 'jig-demo-number-input-validation',
  imports: [AwdErrors, AwdHint, AwdInputField, AwdNumberInput, AwdSpinButtons],
  template: `
    <jig-input-field [label]="'Quantity'" [labelKind]="'on'" class="w-44">
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
      <jig-spin-buttons />
    </jig-input-field>
    <jig-hint #quantityHint />
  `,
})
export class Demo_NumberInput_Validation {
  protected readonly value = signal<number | null>(0);
  protected readonly errors = computed(() =>
    (this.value() ?? 0) >= 1 ? null : { min: { min: 1, actual: this.value() } }
  );
}
