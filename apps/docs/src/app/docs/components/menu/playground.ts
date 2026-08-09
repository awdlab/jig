import { Component, signal, viewChild } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { type MenuItem, JigMenu } from '@awdlab/jig/menu';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-menu-playground',
  imports: [JigMenu, JigButton, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigMenu', component: component() }]">
      <button
        [style.display]="component().popover() ? 'unset' : 'none'"
        jigButton
        #anchor
        (click)="ref.show()"
      >
        Open Menu
      </button>

      <jig-menu #ref [items]="items()" [anchor]="anchor" />
    </jig-docs-playground>
  `,
})
export class JigDocsMenuPlayground {
  protected readonly component = viewChild.required('ref', { read: JigMenu });
  protected readonly items = signal<MenuItem[]>([
    { id: '1', label: 'Item 1' },
    { id: '2', label: 'Item 2' },
    { id: '3', label: 'Item 3' },
  ]);
}
