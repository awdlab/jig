import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { NgnDialog } from '@ngneers/controls/dialog';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-demo-dialog-base',
  imports: [NgnDialog, NgnButton],
  template: `<button ngnButton (click)="open.set(true)">Open Dialog</button>
    <ngn-dialog
      [title]="'test'"
      [open]="open()"
      [closeBy]="'any'"
      [modal]="true"
      (openChange)="open.set($event)"
      [size]="{ width: '400px', maxWidth: '90vw' }"
    >
      Content
      <button ngnButton autofocus>awd</button>
    </ngn-dialog>`,
})
export class Demo_Dialog_Base {
  protected readonly open = signal(false);
}
