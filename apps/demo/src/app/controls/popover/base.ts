import { Component } from '@angular/core';
import { Popover } from '@ngneers/controls/popover';

@Component({
  imports: [Popover],
  template: `
    <button #anchor (click)="popover.open()">Open Dropdown</button>
    <ngn-popover #popover [anchor]="anchor"> Content </ngn-popover>
  `,
})
export class Popover_Base_Component {
  constructor() {}
}
