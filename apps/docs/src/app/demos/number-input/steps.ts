import { Component, signal } from '@angular/core';
import { JigInputField } from '@awdlab/jig/input-field';
import { JigNumberInput } from '@awdlab/jig/number-input';
import { JigSpinButtons } from '@awdlab/jig/spin-buttons';

@Component({
  imports: [JigNumberInput, JigInputField, JigSpinButtons],
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
