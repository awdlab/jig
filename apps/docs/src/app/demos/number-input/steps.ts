import { Component, signal } from '@angular/core';
import { NgnInputField } from '@awdlab/jig/input-field';
import { NgnNumberInput } from '@awdlab/jig/number-input';
import { NgnSpinButtons } from '@awdlab/jig/spin-buttons';

@Component({
  imports: [NgnNumberInput, NgnInputField, NgnSpinButtons],
  selector: 'awd-demo-number-input-steps',
  template: `
    <awd-input-field [label]="'Opacity (0 – 1, step 0.1)'" [labelKind]="'on'">
      <input
        ngnNumberInput
        [min]="0"
        [max]="1"
        [step]="0.1"
        [bigStep]="0.5"
        [value]="value()"
        (valueChange)="value.set($event)"
      />
      <awd-spin-buttons />
    </awd-input-field>
    value: {{ value() }}
  `,
})
export class Demo_NumberInput_Steps {
  protected readonly value = signal<number | null>(0.5);
}
