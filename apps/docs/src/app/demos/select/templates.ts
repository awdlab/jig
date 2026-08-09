import { Component } from '@angular/core';
import { AwdInputField } from '@awdlab/jig/input-field';
import { AwdSelect } from '@awdlab/jig/select';

import { exampleData } from '../../helper/data';

@Component({
  imports: [AwdSelect, AwdInputField],
  selector: 'jig-demo-select-templates',
  template: `<jig-input-field>
    <jig-select #select [options]="options">
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
    </jig-select>
  </jig-input-field>`,
  host: { class: 'w-48' },
})
export class Demo_Select_Templates {
  protected readonly options = exampleData.items.groupedPreformatted;
}
