import { Component, signal } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { NgnDialog } from '@ngneers/controls/dialog';

import { DummyLazyComponent } from '../dummies/lazy';

@Component({
  selector: 'ngn-demo-dialog-lazy',
  imports: [NgnDialog, NgnButton, DummyLazyComponent],
  template: `<button ngnButton (click)="open.set(true)">Open Dialog</button>
    <ngn-dialog [open]="open()" (openChange)="open.set($event)">
      <ng-template #content>
        <dummy-lazy-test />
      </ng-template>
    </ngn-dialog>`,
})
export class Demo_Dialog_Lazy {
  protected readonly open = signal(false);
}
