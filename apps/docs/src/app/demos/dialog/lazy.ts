import { Component, signal } from '@angular/core';
import { NgnDialog } from '@ngneers/controls/dialog';

import { DummyLazyComponent } from '../dummies/lazy';

@Component({
  imports: [NgnDialog, DummyLazyComponent],
  template: `<button (click)="open.set(true)">Open Dialog</button>
    <ngn-dialog [open]="open()" (openChange)="open.set($event)">
      <ng-template #content>
        <dummy-lazy-test />
      </ng-template>
    </ngn-dialog>`,
})
export class Demo_Dialog_Lazy {
  protected readonly open = signal(false);
}
