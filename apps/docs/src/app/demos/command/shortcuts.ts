import tablerCopy from '@iconify/icons-tabler/copy';
import tablerFolderPlus from '@iconify/icons-tabler/folder-plus';
import tablerPlus from '@iconify/icons-tabler/plus';
import tablerSettings from '@iconify/icons-tabler/settings';
import tablerTrash from '@iconify/icons-tabler/trash';
import { Component, signal } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { NgnCommand } from '@ngneers/controls/command';
import { NgnKbd, NgnKeyboardShortcut } from '@ngneers/controls/kbd';

import type { NgnActionItem } from '@ngneers/controls/api';

@Component({
  imports: [NgnCommand, NgnButton, NgnKbd, NgnKeyboardShortcut],
  selector: 'ngn-demo-command-shortcuts-demo',
  template: `
    <div
      tabindex="0"
      class="flex flex-col items-start gap-3 rounded border border-dashed p-4"
      [ngnKeyboardShortcut]="[{ shortcut: 'mod+alt+k', callback: () => open.set(true) }]"
    >
      <span class="text-sm">
        Click inside this box, then press <ngn-kbd shortcut="mod+alt+k" /> to open the palette. The
        per-item shortcuts below run their command from anywhere — open or closed.
      </span>
      <button ngnButton (click)="open.set(true)">Open palette</button>
      <ngn-command [items]="items" [(open)]="open" (commandSelected)="last.set($event.id)" />
      @if (last()) {
        <p>Ran: {{ last() }}</p>
      }
    </div>
  `,
})
export class Demo_Command_Shortcuts {
  protected readonly open = signal(false);
  protected readonly last = signal<string | null>(null);
  protected readonly items: NgnActionItem[] = [
    { id: 'new-file', label: 'New File', icon: tablerPlus, shortcut: 'mod+alt+n' },
    { id: 'new-folder', label: 'New Folder', icon: tablerFolderPlus, shortcut: 'shift+mod+alt+n' },
    { id: 'copy', label: 'Copy', icon: tablerCopy, shortcut: 'mod+alt+c' },
    { id: 'delete', label: 'Move to Trash', icon: tablerTrash },
    { id: 'preferences', label: 'Preferences', icon: tablerSettings, shortcut: 'mod+alt+p' },
  ];
}
