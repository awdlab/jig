import { Component } from '@angular/core';
import { AwdButton } from '@awdlab/jig/button';
import { AwdPopover } from '@awdlab/jig/popover';

import { DummyLazyComponent } from '../dummies/lazy';

@Component({
  imports: [AwdPopover, AwdButton, DummyLazyComponent],
  selector: 'jig-demo-popover-lazy',
  template: `
    <button ngnButton #anchor (click)="popover.show()">Open</button>
    <jig-popover #popover [anchor]="anchor" [options]="{ cache: true }">
      <ng-template #lazy>
        <dummy-lazy-test />
      </ng-template>
    </jig-popover>
  `,
})
export class Demo_Popover_Lazy {}
