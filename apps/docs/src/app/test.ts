import { Component, signal } from '@angular/core';
import { NgnButton } from '@awdlab/jig/button';
import { NgnDialog } from '@awdlab/jig/dialog';

@Component({
  imports: [NgnDialog, NgnButton],
  template: `<button (click)="open.set(true)">Open Dialog</button>
    <awd-dialog
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
    </awd-dialog>`,
})
export class TestComponent {
  protected readonly open = signal(false);
}
