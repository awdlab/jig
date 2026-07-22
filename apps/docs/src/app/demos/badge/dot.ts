import { Component } from '@angular/core';
import tablerMail from '@iconify/icons-tabler/mail';
import { NgnAvatar } from '@ngneers/controls/avatar';
import { NgnBadge } from '@ngneers/controls/badge';
import { NgnButton } from '@ngneers/controls/button';
import { NgnIcon } from '@ngneers/controls/icon';

@Component({
  selector: 'ngn-demo-badge-dot',
  imports: [NgnBadge, NgnButton, NgnIcon, NgnAvatar],
  template: `
    <div class="flex items-center gap-8 p-4">
      <!-- Online-status dot on an avatar. The avatar clips its content, so the badge
           is anchored on a thin wrapper around it. -->
      <span
        class="inline-flex"
        ngnBadgeDot
        ngnBadgeCircular
        ngnBadgePosition="bottom-end"
        ngnBadgeColor="var(--ngn-color-success-500)"
      >
        <ngn-avatar initials="JD" />
      </span>
      <!-- Unread indicator on an icon button -->
      <button ngnButton kind="icon" ngnBadgeDot aria-label="Messages">
        <ngn-icon [icon]="mail" />
      </button>
    </div>
  `,
})
export class Demo_Badge_Dot {
  protected readonly mail = tablerMail;
}
