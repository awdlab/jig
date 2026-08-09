import { Component, computed, inject } from '@angular/core';
import tablerBrandGithub from '@iconify/icons-tabler/brand-github';
import tablerPalette from '@iconify/icons-tabler/palette';
import { ColorSchemeService } from '@awdlab/jig/api/ng';
import { JigButton } from '@awdlab/jig/button';
import { JigIcon } from '@awdlab/jig/icon';
import { JigPopover } from '@awdlab/jig/popover';

import { JigDocsThemePicker } from '../../utils/theme-picker';

/**
 * Theme, color-scheme and repo actions. Rendered in the topbar on wide viewports
 * and inside the menu drawer on narrow ones (where the topbar has no room).
 * Callers supply the display class (`flex` / `hidden nav:flex`).
 */
@Component({
  selector: 'jig-docs-topbar-actions',
  imports: [JigButton, JigIcon, JigPopover, JigDocsThemePicker],
  host: { class: 'items-center gap-2 text-2xl text-(--jig-color-surface-800)' },
  template: `
    <button
      #themePickerBtn
      jigButton
      kind="icon"
      aria-label="Pick theme and color"
      title="Pick theme and color"
      aria-haspopup="dialog"
      [attr.aria-expanded]="themePickerPopover.open()"
      (click)="themePickerPopover.toggle()"
    >
      <jig-icon size="28px" [icon]="iconPalette" />
    </button>
    <jig-popover #themePickerPopover [anchor]="themePickerBtn">
      <jig-docs-theme-picker />
    </jig-popover>
    <button
      jigButton
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
      jigButton
      kind="icon"
    >
      <jig-icon size="28px" [icon]="iconGithub" />
    </a>
  `,
})
export class JigDocsTopbarActions {
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
