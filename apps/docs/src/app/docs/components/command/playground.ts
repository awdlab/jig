import tablerCopy from '@iconify/icons-tabler/copy';
import tablerHome from '@iconify/icons-tabler/home';
import tablerMail from '@iconify/icons-tabler/mail';
import { Component, signal, viewChild } from '@angular/core';
import { NgnButton } from '@awdlab/jig/button';
import { NgnCommand } from '@awdlab/jig/command';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

import type { NgnActionItem } from '@awdlab/jig/api';

@Component({
  selector: 'awd-docs-command-playground',
  imports: [NgnCommand, NgnButton, NgnDocsPlayground],
  template: `
    <awd-docs-playground [controls]="[{ componentName: 'NgnCommand', component: component() }]">
      <button ngnButton (click)="open.set(true)">Open palette</button>
      <awd-command #ref [items]="items" [(open)]="open" />
    </awd-docs-playground>
  `,
})
export class NgnDocsCommandPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnCommand });
  protected readonly open = signal(false);
  protected readonly items: NgnActionItem[] = [
    { id: 'home', label: 'Home', icon: tablerHome },
    { id: 'inbox', label: 'Inbox', icon: tablerMail },
    { id: 'copy', label: 'Copy', icon: tablerCopy },
  ];
}
