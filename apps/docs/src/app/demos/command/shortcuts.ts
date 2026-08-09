import tablerCopy from '@iconify/icons-tabler/copy';
import tablerFolderPlus from '@iconify/icons-tabler/folder-plus';
import tablerPlus from '@iconify/icons-tabler/plus';
import tablerSettings from '@iconify/icons-tabler/settings';
import tablerTrash from '@iconify/icons-tabler/trash';
import { Component, signal } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { JigCommand } from '@awdlab/jig/command';
import { JigKbd, JigKeyboardShortcut } from '@awdlab/jig/kbd';

import type { JigActionItem } from '@awdlab/jig/api';

@Component({
  imports: [JigCommand, JigButton, JigKbd, JigKeyboardShortcut],
  selector: 'jig-demo-command-shortcuts-demo',
  template: `
    <div
      tabindex="0"
      class="flex flex-col items-start gap-3 rounded border border-dashed p-4"
      [ngnKeyboardShortcut]="[{ shortcut: 'mod+alt+k', callback: () => open.set(true) }]"
    >
      <span class="text-sm">
        Click inside this box, then press <jig-kbd shortcut="mod+alt+k" /> to open the palette. The
        per-item shortcuts below run their command from anywhere — open or closed.
      </span>
      <button ngnButton (click)="open.set(true)">Open palette</button>
      <jig-command [items]="items" [(open)]="open" (commandSelected)="last.set($event.id)" />
      @if (last()) {
        <p>Ran: {{ last() }}</p>
      }
    </div>
  `,
})
export class Demo_Command_Shortcuts {
  protected readonly open = signal(false);
  protected readonly last = signal<string | null>(null);
  protected readonly items: JigActionItem[] = [
    { id: 'new-file', label: 'New File', icon: tablerPlus, shortcut: 'mod+alt+n' },
    { id: 'new-folder', label: 'New Folder', icon: tablerFolderPlus, shortcut: 'shift+mod+alt+n' },
    { id: 'copy', label: 'Copy', icon: tablerCopy, shortcut: 'mod+alt+c' },
    { id: 'delete', label: 'Move to Trash', icon: tablerTrash },
    { id: 'preferences', label: 'Preferences', icon: tablerSettings, shortcut: 'mod+alt+p' },
  ];
}
