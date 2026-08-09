import { Component } from '@angular/core';
import tablerBell from '@iconify/icons-tabler/bell';
import { JigAvatar } from '@awdlab/jig/avatar';
import { JigBadge } from '@awdlab/jig/badge';
import { JigButton } from '@awdlab/jig/button';
import { JigIcon } from '@awdlab/jig/icon';

@Component({
  selector: 'jig-demo-badge-base',
  imports: [JigBadge, JigButton, JigIcon, JigAvatar],
  template: `
    <div class="flex items-center gap-8 p-4">
      <button jigButton kind="icon" [jigBadge]="8" aria-label="Notifications">
        <jig-icon [icon]="bell" />
      </button>
      <button jigButton [jigBadge]="3">Inbox</button>
      <button jigButton kind="icon" [jigBadge]="120" [jigBadgeMax]="99" aria-label="Notifications">
        <jig-icon [icon]="bell" />
      </button>
      <!-- jig-avatar clips its content (overflow: hidden), so anchor the badge on a
           thin wrapper around it rather than on the avatar element itself. -->
      <span class="inline-flex" [jigBadge]="5" jigBadgeCircular><jig-avatar initials="JD" /></span>
    </div>
  `,
})
export class Demo_Badge_Base {
  protected readonly bell = tablerBell;
}
