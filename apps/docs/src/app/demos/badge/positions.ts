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
        ngnButton
        kind="icon"
        [ngnBadge]="1"
        ngnBadgePosition="top-start"
        aria-label="Top start"
      >
        <jig-icon [icon]="bell" />
      </button>
      <button ngnButton kind="icon" [ngnBadge]="2" ngnBadgePosition="top-end" aria-label="Top end">
        <jig-icon [icon]="bell" />
      </button>
      <button
        ngnButton
        kind="icon"
        [ngnBadge]="3"
        ngnBadgePosition="bottom-start"
        aria-label="Bottom start"
      >
        <jig-icon [icon]="bell" />
      </button>
      <button
        ngnButton
        kind="icon"
        [ngnBadge]="4"
        ngnBadgePosition="bottom-end"
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
