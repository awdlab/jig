import { Component, signal, viewChild } from '@angular/core';
import { NgnButton } from '@awdlab/jig/button';
import { NgnDrawer } from '@awdlab/jig/drawer';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'awd-docs-drawer-playground',
  imports: [NgnDrawer, NgnButton, NgnDocsPlayground],
  template: `
    <awd-docs-playground [controls]="[{ componentName: 'NgnDrawer', component: component() }]">
      <button ngnButton (click)="open.set(true)">Open Drawer</button>
      <awd-drawer
        #ref
        [header]="'Drawer Header'"
        [modal]="true"
        [open]="open()"
        (openChange)="open.set($event)"
      >
        Drawer Content
      </awd-drawer>
    </awd-docs-playground>
  `,
})
export class NgnDocsDrawerPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnDrawer });
  protected readonly open = signal(false);
}
