import { computed, DOCUMENT, inject, Injectable, signal } from '@angular/core';

export type DeviceType = 'mobile' | 'desktop' | 'tablet';

@Injectable()
export class Platform {
  private readonly _deviceType = signal<DeviceType>('desktop');

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
