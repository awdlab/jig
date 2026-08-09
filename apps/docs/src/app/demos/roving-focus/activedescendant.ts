import { Component } from '@angular/core';
import { NgnRovingGroup, NgnRovingItem } from '@awdlab/jig/roving-focus';

@Component({
  selector: 'awd-demo-roving-focus-activedescendant',
  imports: [NgnRovingGroup, NgnRovingItem],
  template: `
    <div
      ngnRovingGroup
      rovingMode="activedescendant"
      orientation="vertical"
      role="listbox"
      aria-label="Fruit"
      tabindex="0"
      class="listbox"
    >
      @for (fruit of fruits; track fruit) {
        <div
          ngnRovingItem
          #item="ngnRovingItem"
          role="option"
          [attr.aria-selected]="item.isActive()"
          class="option"
        >
          {{ fruit }}
        </div>
      }
    </div>
  `,
  styles: `
    .listbox {
      width: 220px;
      padding: 4px;
      border: 1px solid var(--awd-color-surface-300);
      border-radius: var(--awd-size-radius-md);
    }
    .option {
      padding: 6px 10px;
      border-radius: var(--awd-size-radius-sm);
      cursor: pointer;
    }
    .option[aria-selected='true'] {
      background: var(--awd-color-primary-500);
      color: var(--awd-color-primary-500-contrast);
    }
  `,
})
export class Demo_RovingFocus_Activedescendant {
  protected readonly fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];
}
