import { Component } from '@angular/core';
import { NgnInputField } from '@awdlab/jig/input-field';
import { NgnSelect } from '@awdlab/jig/select';

import { exampleData } from '../../helper/data';

@Component({
  imports: [NgnSelect, NgnInputField],
  selector: 'awd-demo-select-templates',
  template: `<awd-input-field>
    <awd-select #select [options]="options">
      <ng-template #item let-option>
        <span>🏳️{{ option.label }}</span>
      </ng-template>
      <ng-template #group let-option>
        <span>🌍{{ option.label }}</span>
      </ng-template>
      <ng-template #selectedItem let-option>
        <span>
          @if (option) {
            ✅{{ option.label }}
          } @else {
            &ZeroWidthSpace;
          }
        </span>
      </ng-template>
    </awd-select>
  </awd-input-field>`,
  host: { class: 'w-48' },
})
export class Demo_Select_Templates {
  protected readonly options = exampleData.items.groupedPreformatted;
}
