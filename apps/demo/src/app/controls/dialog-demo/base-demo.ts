import { Component, signal } from '@angular/core';
import { NgnDialog } from '@ngneers/controls/dialog';

@Component({
  imports: [NgnDialog],
  template: `<button (click)="open.set(true)">Open Dialog</button>
    <ngn-dialog [open]="open()" (closed)="open.set(false)"> Content </ngn-dialog>`,
})
export class Dialog_Base_Component {
  protected readonly open = signal(false);
}
