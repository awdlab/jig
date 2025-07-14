import { Component } from '@angular/core';
import { NgnPopover } from '@ngneers/controls/popover';

@Component({
  selector: 'ngn-lazy-test',
  template: 'Lazy Content',
})
export class LazyComponent {
  constructor() {
    console.log('LazyComponent initialized');
  }
}

@Component({
  imports: [NgnPopover, LazyComponent],
  selector: 'ngn-popover-lazy',
  template: `
    <button #anchor (click)="popover.open()">Open</button>
    <ngn-popover #popover [anchor]="anchor" [options]="{ cache: true }">
      <ng-template #lazy>
        <ngn-lazy-test />
      </ng-template>
    </ngn-popover>
  `,
})
export class Popover_Lazy_Component {}
