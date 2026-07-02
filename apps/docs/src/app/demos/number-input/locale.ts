import { Component, signal } from '@angular/core';
import { NgnInputField } from '@ngneers/controls/input-field';
import { NgnNumberInput } from '@ngneers/controls/number-input';
import { NgnSpinButtons } from '@ngneers/controls/spin-buttons';

@Component({
  imports: [NgnNumberInput, NgnInputField, NgnSpinButtons],
  selector: 'ngn-demo-number-input-locale',
  template: `
    <div class="flex flex-col gap-4">
      <ngn-input-field [label]="'Amount (de-DE)'" [labelKind]="'on'">
        <input
          ngnNumberInput
          locale="de-DE"
          [step]="0.5"
          [formatOptions]="{ minimumFractionDigits: 2 }"
          [value]="value()"
          (valueChange)="value.set($event)"
        />
        <ngn-spin-buttons />
      </ngn-input-field>
      <ngn-input-field [label]="'Amount (en-US)'" [labelKind]="'on'">
        <input
          ngnNumberInput
          locale="en-US"
          [step]="0.5"
          [formatOptions]="{ minimumFractionDigits: 2 }"
          [value]="value()"
          (valueChange)="value.set($event)"
        />
        <ngn-spin-buttons />
      </ngn-input-field>
    </div>
    value: {{ value() }}
  `,
})
export class Demo_NumberInput_Locale {
  protected readonly value = signal<number | null>(1234.5);
}
