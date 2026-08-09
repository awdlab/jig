import { Component, signal } from '@angular/core';
import { NgnButton } from '@awdlab/jig/button';
import { NgnDialog } from '@awdlab/jig/dialog';

import type { NgnActionButtonConfig } from '@awdlab/jig/api';

@Component({
  selector: 'awd-demo-dialog-buttons',
  imports: [NgnDialog, NgnButton],
  template: `<button ngnButton (click)="open.set(true)">Open Dialog</button>
    <awd-dialog
      [title]="'Buttons'"
      content="Check the console for button click results"
      [open]="open()"
      [modal]="true"
      (openChange)="open.set($event)"
      [size]="{ width: '400px', maxWidth: '90vw' }"
      [footerButtons]="buttons"
      (buttonClicked)="onButtonClicked($event)"
    >
      Content
    </awd-dialog>`,
})
export class Demo_Dialog_Buttons {
  protected readonly open = signal(false);

  protected readonly buttons = [
    {
      label: 'Cancel',
      kind: 'secondary',
      action: () => {
        console.log('Cancelled');
      },
      value: false,
    },
    {
      label: 'Confirm',
      kind: 'primary',
      color: 'primary',
      action: () => {
        console.log('Confirmed');
      },
      value: true,
    },
  ] satisfies NgnActionButtonConfig<unknown>[];

  protected onButtonClicked(value: boolean | null): void {
    console.log('Dialog button clicked with value:', value);
    this.open.set(false);
  }
}
