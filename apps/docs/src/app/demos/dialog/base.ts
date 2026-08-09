import { Component, signal } from '@angular/core';
import { NgnButton } from '@awdlab/jig/button';
import { NgnDialog } from '@awdlab/jig/dialog';

@Component({
  selector: 'awd-demo-dialog-base',
  imports: [NgnDialog, NgnButton],
  template: `<button ngnButton (click)="open.set(true)">Open Dialog</button>
    <awd-dialog
      [title]="'test'"
      [open]="open()"
      [closeBy]="'any'"
      [modal]="true"
      (openChange)="open.set($event)"
      [size]="{ width: '400px', maxWidth: '90vw' }"
    >
      Content
      <button ngnButton autofocus>awd</button>
    </awd-dialog>`,
})
export class Demo_Dialog_Base {
  protected readonly open = signal(false);
}
