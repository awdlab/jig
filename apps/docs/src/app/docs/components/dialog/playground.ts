import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { NgnDialog } from '@ngneers/controls/dialog';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnDialog, NgnButton, NgnDocsPlayground],
  template: `
    <ngn-docs-playground [controls]="[{ componentName: 'NgnDialog', component: component() }]">
      <button ngnButton (click)="open.set(true)">Open Dialog</button>
      <ngn-dialog
        #ref
        [title]="'Dialog Title'"
        [open]="open()"
        [modal]="true"
        (openChange)="open.set($event)"
      >
        Dialog Content
      </ngn-dialog>
    </ngn-docs-playground>
  `,
})
export class NgnDocsDialogPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnDialog });
  protected readonly open = signal(false);
}
