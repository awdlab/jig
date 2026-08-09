import { Component, signal, viewChild } from '@angular/core';
import { NgnButton } from '@awdlab/jig/button';
import { NgnDialog } from '@awdlab/jig/dialog';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'awd-docs-dialog-playground',
  imports: [NgnDialog, NgnButton, NgnDocsPlayground],
  template: `
    <awd-docs-playground [controls]="[{ componentName: 'NgnDialog', component: component() }]">
      <button ngnButton (click)="open.set(true)">Open Dialog</button>
      <awd-dialog
        #ref
        [title]="'Dialog Title'"
        [open]="open()"
        [modal]="true"
        (openChange)="open.set($event)"
      >
        Dialog Content
      </awd-dialog>
    </awd-docs-playground>
  `,
})
export class NgnDocsDialogPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnDialog });
  protected readonly open = signal(false);
}
