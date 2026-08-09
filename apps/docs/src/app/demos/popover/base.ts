import { Component } from '@angular/core';
import { AwdButton } from '@awdlab/jig/button';
import { AwdPopover } from '@awdlab/jig/popover';

@Component({
  imports: [AwdPopover, AwdButton],
  selector: 'jig-demo-popover-base',
  template: `
    <button ngnButton #anchor (click)="popover.show()">Open</button>
    <jig-popover #popover [anchor]="anchor"> Content </jig-popover>
  `,
})
export class Demo_Popover_Base {}
