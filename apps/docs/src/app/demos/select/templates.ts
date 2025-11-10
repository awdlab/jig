import { Component } from '@angular/core';
import { NgnSelect } from '@ngneers/controls/select';

import { exampleData } from '../../helper/data';

@Component({
  imports: [NgnSelect],
  selector: 'ngn-demo-select-templates',
  template: `<ngn-select #select [options]="options">
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
  </ngn-select>`,
})
export class Demo_Select_Templates {
  protected readonly options = exampleData.items.groupedPreformatted;
}
