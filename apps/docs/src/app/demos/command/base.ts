import tablerCopy from '@iconify/icons-tabler/copy';
import tablerFolderPlus from '@iconify/icons-tabler/folder-plus';
import tablerPlus from '@iconify/icons-tabler/plus';
import { Component, signal } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { NgnCommand } from '@ngneers/controls/command';

import type { NgnActionItem } from '@ngneers/controls/api';

@Component({
  imports: [NgnCommand, NgnButton],
  selector: 'ngn-demo-command-base-demo',
  template: `
    <button ngnButton (click)="open.set(true)">Open palette</button>
    <ngn-command [items]="items" [(open)]="open" (commandSelected)="last.set($event.id)" />
    @if (last()) {
      <p>Ran: {{ last() }}</p>
    }
  `,
})
export class Demo_Command_Base {
  protected readonly open = signal(false);
  protected readonly last = signal<string | null>(null);
  protected readonly items: NgnActionItem[] = [
    { id: 'new-file', label: 'New File', icon: tablerPlus },
    { id: 'new-folder', label: 'New Folder', icon: tablerFolderPlus },
    { id: 'copy', label: 'Copy', icon: tablerCopy },
  ];
}
