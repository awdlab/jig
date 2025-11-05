import { computed, inject, Injectable, signal } from '@angular/core';
import { Platform } from '@ngneers/controls/api/ng';

@Injectable()
export class FrameState {
  private readonly _appWidth = inject(Platform).windowSize;

  public readonly isCompact = computed(() => this._appWidth().width < 900);
  public readonly menuOpen = signal(false);
}
