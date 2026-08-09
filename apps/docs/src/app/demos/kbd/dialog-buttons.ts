import { Component, signal } from '@angular/core';
import { AwdButton } from '@awdlab/jig/button';
import { AwdDialog } from '@awdlab/jig/dialog';
import { AwdInput } from '@awdlab/jig/input';
import { AwdInputField } from '@awdlab/jig/input-field';

import type { AwdActionButtonConfig } from '@awdlab/jig/api';

@Component({
  selector: 'jig-demo-kbd-dialog-buttons',
  imports: [AwdButton, AwdDialog, AwdInput, AwdInputField],
  template: `
    <div class="flex flex-col gap-4 p-4">
      <button ngnButton (click)="open.set(true)">Open dialog</button>
      <span class="text-sm">Last button: {{ last() ?? '—' }}</span>

      <jig-dialog
        title="Rename"
        [(open)]="open"
        [modal]="true"
        [footerButtons]="buttons"
        (buttonClicked)="resolve($event)"
      >
        <jig-input-field label="New name">
          <input ngnInput autofocus />
        </jig-input-field>
      </jig-dialog>
    </div>
  `,
})
export class Demo_Kbd_DialogButtons {
  protected readonly open = signal(false);
  protected readonly last = signal<string | null>(null);

  protected readonly buttons: AwdActionButtonConfig<string>[] = [
    { label: 'Cancel', value: 'cancel', kind: 'secondary', shortcut: 'escape' },
    { label: 'Confirm', value: 'confirm', kind: 'primary', shortcut: 'ctrl+enter' },
  ];

  /** A footer button only emits; closing the dialog is the consumer's call. */
  protected resolve(value: string | null): void {
    this.last.set(value);
    this.open.set(false);
  }
}
