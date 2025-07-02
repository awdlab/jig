import { Component } from '@angular/core';
import { Popover } from '@ngneers/controls/popover';

@Component({
  imports: [Popover],
  selector: 'ngn-popover-base',
  template: `
    <button #anchor (click)="popover.open()">Open</button>
    <ngn-popover #popover [anchor]="anchor"> Content </ngn-popover>
  `,
})
export class Popover_Base_Component {}
