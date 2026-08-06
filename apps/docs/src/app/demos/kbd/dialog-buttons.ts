import { Component, signal } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { NgnDialog } from '@ngneers/controls/dialog';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputField } from '@ngneers/controls/input-field';

import type { NgnActionButtonConfig } from '@ngneers/controls/api';

@Component({
  selector: 'ngn-demo-kbd-dialog-buttons',
  imports: [NgnButton, NgnDialog, NgnInput, NgnInputField],
  template: `
    <div class="flex flex-col gap-4 p-4">
      <button ngnButton (click)="open.set(true)">Open dialog</button>
      <span class="text-sm">Last button: {{ last() ?? '—' }}</span>

      <ngn-dialog
        title="Rename"
        [(open)]="open"
        [modal]="true"
        [footerButtons]="buttons"
        (buttonClicked)="resolve($event)"
      >
        <ngn-input-field label="New name">
          <input ngnInput autofocus />
        </ngn-input-field>
      </ngn-dialog>
    </div>
  `,
})
export class Demo_Kbd_DialogButtons {
  protected readonly open = signal(false);
  protected readonly last = signal<string | null>(null);

  protected readonly buttons: NgnActionButtonConfig<string>[] = [
    { label: 'Cancel', value: 'cancel', kind: 'secondary', shortcut: 'escape' },
    { label: 'Confirm', value: 'confirm', kind: 'primary', shortcut: 'ctrl+enter' },
  ];

  /** A footer button only emits; closing the dialog is the consumer's call. */
  protected resolve(value: string | null): void {
    this.last.set(value);
    this.open.set(false);
  }
}
