import { Component } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { NgnPopover } from '@ngneers/controls/popover';

import { DummyLazyComponent } from '../dummies/lazy';

@Component({
  imports: [NgnPopover, NgnButton, DummyLazyComponent],
  selector: 'ngn-demo-popover-lazy',
  template: `
    <button ngnButton #anchor (click)="popover.show()">Open</button>
    <ngn-popover #popover [anchor]="anchor" [options]="{ cache: true }">
      <ng-template #lazy>
        <dummy-lazy-test />
      </ng-template>
    </ngn-popover>
  `,
})
export class Demo_Popover_Lazy {}
