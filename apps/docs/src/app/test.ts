import { Component, signal } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { NgnDialog } from '@ngneers/controls/dialog';

@Component({
  imports: [NgnDialog, NgnButton],
  template: `<button (click)="open.set(true)">Open Dialog</button>
    <ngn-dialog
      [unstyled]="true"
      [title]="'test'"
      [open]="open()"
      [closeBy]="'any'"
      [modal]="true"
      (openChange)="open.set($event)"
      [size]="{ width: '400px', maxWidth: '90vw' }"
    >
      <ng-template #content>
        Content
        <button autofocus ngnButton>awd</button>
      </ng-template>
    </ngn-dialog>`,
})
export class TestComponent {
  protected readonly open = signal(false);
}
