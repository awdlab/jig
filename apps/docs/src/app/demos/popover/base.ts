import { Component } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { JigPopover } from '@awdlab/jig/popover';

@Component({
  imports: [JigPopover, JigButton],
  selector: 'jig-demo-popover-base',
  template: `
    <button ngnButton #anchor (click)="popover.show()">Open</button>
    <jig-popover #popover [anchor]="anchor"> Content </jig-popover>
  `,
})
export class Demo_Popover_Base {}
