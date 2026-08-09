import { Component, signal } from '@angular/core';
import { JigInputField } from '@awdlab/jig/input-field';
import { JigNumberInput } from '@awdlab/jig/number-input';
import { JigSpinButtons } from '@awdlab/jig/spin-buttons';

@Component({
  imports: [JigNumberInput, JigInputField, JigSpinButtons],
  selector: 'jig-demo-number-input-base',
  template: `
    <div class="flex flex-wrap items-start gap-6">
      <!-- Stacked (default): both chevrons at the trailing edge -->
      <jig-input-field [label]="'Stacked'" [labelKind]="'on'" class="w-44">
        <input ngnNumberInput [min]="0" [max]="100" [(value)]="value" />
        <jig-spin-buttons />
      </jig-input-field>

      <!-- Inline: both buttons side by side at the trailing edge -->
      <jig-input-field [label]="'Inline'" [labelKind]="'on'" class="w-44">
        <input ngnNumberInput [min]="0" [max]="100" [(value)]="value" />
        <jig-spin-buttons [kind]="'inline'" />
      </jig-input-field>

      <!-- Flanking: one button on each side of the input -->
      <jig-input-field [label]="'Flanking'" [labelKind]="'on'" class="w-44">
        <jig-spin-buttons buttons="decrement" />
        <input ngnNumberInput class="text-center" [min]="0" [max]="100" [(value)]="value" />
        <jig-spin-buttons buttons="increment" />
      </jig-input-field>
    </div>
    <p class="mt-3">shared value: {{ value() }}</p>
  `,
})
export class Demo_NumberInput_Base {
  // Shared across all three fields, so stepping one reflects in the others.
  protected readonly value = signal<number | null>(5);
}
