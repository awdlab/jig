import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnInputField } from '@ngneers/controls/input-field';
import { NgnSelect } from '@ngneers/controls/select';

import { exampleData } from '../../helper/data';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnSelect, NgnInputField],
  selector: 'ngn-demo-select-templates',
  template: `<ngn-input-field>
    <ngn-select #select [options]="options">
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
    </ngn-select>
  </ngn-input-field>`,
  host: { class: 'w-48' },
})
export class Demo_Select_Templates {
  protected readonly options = exampleData.items.groupedPreformatted;
}
