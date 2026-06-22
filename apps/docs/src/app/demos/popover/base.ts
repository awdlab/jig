import { Component } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { NgnPopover } from '@ngneers/controls/popover';

@Component({
  imports: [NgnPopover, NgnButton],
  selector: 'ngn-demo-popover-base',
  template: `
    <button ngnButton #anchor (click)="popover.show()">Open</button>
    <ngn-popover #popover [anchor]="anchor"> Content </ngn-popover>
  `,
})
export class Demo_Popover_Base {}
