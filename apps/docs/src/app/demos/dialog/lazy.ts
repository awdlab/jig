import { Component, signal } from '@angular/core';
import { AwdButton } from '@awdlab/jig/button';
import { AwdDialog } from '@awdlab/jig/dialog';

import { DummyLazyComponent } from '../dummies/lazy';

@Component({
  selector: 'jig-demo-dialog-lazy',
  imports: [AwdDialog, AwdButton, DummyLazyComponent],
  template: `<button ngnButton (click)="open.set(true)">Open Dialog</button>
    <jig-dialog [open]="open()" (openChange)="open.set($event)">
      <ng-template #content>
        <dummy-lazy-test />
      </ng-template>
    </jig-dialog>`,
})
export class Demo_Dialog_Lazy {
  protected readonly open = signal(false);
}
