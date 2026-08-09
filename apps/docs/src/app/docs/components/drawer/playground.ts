import { Component, signal, viewChild } from '@angular/core';
import { AwdButton } from '@awdlab/jig/button';
import { AwdDrawer } from '@awdlab/jig/drawer';

import { AwdDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-drawer-playground',
  imports: [AwdDrawer, AwdButton, AwdDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'AwdDrawer', component: component() }]">
      <button ngnButton (click)="open.set(true)">Open Drawer</button>
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
export class AwdDocsDrawerPlayground {
  protected readonly component = viewChild.required('ref', { read: AwdDrawer });
  protected readonly open = signal(false);
}
