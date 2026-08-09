import { Component } from '@angular/core';
import tablerMail from '@iconify/icons-tabler/mail';
import { NgnAvatar } from '@awdlab/jig/avatar';
import { NgnBadge } from '@awdlab/jig/badge';
import { NgnButton } from '@awdlab/jig/button';
import { NgnIcon } from '@awdlab/jig/icon';

@Component({
  selector: 'awd-demo-badge-dot',
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
        ngnBadgeColor="var(--awd-color-success-500)"
      >
        <awd-avatar initials="JD" />
      </span>
      <!-- Unread indicator on an icon button -->
      <button ngnButton kind="icon" ngnBadgeDot aria-label="Messages">
        <awd-icon [icon]="mail" />
      </button>
    </div>
  `,
})
export class Demo_Badge_Dot {
  protected readonly mail = tablerMail;
}
