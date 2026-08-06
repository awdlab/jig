import tablerAppWindow from '@iconify/icons-tabler/app-window';
import tablerList from '@iconify/icons-tabler/list';
import tablerSquare from '@iconify/icons-tabler/square';
import { Component, signal } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { NgnCommand } from '@ngneers/controls/command';

import type { NgnActionItem } from '@ngneers/controls/api';

@Component({
  imports: [NgnCommand, NgnButton],
  selector: 'ngn-demo-command-routes-demo',
  template: `
    <button ngnButton (click)="open.set(true)">Jump to a page</button>
    <ngn-command [items]="items" [(open)]="open" />
  `,
})
export class Demo_Command_Routes {
  protected readonly open = signal(false);
  protected readonly items: NgnActionItem[] = [
    { id: 'button', label: 'Button', icon: tablerSquare, route: '/components/button' },
    { id: 'dialog', label: 'Dialog', icon: tablerAppWindow, route: '/components/dialog' },
    { id: 'select', label: 'Select', icon: tablerList, route: '/components/select' },
  ];
}
