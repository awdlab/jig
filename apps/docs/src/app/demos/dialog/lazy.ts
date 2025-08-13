import { Component, signal } from '@angular/core';
import { NgnDialog } from '@ngneers/controls/dialog';

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
  imports: [NgnDialog, LazyComponent],
  template: `<button (click)="open.set(true)">Open Dialog</button>
    <ngn-dialog [open]="open()" (closed)="open.set(false)">
      <ng-template #lazy>
        <ngn-lazy-test />
      </ng-template>
    </ngn-dialog>`,
})
export class Demo_Dialog_Lazy {
  protected readonly open = signal(false);
}
