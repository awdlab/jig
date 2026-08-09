import tablerCopy from '@iconify/icons-tabler/copy';
import tablerHome from '@iconify/icons-tabler/home';
import tablerMail from '@iconify/icons-tabler/mail';
import { Component, signal, viewChild } from '@angular/core';
import { AwdButton } from '@awdlab/jig/button';
import { AwdCommand } from '@awdlab/jig/command';

import { AwdDocsPlayground } from '../../../utils/playground/playground';

import type { JigActionItem } from '@awdlab/jig/api';

@Component({
  selector: 'jig-docs-command-playground',
  imports: [AwdCommand, AwdButton, AwdDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'AwdCommand', component: component() }]">
      <button ngnButton (click)="open.set(true)">Open palette</button>
      <jig-command #ref [items]="items" [(open)]="open" />
    </jig-docs-playground>
  `,
})
export class AwdDocsCommandPlayground {
  protected readonly component = viewChild.required('ref', { read: AwdCommand });
  protected readonly open = signal(false);
  protected readonly items: JigActionItem[] = [
    { id: 'home', label: 'Home', icon: tablerHome },
    { id: 'inbox', label: 'Inbox', icon: tablerMail },
    { id: 'copy', label: 'Copy', icon: tablerCopy },
  ];
}
