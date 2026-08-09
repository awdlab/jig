import { Component } from '@angular/core';
import { NgnButton } from '@awdlab/jig/button';
import { NgnPopover } from '@awdlab/jig/popover';

import { DummyLazyComponent } from '../dummies/lazy';

@Component({
  imports: [NgnPopover, NgnButton, DummyLazyComponent],
  selector: 'awd-demo-popover-lazy',
  template: `
    <button ngnButton #anchor (click)="popover.show()">Open</button>
    <awd-popover #popover [anchor]="anchor" [options]="{ cache: true }">
      <ng-template #lazy>
        <dummy-lazy-test />
      </ng-template>
    </awd-popover>
  `,
})
export class Demo_Popover_Lazy {}
