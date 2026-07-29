import { Component } from '@angular/core';
import tablerBell from '@iconify/icons-tabler/bell';
import { NgnAvatar } from '@ngneers/controls/avatar';
import { NgnBadge } from '@ngneers/controls/badge';
import { NgnButton } from '@ngneers/controls/button';
import { NgnIcon } from '@ngneers/controls/icon';

@Component({
  selector: 'ngn-demo-badge-base',
  imports: [NgnBadge, NgnButton, NgnIcon, NgnAvatar],
  template: `
    <div class="flex items-center gap-8 p-4">
      <button ngnButton kind="icon" [ngnBadge]="8" aria-label="Notifications">
        <ngn-icon [icon]="bell" />
      </button>
      <button ngnButton [ngnBadge]="3">Inbox</button>
      <button ngnButton kind="icon" [ngnBadge]="120" [ngnBadgeMax]="99" aria-label="Notifications">
        <ngn-icon [icon]="bell" />
      </button>
      <!-- ngn-avatar clips its content (overflow: hidden), so anchor the badge on a
           thin wrapper around it rather than on the avatar element itself. -->
      <span class="inline-flex" [ngnBadge]="5" ngnBadgeCircular><ngn-avatar initials="JD" /></span>
    </div>
  `,
})
export class Demo_Badge_Base {
  protected readonly bell = tablerBell;
}
