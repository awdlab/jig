import { Component, signal, viewChild } from '@angular/core';
import { AwdButton } from '@awdlab/jig/button';
import { AwdDialog } from '@awdlab/jig/dialog';

import { AwdDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-dialog-playground',
  imports: [AwdDialog, AwdButton, AwdDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'AwdDialog', component: component() }]">
      <button ngnButton (click)="open.set(true)">Open Dialog</button>
      <jig-dialog
        #ref
        [title]="'Dialog Title'"
        [open]="open()"
        [modal]="true"
        (openChange)="open.set($event)"
      >
        Dialog Content
      </jig-dialog>
    </jig-docs-playground>
  `,
})
export class AwdDocsDialogPlayground {
  protected readonly component = viewChild.required('ref', { read: AwdDialog });
  protected readonly open = signal(false);
}
