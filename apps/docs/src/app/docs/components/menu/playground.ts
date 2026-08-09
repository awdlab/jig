import { Component, signal, viewChild } from '@angular/core';
import { AwdButton } from '@awdlab/jig/button';
import { type MenuItem, AwdMenu } from '@awdlab/jig/menu';

import { AwdDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-menu-playground',
  imports: [AwdMenu, AwdButton, AwdDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'AwdMenu', component: component() }]">
      <button
        [style.display]="component().popover() ? 'unset' : 'none'"
        ngnButton
        #anchor
        (click)="ref.show()"
      >
        Open Menu
      </button>

      <jig-menu #ref [items]="items()" [anchor]="anchor" />
    </jig-docs-playground>
  `,
})
export class AwdDocsMenuPlayground {
  protected readonly component = viewChild.required('ref', { read: AwdMenu });
  protected readonly items = signal<MenuItem[]>([
    { id: '1', label: 'Item 1' },
    { id: '2', label: 'Item 2' },
    { id: '3', label: 'Item 3' },
  ]);
}
