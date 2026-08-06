import tablerCopy from '@iconify/icons-tabler/copy';
import tablerHome from '@iconify/icons-tabler/home';
import tablerMail from '@iconify/icons-tabler/mail';
import { Component, signal, viewChild } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { NgnCommand } from '@ngneers/controls/command';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

import type { NgnActionItem } from '@ngneers/controls/api';

@Component({
  selector: 'ngn-docs-command-playground',
  imports: [NgnCommand, NgnButton, NgnDocsPlayground],
  template: `
    <ngn-docs-playground [controls]="[{ componentName: 'NgnCommand', component: component() }]">
      <button ngnButton (click)="open.set(true)">Open palette</button>
      <ngn-command #ref [items]="items" [(open)]="open" />
    </ngn-docs-playground>
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
