import tablerCopy from '@iconify/icons-tabler/copy';
import tablerFolderPlus from '@iconify/icons-tabler/folder-plus';
import tablerPlus from '@iconify/icons-tabler/plus';
import { Component, signal } from '@angular/core';
import { AwdButton } from '@awdlab/jig/button';
import { AwdCommand } from '@awdlab/jig/command';

import type { JigActionItem } from '@awdlab/jig/api';

@Component({
  imports: [AwdCommand, AwdButton],
  selector: 'jig-demo-command-base-demo',
  template: `
    <button ngnButton (click)="open.set(true)">Open palette</button>
    <jig-command [items]="items" [(open)]="open" (commandSelected)="last.set($event.id)" />
    @if (last()) {
      <p>Ran: {{ last() }}</p>
    }
  `,
})
export class Demo_Command_Base {
  protected readonly open = signal(false);
  protected readonly last = signal<string | null>(null);
  protected readonly items: JigActionItem[] = [
    { id: 'new-file', label: 'New File', icon: tablerPlus },
    { id: 'new-folder', label: 'New Folder', icon: tablerFolderPlus },
    { id: 'copy', label: 'Copy', icon: tablerCopy },
  ];
}
