import { isPlatformBrowser } from '@angular/common';
import {
  computed,
  DestroyRef,
  DOCUMENT,
  inject,
  Injectable,
  PLATFORM_ID,
  type Signal,
  signal,
} from '@angular/core';

import { elementSizeSignal, type Size } from './dom';

export type DeviceType = 'mobile' | 'desktop' | 'tablet';

@Injectable()
export class Platform {
  private readonly _deviceType = signal<DeviceType>('desktop');
  private readonly _prefersColorScheme = signal<'light' | 'dark'>('light');

  public readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  public readonly windowSize: Signal<Size> = this.isBrowser
    ? elementSizeSignal(document.body)
    : signal({ width: 0, height: 0 });
  public readonly width = computed(() => this.windowSize().width);
  public readonly height = computed(() => this.windowSize().height);

  public readonly prefersColorScheme: Signal<'light' | 'dark'> = this._prefersColorScheme;

  constructor() {
    const doc = inject(DOCUMENT);
    const destroyRef = inject(DestroyRef);
    const win = doc.defaultView;
    if (!win || typeof win.matchMedia !== 'function') {
      return;
    }

    // color scheme detection (before device-type early returns)
    const colorMql = win.matchMedia('(prefers-color-scheme: dark)');
    this._prefersColorScheme.set(colorMql.matches ? 'dark' : 'light');
    const onColorChange = (e: MediaQueryListEvent) =>
      this._prefersColorScheme.set(e.matches ? 'dark' : 'light');
    colorMql.addEventListener('change', onColorChange);
    destroyRef.onDestroy(() => colorMql.removeEventListener('change', onColorChange));

    // device type
    const hasMouse = win.matchMedia('(any-hover: hover)').matches;
    if (hasMouse) {
      this._deviceType.set('desktop');
      return;
    }
    const isSmallScreen =
      win.matchMedia('(max-width: 768px)').matches || win.matchMedia('(max-height: 768px)').matches;
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
