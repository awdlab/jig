import { Component, signal } from '@angular/core';
import { NgnActionButtonConfig } from '@ngneers/controls/api';
import { NgnDialog } from '@ngneers/controls/dialog';

@Component({
  imports: [NgnDialog],
  template: `<button (click)="open.set(true)">Open Dialog</button>
    <ngn-dialog
      [title]="'test'"
      [open]="open()"
      [closeBy]="'any'"
      [modal]="true"
      (openChange)="open.set($event)"
      [size]="{ width: '400px', maxWidth: '90vw' }"
      [footerButtons]="buttons"
    >
      Content
    </ngn-dialog>`,
})
export class Demo_Dialog_Buttons {
  protected readonly open = signal(false);

  protected readonly buttons: NgnActionButtonConfig[] = [
    {
      label: 'Confirm',
      kind: 'primary',
      action: () => {
        console.log('Confirmed');
      },
    },
    {
      label: 'Cancel',
      kind: 'secondary',
      action: () => {
        console.log('Cancelled');
      },
    },
  ];
}
