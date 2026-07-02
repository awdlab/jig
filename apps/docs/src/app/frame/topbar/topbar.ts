import { Component, computed, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import tablerBrandGithub from '@iconify/icons-tabler/brand-github';
import tablerMenu2 from '@iconify/icons-tabler/menu-2';
import tablerPalette from '@iconify/icons-tabler/palette';
import { ColorSchemeService } from '@ngneers/controls/api/ng';
import { NgnBreadcrumb } from '@ngneers/controls/breadcrumb';
import { NgnButton } from '@ngneers/controls/button';
import { NgnIcon } from '@ngneers/controls/icon';
import { NgnPopover } from '@ngneers/controls/popover';

import { AppLocation } from '../../helper/app-location';
import { NgnDocsThemePicker } from '../../utils/theme-picker';
import { BreadcrumbService } from '../breadcrumb.service';
import { FrameState } from '../frame-state';

@Component({
  selector: 'ngn-docs-topbar',
  templateUrl: 'topbar.html',
  styleUrl: 'topbar.scss',
  imports: [NgnButton, NgnDocsThemePicker, NgnIcon, NgnPopover, RouterLink, NgnBreadcrumb],
})
export class NgnDocsTopbar {
  protected readonly iconGithub = tablerBrandGithub;
  protected readonly iconBars = tablerMenu2;
  protected readonly iconPalette = tablerPalette;
  private readonly _frameState = inject(FrameState);
  private readonly _appLocation = inject(AppLocation);
  private readonly _breadcrumb = inject(BreadcrumbService);
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

  protected readonly isDocsPage = computed(() => this._appLocation.location().length > 0);
  protected readonly breadcrumbItems = this._breadcrumb.items;

  constructor() {
    // Clear the breadcrumb off docs routes — the page renderers won't.
    effect(() => {
      if (!this.isDocsPage()) {
        this._breadcrumb.clear();
      }
    });
  }

  protected toggleMenu() {
    this._frameState.menuOpen.update(v => !v);
  }

  protected cycleColorScheme() {
    this.colorScheme.cycle();
  }
}
