import { Component } from '@angular/core';
import { Popover } from '@ngneers/controls/popover';

@Component({
  selector: 'ngn-test',
  template: 'Content',
})
export class TestComponent {
  constructor() {
    console.log('TestComponent initialized');
  }
}

@Component({
  imports: [Popover, TestComponent],
  template: `
    <button #anchor (click)="popover.open()">Open</button>
    <ngn-popover #popover [anchor]="anchor" [options]="{ cache: true }">
      <ng-template #content>
        <ngn-test />
      </ng-template>
    </ngn-popover>
  `,
})
export class Popover_Lazy_Component {
  constructor() {}
}
