import { Component, signal } from '@angular/core';
import { Dialog } from '@ngneers/controls/dialog';

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
  imports: [Dialog, LazyComponent],
  template: `<button (click)="open.set(true)">Open Dialog</button>
    <ngn-dialog [open]="open()" (closed)="open.set(false)">
      <ng-template #lazy>
        <ngn-lazy-test />
      </ng-template>
    </ngn-dialog>`,
})
export class Dialog_Lazy_Component {
  protected readonly open = signal(false);
}
