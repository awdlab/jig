import { Component, signal } from '@angular/core';
import { NgnInputField } from '@ngneers/controls/input-field';
import { NgnNumberInput } from '@ngneers/controls/number-input';
import { NgnSpinButtons } from '@ngneers/controls/spin-buttons';

@Component({
  imports: [NgnNumberInput, NgnInputField, NgnSpinButtons],
  selector: 'ngn-demo-number-input-steps',
  template: `
    <ngn-input-field [label]="'Opacity (0 – 1, step 0.1)'" [labelKind]="'on'">
      <input
        ngnNumberInput
        [min]="0"
        [max]="1"
        [step]="0.1"
        [bigStep]="0.5"
        [value]="value()"
        (valueChange)="value.set($event)"
      />
      <ngn-spin-buttons />
    </ngn-input-field>
    value: {{ value() }}
  `,
})
export class Demo_NumberInput_Steps {
  protected readonly value = signal<number | null>(0.5);
}
