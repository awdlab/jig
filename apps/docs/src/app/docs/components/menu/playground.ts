import { Component, signal, viewChild } from '@angular/core';
import { NgnButton } from '@awdlab/jig/button';
import { type MenuItem, NgnMenu } from '@awdlab/jig/menu';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'awd-docs-menu-playground',
  imports: [NgnMenu, NgnButton, NgnDocsPlayground],
  template: `
    <awd-docs-playground [controls]="[{ componentName: 'NgnMenu', component: component() }]">
      <button
        [style.display]="component().popover() ? 'unset' : 'none'"
        ngnButton
        #anchor
        (click)="ref.show()"
      >
        Open Menu
      </button>

      <awd-menu #ref [items]="items()" [anchor]="anchor" />
    </awd-docs-playground>
  `,
})
export class NgnDocsMenuPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnMenu });
  protected readonly items = signal<MenuItem[]>([
    { id: '1', label: 'Item 1' },
    { id: '2', label: 'Item 2' },
    { id: '3', label: 'Item 3' },
  ]);
}
