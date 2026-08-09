import { Component, computed, inject } from '@angular/core';
import tablerBrandGithub from '@iconify/icons-tabler/brand-github';
import tablerPalette from '@iconify/icons-tabler/palette';
import { ColorSchemeService } from '@awdlab/jig/api/ng';
import { NgnButton } from '@awdlab/jig/button';
import { NgnIcon } from '@awdlab/jig/icon';
import { NgnPopover } from '@awdlab/jig/popover';

import { NgnDocsThemePicker } from '../../utils/theme-picker';

/**
 * Theme, color-scheme and repo actions. Rendered in the topbar on wide viewports
 * and inside the menu drawer on narrow ones (where the topbar has no room).
 * Callers supply the display class (`flex` / `hidden nav:flex`).
 */
@Component({
  selector: 'awd-docs-topbar-actions',
  imports: [NgnButton, NgnIcon, NgnPopover, NgnDocsThemePicker],
  host: { class: 'items-center gap-2 text-2xl text-(--awd-color-surface-800)' },
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
      <awd-icon size="28px" [icon]="iconPalette" />
    </button>
    <awd-popover #themePickerPopover [anchor]="themePickerBtn">
      <awd-docs-theme-picker />
    </awd-popover>
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
      href="https://github.com/awdlab/jig"
      target="_blank"
      aria-label="Project on Github"
      ngnButton
      kind="icon"
    >
      <awd-icon size="28px" [icon]="iconGithub" />
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
