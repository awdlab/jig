import { Component, computed, inject } from '@angular/core';
import { Platform } from '@ngneers/controls/api/ng';

import { NgnDocsMenu } from './menu/menu';
import { NgnDocsTopbar } from './topbar/topbar';

@Component({
  selector: 'ngn-docs-frame',
  templateUrl: 'frame.html',
  imports: [NgnDocsTopbar, NgnDocsMenu],
  host: { class: 'block h-full w-full' },
})
export class NgnDocsFrame {
  private readonly _appWidth = inject(Platform).windowSize;
  protected readonly isCompact = computed(() => this._appWidth().width < 900);
}
