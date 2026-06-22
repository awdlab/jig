import { Component, DOCUMENT, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import tablerBrandGithub from '@iconify/icons-tabler/brand-github';
import tablerMenu2 from '@iconify/icons-tabler/menu-2';
import { NgnButton } from '@ngneers/controls/button';
import { NgnIcon } from '@ngneers/controls/icon';
import { toggleClass } from '@ngneers/controls/utils';

import { FrameState } from '../frame-state';

@Component({
  selector: 'ngn-docs-topbar',
  templateUrl: 'topbar.html',
  styleUrl: 'topbar.scss',
  imports: [NgnButton, NgnIcon, RouterLink],
})
export class NgnDocsTopbar {
  protected readonly iconGithub = tablerBrandGithub;
  protected readonly iconBars = tablerMenu2;
  private readonly _frameState = inject(FrameState);
  private readonly _document = inject(DOCUMENT);

  protected readonly darkModeEnabled = signal(false);

  constructor() {
    effect(() => {
      const darkModeEnabled = this.darkModeEnabled();
      const element = this._document.body.parentElement;
      if (!element) {
        return;
      }
      toggleClass(element, 'dark', darkModeEnabled);
    });
  }

  protected toggleMenu() {
    this._frameState.menuOpen.update(v => !v);
  }

  protected toggleDarkMode() {
    this.darkModeEnabled.update(v => !v);
  }
}
