import { Component, signal } from '@angular/core';
import { AwdButton } from '@awdlab/jig/button';
import { AwdDialog } from '@awdlab/jig/dialog';

@Component({
  selector: 'jig-demo-dialog-base',
  imports: [AwdDialog, AwdButton],
  template: `<button ngnButton (click)="open.set(true)">Open Dialog</button>
    <jig-dialog
      [title]="'test'"
      [open]="open()"
      [closeBy]="'any'"
      [modal]="true"
      (openChange)="open.set($event)"
      [size]="{ width: '400px', maxWidth: '90vw' }"
    >
      Content
      <button ngnButton autofocus>jig</button>
    </jig-dialog>`,
})
export class Demo_Dialog_Base {
  protected readonly open = signal(false);
}
