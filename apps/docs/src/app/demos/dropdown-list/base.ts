import { Component, signal } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { JigDropdownList } from '@awdlab/jig/dropdown-list';

import { exampleData } from '../../helper/data';

import type { JigItemsValue } from '@awdlab/jig/api';

@Component({
  selector: 'jig-demo-dropdown-list-base',
  imports: [JigButton, JigDropdownList],
  template: `
    <button type="button" jigButton #trigger (click)="dropdown.toggle()">
      {{ selectedLabel() }}
    </button>
    <jig-dropdown-list
      #dropdown
      [anchor]="trigger"
      label="Choose a country"
      [items]="options"
      [popoverOptions]="{ sizeConstraints: { width: 1, maxWidth: 1, maxHeight: '260px' } }"
      [value]="value()"
      (valueChange)="value.set($event)"
    />
  `,
})
export class Demo_DropdownList_Base {
  protected readonly options = exampleData.items.flatPreformatted;
  protected readonly value = signal<JigItemsValue<typeof this.options> | null>(null);

  protected selectedLabel(): string {
    const selected = this.options.find(option => option.value === this.value());
    return selected ? `${selected.label}` : 'Choose a country';
  }
}
