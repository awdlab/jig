import { Component, signal } from '@angular/core';
import { NgnButton } from '@awdlab/jig/button';
import { NgnDialog } from '@awdlab/jig/dialog';

@Component({
  selector: 'awd-demo-dialog-movable',
  imports: [NgnDialog, NgnButton],
  template: `<button ngnButton (click)="open.set(true)">Open Dialog</button>
    <awd-dialog
      [title]="'test'"
      [open]="open()"
      [closeBy]="'any'"
      [modal]="true"
      (openChange)="open.set($event)"
      [size]="{ width: '400px', maxWidth: '90vw', minWidth: '200px' }"
      [movable]="true"
      [resizable]="true"
    >
      Content
    </awd-dialog>`,
})
export class Demo_Dialog_Movable {
  protected readonly open = signal(false);
}
