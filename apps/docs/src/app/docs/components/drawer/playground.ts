import { Component, signal, viewChild } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { JigDrawer } from '@awdlab/jig/drawer';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-drawer-playground',
  imports: [JigDrawer, JigButton, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigDrawer', component: component() }]">
      <button jigButton (click)="open.set(true)">Open Drawer</button>
      <jig-drawer
        #ref
        [header]="'Drawer Header'"
        [modal]="true"
        [open]="open()"
        (openChange)="open.set($event)"
      >
        Drawer Content
      </jig-drawer>
    </jig-docs-playground>
  `,
})
export class JigDocsDrawerPlayground {
  protected readonly component = viewChild.required('ref', { read: JigDrawer });
  protected readonly open = signal(false);
}
