import { Component, signal } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { JigDialog } from '@awdlab/jig/dialog';

import { Demo_Dummies_Lazy } from '../_shared/dummies/lazy';

@Component({
  selector: 'jig-demo-dialog-lazy',
  imports: [JigDialog, JigButton, Demo_Dummies_Lazy],
  template: `<button jigButton (click)="open.set(true)">Open Dialog</button>
    <jig-dialog [open]="open()" (openChange)="open.set($event)" [lazy]="true">
      <ng-template #content>
        <jig-demo-dummies-lazy />
      </ng-template>
    </jig-dialog>`,
})
export class Demo_Dialog_Lazy {
  protected readonly open = signal(false);
}
