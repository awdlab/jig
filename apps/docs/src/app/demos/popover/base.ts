import { Component } from '@angular/core';
import { NgnButton } from '@awdlab/jig/button';
import { NgnPopover } from '@awdlab/jig/popover';

@Component({
  imports: [NgnPopover, NgnButton],
  selector: 'awd-demo-popover-base',
  template: `
    <button ngnButton #anchor (click)="popover.show()">Open</button>
    <awd-popover #popover [anchor]="anchor"> Content </awd-popover>
  `,
})
export class Demo_Popover_Base {}
