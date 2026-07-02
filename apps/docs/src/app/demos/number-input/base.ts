import { Component, signal } from '@angular/core';
import { NgnInputField } from '@ngneers/controls/input-field';
import { NgnNumberInput } from '@ngneers/controls/number-input';
import { NgnSpinButtons } from '@ngneers/controls/spin-buttons';

@Component({
  imports: [NgnNumberInput, NgnInputField, NgnSpinButtons],
  selector: 'ngn-demo-number-input-base',
  template: `
    <div class="flex flex-wrap items-start gap-6">
      <!-- Stacked (default): both chevrons at the trailing edge -->
      <ngn-input-field [label]="'Stacked'" [labelKind]="'on'" class="w-44">
        <input ngnNumberInput [min]="0" [max]="100" [(value)]="value" />
        <ngn-spin-buttons />
      </ngn-input-field>

      <!-- Inline: both buttons side by side at the trailing edge -->
      <ngn-input-field [label]="'Inline'" [labelKind]="'on'" class="w-44">
        <input ngnNumberInput [min]="0" [max]="100" [(value)]="value" />
        <ngn-spin-buttons [kind]="'inline'" />
      </ngn-input-field>

      <!-- Flanking: one button on each side of the input -->
      <ngn-input-field [label]="'Flanking'" [labelKind]="'on'" class="w-44">
        <ngn-spin-buttons buttons="decrement" />
        <input ngnNumberInput class="text-center" [min]="0" [max]="100" [(value)]="value" />
        <ngn-spin-buttons buttons="increment" />
      </ngn-input-field>
    </div>
    <p class="mt-3">shared value: {{ value() }}</p>
  `,
})
export class Demo_NumberInput_Base {
  // Shared across all three fields, so stepping one reflects in the others.
  protected readonly value = signal<number | null>(5);
}
