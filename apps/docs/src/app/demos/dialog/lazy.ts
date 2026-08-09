import { Component, signal } from '@angular/core';
import { NgnButton } from '@awdlab/jig/button';
import { NgnDialog } from '@awdlab/jig/dialog';

import { DummyLazyComponent } from '../dummies/lazy';

@Component({
  selector: 'awd-demo-dialog-lazy',
  imports: [NgnDialog, NgnButton, DummyLazyComponent],
  template: `<button ngnButton (click)="open.set(true)">Open Dialog</button>
    <awd-dialog [open]="open()" (openChange)="open.set($event)">
      <ng-template #content>
        <dummy-lazy-test />
      </ng-template>
    </awd-dialog>`,
})
export class Demo_Dialog_Lazy {
  protected readonly open = signal(false);
}
