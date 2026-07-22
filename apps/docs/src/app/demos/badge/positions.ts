import { Component } from '@angular/core';
import tablerBell from '@iconify/icons-tabler/bell';
import { NgnBadge } from '@ngneers/controls/badge';
import { NgnButton } from '@ngneers/controls/button';
import { NgnIcon } from '@ngneers/controls/icon';

@Component({
  selector: 'ngn-demo-badge-positions',
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
        <ngn-icon [icon]="bell" />
      </button>
      <button ngnButton kind="icon" [ngnBadge]="2" ngnBadgePosition="top-end" aria-label="Top end">
        <ngn-icon [icon]="bell" />
      </button>
      <button
        ngnButton
        kind="icon"
        [ngnBadge]="3"
        ngnBadgePosition="bottom-start"
        aria-label="Bottom start"
      >
        <ngn-icon [icon]="bell" />
      </button>
      <button
        ngnButton
        kind="icon"
        [ngnBadge]="4"
        ngnBadgePosition="bottom-end"
        aria-label="Bottom end"
      >
        <ngn-icon [icon]="bell" />
      </button>
    </div>
  `,
})
export class Demo_Badge_Positions {
  protected readonly bell = tablerBell;
}
