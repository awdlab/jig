import { Component, computed, signal } from '@angular/core';
import { JigErrors } from '@awdlab/jig/errors';
import { JigHint } from '@awdlab/jig/hint';
import { JigInputField } from '@awdlab/jig/input-field';
import { JigNumberInput } from '@awdlab/jig/number-input';
import { JigSpinButtons } from '@awdlab/jig/spin-buttons';

@Component({
  selector: 'jig-demo-number-input-validation',
  imports: [JigErrors, JigHint, JigInputField, JigNumberInput, JigSpinButtons],
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
