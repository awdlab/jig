import { isPlatformBrowser } from '@angular/common';
import { computed, DOCUMENT, inject, Injectable, PLATFORM_ID, Signal, signal } from '@angular/core';

import { elementSizeSignal, Size } from './dom';

export type DeviceType = 'mobile' | 'desktop' | 'tablet';

@Injectable()
export class Platform {
  private readonly _deviceType = signal<DeviceType>('desktop');

  public readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  public readonly windowSize: Signal<Size> = this.isBrowser
    ? elementSizeSignal(document.body)
    : signal({ width: 0, height: 0 });
  public readonly width = computed(() => this.windowSize().width);
  public readonly height = computed(() => this.windowSize().height);

  constructor() {
    const doc = inject(DOCUMENT);
    const win = doc.defaultView;
    if (!win) {
      return;
    }
    if (typeof win.matchMedia !== 'function') {
      return;
    }
    const hasMouse = win.matchMedia('(any-hover: hover)').matches;
    if (hasMouse) {
      this._deviceType.set('desktop');
      return;
    }
    const isSmallScreen =
      window.matchMedia('(max-width: 768px)').matches ||
      window.matchMedia('(max-height: 768px)').matches;
    if (isSmallScreen) {
      this._deviceType.set('mobile');
    } else {
      this._deviceType.set('tablet');
    }
  }

  public readonly isTouchDevice = computed(() => {
    return this._deviceType() === 'mobile' || this._deviceType() === 'tablet';
  });
}
