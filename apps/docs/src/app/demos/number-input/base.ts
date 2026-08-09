import { Component, signal } from '@angular/core';
import { NgnInputField } from '@awdlab/jig/input-field';
import { NgnNumberInput } from '@awdlab/jig/number-input';
import { NgnSpinButtons } from '@awdlab/jig/spin-buttons';

@Component({
  imports: [NgnNumberInput, NgnInputField, NgnSpinButtons],
  selector: 'awd-demo-number-input-base',
  template: `
    <div class="flex flex-wrap items-start gap-6">
      <!-- Stacked (default): both chevrons at the trailing edge -->
      <awd-input-field [label]="'Stacked'" [labelKind]="'on'" class="w-44">
        <input ngnNumberInput [min]="0" [max]="100" [(value)]="value" />
        <awd-spin-buttons />
      </awd-input-field>

      <!-- Inline: both buttons side by side at the trailing edge -->
      <awd-input-field [label]="'Inline'" [labelKind]="'on'" class="w-44">
        <input ngnNumberInput [min]="0" [max]="100" [(value)]="value" />
        <awd-spin-buttons [kind]="'inline'" />
      </awd-input-field>

      <!-- Flanking: one button on each side of the input -->
      <awd-input-field [label]="'Flanking'" [labelKind]="'on'" class="w-44">
        <awd-spin-buttons buttons="decrement" />
        <input ngnNumberInput class="text-center" [min]="0" [max]="100" [(value)]="value" />
        <awd-spin-buttons buttons="increment" />
      </awd-input-field>
    </div>
    <p class="mt-3">shared value: {{ value() }}</p>
  `,
})
export class Demo_NumberInput_Base {
  // Shared across all three fields, so stepping one reflects in the others.
  protected readonly value = signal<number | null>(5);
}
