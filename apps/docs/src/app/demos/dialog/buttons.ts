import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { NgnActionButtonConfig } from '@ngneers/controls/api';
import { NgnDialog } from '@ngneers/controls/dialog';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-demo-dialog-buttons',
  imports: [NgnDialog],
  template: `<button (click)="open.set(true)">Open Dialog</button>
    <ngn-dialog
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
    </ngn-dialog>`,
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
