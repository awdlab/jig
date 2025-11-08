import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgnButton } from '@ngneers/controls/button';
import { NgnIcon } from '@ngneers/controls/icon';

import { FrameState } from '../frame-state';

@Component({
  selector: 'ngn-docs-topbar',
  templateUrl: 'topbar.html',
  styleUrl: 'topbar.scss',
  imports: [NgnButton, NgnIcon, RouterLink],
})
export class NgnDocsTopbar {
  private readonly _frameState = inject(FrameState);

  protected toggleMenu() {
    this._frameState.menuOpen.update(v => !v);
  }
}
