import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { NgnDrawer } from '@ngneers/controls/drawer';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnDrawer, NgnDocsPlayground],
  template: `
    <ngn-docs-playground [controls]="[{ componentName: 'NgnDrawer', component: component() }]">
      <button (click)="open.set(true)">Open Drawer</button>
      <ngn-drawer
        #ref
        [header]="'Drawer Header'"
        [modal]="true"
        [open]="open()"
        (openChange)="open.set($event)"
      >
        Drawer Content
      </ngn-drawer>
    </ngn-docs-playground>
  `,
})
export class NgnDocsDrawerPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnDrawer });
  protected readonly open = signal(false);
}
