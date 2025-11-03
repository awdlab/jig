import { Component } from '@angular/core';
import { NgnPopover } from '@ngneers/controls/popover';

import { DummyLazyComponent } from '../dummies/lazy';

@Component({
  imports: [NgnPopover, DummyLazyComponent],
  selector: 'ngn-popover-lazy',
  template: `
    <button #anchor (click)="popover.open()">Open</button>
    <ngn-popover #popover [anchor]="anchor" [options]="{ cache: true }">
      <ng-template #lazy>
        <dummy-lazy-test />
      </ng-template>
    </ngn-popover>
  `,
})
export class Demo_Popover_Lazy {}
