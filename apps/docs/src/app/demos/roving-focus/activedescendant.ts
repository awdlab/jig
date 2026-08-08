import { Component } from '@angular/core';
import { NgnRovingGroup, NgnRovingItem } from '@ngneers/controls/roving-focus';

@Component({
  selector: 'ngn-demo-roving-focus-activedescendant',
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
      border: 1px solid var(--ngn-color-surface-300);
      border-radius: var(--ngn-size-radius-md);
    }
    .option {
      padding: 6px 10px;
      border-radius: var(--ngn-size-radius-sm);
      cursor: pointer;
    }
    .option[aria-selected='true'] {
      background: var(--ngn-color-primary-500);
      color: var(--ngn-color-primary-500-contrast);
    }
  `,
})
export class Demo_RovingFocus_Activedescendant {
  protected readonly fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];
}
