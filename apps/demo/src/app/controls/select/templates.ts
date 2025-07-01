import { Component } from '@angular/core';
import { Select } from '@ngneers/controls/select';

import { optionsGroupedPreformatted } from './_options';

@Component({
  imports: [Select],
  template: `<ngn-select #select [options]="options">
    <ng-template #item let-option>
      <span>🏳️{{ option.label }}&ZeroWidthSpace;</span>
    </ng-template>
    <ng-template #group let-option>
      <span>🌍{{ option.label }}&ZeroWidthSpace;</span>
    </ng-template>
    <ng-template #selectedItem let-option>
      <span>
        @if (option) {
          ✅{{ option.label }}
        }
        &ZeroWidthSpace;</span
      >
    </ng-template>
  </ngn-select>`,
})
export class Select_Templates_Component {
  constructor() {}

  public readonly options = optionsGroupedPreformatted;
}
