import { Component } from '@angular/core';
import tablerMail from '@iconify/icons-tabler/mail';
import { JigAvatar } from '@awdlab/jig/avatar';
import { JigBadge } from '@awdlab/jig/badge';
import { JigButton } from '@awdlab/jig/button';
import { JigIcon } from '@awdlab/jig/icon';

@Component({
  selector: 'jig-demo-badge-dot',
  imports: [JigBadge, JigButton, JigIcon, JigAvatar],
  template: `
    <div class="flex items-center gap-8 p-4">
      <!-- Online-status dot on an avatar. The avatar clips its content, so the badge
           is anchored on a thin wrapper around it. -->
      <span
        class="inline-flex"
        ngnBadgeDot
        ngnBadgeCircular
        ngnBadgePosition="bottom-end"
        ngnBadgeColor="var(--jig-color-success-500)"
      >
        <jig-avatar initials="JD" />
      </span>
      <!-- Unread indicator on an icon button -->
      <button ngnButton kind="icon" ngnBadgeDot aria-label="Messages">
        <jig-icon [icon]="mail" />
      </button>
    </div>
  `,
})
export class Demo_Badge_Dot {
  protected readonly mail = tablerMail;
}
