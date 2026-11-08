import { Component } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { JigPopover } from '@awdlab/jig/popover';

import { Demo_Dummies_Lazy } from '../_shared/dummies/lazy';

@Component({
  imports: [JigPopover, JigButton, Demo_Dummies_Lazy],
  selector: 'jig-demo-popover-lazy',
  template: `
    <button jigButton #anchor (click)="popover.show()">Open</button>
    <jig-popover #popover [anchor]="anchor" [options]="{ cache: true }">
      <ng-template #lazy>
        <jig-demo-dummies-lazy />
      </ng-template>
    </jig-popover>
  `,
})
export class Demo_Popover_Lazy {}
