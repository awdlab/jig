import { Component } from '@angular/core';
import tablerBell from '@iconify/icons-tabler/bell';
import { NgnAvatar } from '@awdlab/jig/avatar';
import { NgnBadge } from '@awdlab/jig/badge';
import { NgnButton } from '@awdlab/jig/button';
import { NgnIcon } from '@awdlab/jig/icon';

@Component({
  selector: 'awd-demo-badge-base',
  imports: [NgnBadge, NgnButton, NgnIcon, NgnAvatar],
  template: `
    <div class="flex items-center gap-8 p-4">
      <button ngnButton kind="icon" [ngnBadge]="8" aria-label="Notifications">
        <awd-icon [icon]="bell" />
      </button>
      <button ngnButton [ngnBadge]="3">Inbox</button>
      <button ngnButton kind="icon" [ngnBadge]="120" [ngnBadgeMax]="99" aria-label="Notifications">
        <awd-icon [icon]="bell" />
      </button>
      <!-- awd-avatar clips its content (overflow: hidden), so anchor the badge on a
           thin wrapper around it rather than on the avatar element itself. -->
      <span class="inline-flex" [ngnBadge]="5" ngnBadgeCircular><awd-avatar initials="JD" /></span>
    </div>
  `,
})
export class Demo_Badge_Base {
  protected readonly bell = tablerBell;
}
