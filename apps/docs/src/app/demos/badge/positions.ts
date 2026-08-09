import { Component } from '@angular/core';
import tablerBell from '@iconify/icons-tabler/bell';
import { NgnBadge } from '@awdlab/jig/badge';
import { NgnButton } from '@awdlab/jig/button';
import { NgnIcon } from '@awdlab/jig/icon';

@Component({
  selector: 'awd-demo-badge-positions',
  imports: [NgnBadge, NgnButton, NgnIcon],
  template: `
    <div class="flex gap-10 p-8">
      <button
        ngnButton
        kind="icon"
        [ngnBadge]="1"
        ngnBadgePosition="top-start"
        aria-label="Top start"
      >
        <awd-icon [icon]="bell" />
      </button>
      <button ngnButton kind="icon" [ngnBadge]="2" ngnBadgePosition="top-end" aria-label="Top end">
        <awd-icon [icon]="bell" />
      </button>
      <button
        ngnButton
        kind="icon"
        [ngnBadge]="3"
        ngnBadgePosition="bottom-start"
        aria-label="Bottom start"
      >
        <awd-icon [icon]="bell" />
      </button>
      <button
        ngnButton
        kind="icon"
        [ngnBadge]="4"
        ngnBadgePosition="bottom-end"
        aria-label="Bottom end"
      >
        <awd-icon [icon]="bell" />
      </button>
    </div>
  `,
})
export class Demo_Badge_Positions {
  protected readonly bell = tablerBell;
}
