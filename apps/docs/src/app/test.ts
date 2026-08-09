import { Component, signal } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { JigDialog } from '@awdlab/jig/dialog';

@Component({
  imports: [JigDialog, JigButton],
  template: `<button (click)="open.set(true)">Open Dialog</button>
    <jig-dialog
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
        <button autofocus jigButton>jig</button>
      </ng-template>
    </jig-dialog>`,
})
export class TestComponent {
  protected readonly open = signal(false);
}
