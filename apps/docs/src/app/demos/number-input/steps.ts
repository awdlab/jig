import { Component, signal } from '@angular/core';
import { AwdInputField } from '@awdlab/jig/input-field';
import { AwdNumberInput } from '@awdlab/jig/number-input';
import { AwdSpinButtons } from '@awdlab/jig/spin-buttons';

@Component({
  imports: [AwdNumberInput, AwdInputField, AwdSpinButtons],
  selector: 'jig-demo-number-input-steps',
  template: `
    <jig-input-field [label]="'Opacity (0 – 1, step 0.1)'" [labelKind]="'on'">
      <input
        ngnNumberInput
        [min]="0"
        [max]="1"
        [step]="0.1"
        [bigStep]="0.5"
        [value]="value()"
        (valueChange)="value.set($event)"
      />
      <jig-spin-buttons />
    </jig-input-field>
    value: {{ value() }}
  `,
})
export class Demo_NumberInput_Steps {
  protected readonly value = signal<number | null>(0.5);
}
