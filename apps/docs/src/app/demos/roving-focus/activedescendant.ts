import { Component } from '@angular/core';
import { JigRovingGroup, JigRovingItem } from '@awdlab/jig/roving-focus';

@Component({
  selector: 'jig-demo-roving-focus-activedescendant',
  imports: [JigRovingGroup, JigRovingItem],
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
      border: 1px solid var(--jig-color-surface-300);
      border-radius: var(--jig-size-radius-md);
    }
    .option {
      padding: 6px 10px;
      border-radius: var(--jig-size-radius-sm);
      cursor: pointer;
    }
    .option[aria-selected='true'] {
      background: var(--jig-color-primary-500);
      color: var(--jig-color-primary-500-contrast);
    }
  `,
})
export class Demo_RovingFocus_Activedescendant {
  protected readonly fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];
}
