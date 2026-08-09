import { Component } from '@angular/core';
import tablerBell from '@iconify/icons-tabler/bell';
import { JigBadge } from '@awdlab/jig/badge';
import { JigButton } from '@awdlab/jig/button';
import { JigIcon } from '@awdlab/jig/icon';

@Component({
  selector: 'jig-demo-badge-positions',
  imports: [JigBadge, JigButton, JigIcon],
  template: `
    <div class="flex gap-10 p-8">
      <button
        jigButton
        kind="icon"
        [jigBadge]="1"
        jigBadgePosition="top-start"
        aria-label="Top start"
      >
        <jig-icon [icon]="bell" />
      </button>
      <button jigButton kind="icon" [jigBadge]="2" jigBadgePosition="top-end" aria-label="Top end">
        <jig-icon [icon]="bell" />
      </button>
      <button
        jigButton
        kind="icon"
        [jigBadge]="3"
        jigBadgePosition="bottom-start"
        aria-label="Bottom start"
      >
        <jig-icon [icon]="bell" />
      </button>
      <button
        jigButton
        kind="icon"
        [jigBadge]="4"
        jigBadgePosition="bottom-end"
        aria-label="Bottom end"
      >
        <jig-icon [icon]="bell" />
      </button>
    </div>
  `,
})
export class Demo_Badge_Positions {
  protected readonly bell = tablerBell;
}
