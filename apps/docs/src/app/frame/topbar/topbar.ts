import {
  Component,
  DOCUMENT,
  effect,
  inject,
  ChangeDetectionStrategy,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgnButton } from '@ngneers/controls/button';
import { NgnIcon } from '@ngneers/controls/icon';
import { toggleClass } from '@ngneers/controls/utils';

import { FrameState } from '../frame-state';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-docs-topbar',
  templateUrl: 'topbar.html',
  styleUrl: 'topbar.scss',
  imports: [NgnButton, NgnIcon, RouterLink],
})
export class NgnDocsTopbar {
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
