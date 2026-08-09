import { Component, signal, viewChild } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { JigDialog } from '@awdlab/jig/dialog';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-dialog-playground',
  imports: [JigDialog, JigButton, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigDialog', component: component() }]">
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
export class JigDocsDialogPlayground {
  protected readonly component = viewChild.required('ref', { read: JigDialog });
  protected readonly open = signal(false);
}
