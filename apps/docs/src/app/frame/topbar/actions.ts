import { Component, computed, inject } from '@angular/core';
import tablerBrandGithub from '@iconify/icons-tabler/brand-github';
import tablerPalette from '@iconify/icons-tabler/palette';
import { ColorSchemeService } from '@ngneers/controls/api/ng';
import { NgnButton } from '@ngneers/controls/button';
import { NgnIcon } from '@ngneers/controls/icon';
import { NgnPopover } from '@ngneers/controls/popover';

import { NgnDocsThemePicker } from '../../utils/theme-picker';

/**
 * Theme, color-scheme and repo actions. Rendered in the topbar on wide viewports
 * and inside the menu drawer on narrow ones (where the topbar has no room).
 * Callers supply the display class (`flex` / `hidden nav:flex`).
 */
@Component({
  selector: 'ngn-docs-topbar-actions',
  imports: [NgnButton, NgnIcon, NgnPopover, NgnDocsThemePicker],
  host: { class: 'items-center gap-2 text-2xl text-(--ngn-color-surface-800)' },
  template: `
    <button
      #themePickerBtn
      ngnButton
      kind="icon"
      aria-label="Pick theme and color"
      title="Pick theme and color"
      aria-haspopup="dialog"
      [attr.aria-expanded]="themePickerPopover.open()"
      (click)="themePickerPopover.toggle()"
    >
      <ngn-icon size="28px" [icon]="iconPalette" />
    </button>
    <ngn-popover #themePickerPopover [anchor]="themePickerBtn">
      <ngn-docs-theme-picker />
    </ngn-popover>
    <button
      ngnButton
      kind="icon"
      [attr.aria-label]="colorSchemeLabel()"
      [title]="colorSchemeLabel()"
      (click)="colorScheme.cycle()"
    >
      {{ colorSchemeIcon() }}
    </button>
    <a
      href="https://github.com/NGneers/controls"
      target="_blank"
      aria-label="Project on Github"
      ngnButton
      kind="icon"
    >
      <ngn-icon size="28px" [icon]="iconGithub" />
    </a>
  `,
})
export class NgnDocsTopbarActions {
  protected readonly iconGithub = tablerBrandGithub;
  protected readonly iconPalette = tablerPalette;
  protected readonly colorScheme = inject(ColorSchemeService);

  protected readonly colorSchemeIcon = computed(() => {
    switch (this.colorScheme.preference()) {
      case 'light':
        return '☀️';
      case 'dark':
        return '🌙';
      default:
        return '🖥️';
    }
  });

  protected readonly colorSchemeLabel = computed(() => {
    switch (this.colorScheme.preference()) {
      case 'light':
        return 'Color scheme: Light (click for Dark)';
      case 'dark':
        return 'Color scheme: Dark (click for System)';
      default:
        return 'Color scheme: System (click for Light)';
    }
  });
}
