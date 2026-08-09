import tablerAppWindow from '@iconify/icons-tabler/app-window';
import tablerList from '@iconify/icons-tabler/list';
import tablerSquare from '@iconify/icons-tabler/square';
import { Component, signal } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { JigCommand } from '@awdlab/jig/command';

import type { JigActionItem } from '@awdlab/jig/api';

@Component({
  imports: [JigCommand, JigButton],
  selector: 'jig-demo-command-routes-demo',
  template: `
    <button ngnButton (click)="open.set(true)">Jump to a page</button>
    <jig-command [items]="items" [(open)]="open" />
  `,
})
export class Demo_Command_Routes {
  protected readonly open = signal(false);
  protected readonly items: JigActionItem[] = [
    { id: 'button', label: 'Button', icon: tablerSquare, route: '/components/button' },
    { id: 'dialog', label: 'Dialog', icon: tablerAppWindow, route: '/components/dialog' },
    { id: 'select', label: 'Select', icon: tablerList, route: '/components/select' },
  ];
}
