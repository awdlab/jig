import { Component, signal } from '@angular/core';
import { AwdInputField } from '@awdlab/jig/input-field';
import { AwdNumberInput } from '@awdlab/jig/number-input';
import { AwdSpinButtons } from '@awdlab/jig/spin-buttons';

@Component({
  imports: [AwdNumberInput, AwdInputField, AwdSpinButtons],
  selector: 'jig-demo-number-input-locale',
  template: `
    <div class="flex flex-col gap-4">
      <jig-input-field [label]="'Amount (de-DE)'" [labelKind]="'on'">
        <input
          ngnNumberInput
          locale="de-DE"
          [step]="0.5"
          [formatOptions]="{ minimumFractionDigits: 2 }"
          [value]="value()"
          (valueChange)="value.set($event)"
        />
        <jig-spin-buttons />
      </jig-input-field>
      <jig-input-field [label]="'Amount (en-US)'" [labelKind]="'on'">
        <input
          ngnNumberInput
          locale="en-US"
          [step]="0.5"
          [formatOptions]="{ minimumFractionDigits: 2 }"
          [value]="value()"
          (valueChange)="value.set($event)"
        />
        <jig-spin-buttons />
      </jig-input-field>
    </div>
    value: {{ value() }}
  `,
})
export class Demo_NumberInput_Locale {
  protected readonly value = signal<number | null>(1234.5);
}
