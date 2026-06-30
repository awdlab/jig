import { computed, DOCUMENT, effect, inject, Injectable, signal } from '@angular/core';
import { Platform } from '@ngneers/controls/api/ng';
import { toggleClass } from '@ngneers/controls/utils';

@Injectable()
export class FrameState {
  private readonly _appWidth = inject(Platform).windowSize;
  private readonly _document = inject(DOCUMENT);

  public readonly isCompact = computed(() => this._appWidth().width < 900);
  public readonly menuOpen = signal(false);

  /** Page-wide dark mode. Toggling this flips the `dark` class on <html>. */
  public readonly darkMode = signal(false);

  constructor() {
    effect(() => {
      const element = this._document.body.parentElement; // <html>
      if (!element) {
        return;
      }
      toggleClass(element, 'dark', this.darkMode());
    });
  }

  public toggleDarkMode(): void {
    this.darkMode.update(v => !v);
  }
}
