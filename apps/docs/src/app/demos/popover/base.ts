import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnPopover } from '@ngneers/controls/popover';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnPopover],
  selector: 'ngn-demo-popover-base',
  template: `
    <button #anchor (click)="popover.show()">Open</button>
    <ngn-popover #popover [anchor]="anchor"> Content </ngn-popover>
  `,
})
export class Demo_Popover_Base {}
