import {
  computed,
  effect,
  inject,
  Injectable,
  InjectionToken,
  signal,
  type Signal,
} from '@angular/core';
import { toggleClass } from '@awdlab/jig/utils';

import { Platform } from './platform';

export type ColorScheme = 'light' | 'dark' | 'system';

/** Storage key shared by ColorSchemeService and colorSchemeInitScript. */
export const COLOR_SCHEME_STORAGE_KEY = 'jig-color-scheme';

/** Synchronous storage for the color-scheme preference (raw enum string, not JSON). */
export interface ColorSchemeStorage {
  get(): ColorScheme | null;
  set(value: ColorScheme): void;
}

export const COLOR_SCHEME_STORAGE = new InjectionToken<ColorSchemeStorage>('COLOR_SCHEME_STORAGE');

/** All valid {@link ColorScheme} values; used to validate values read from storage. */
export const COLOR_SCHEME_VALUES: readonly ColorScheme[] = ['light', 'dark', 'system'];
/** Cycling order for the UI button; reorder here without affecting storage validation. */
const CYCLE: readonly ColorScheme[] = ['light', 'dark', 'system'];

@Injectable()
export class ColorSchemeService {
  private readonly _platform = inject(Platform);
  private readonly _storage = inject(COLOR_SCHEME_STORAGE);

  // Must be declared after _platform and _storage: readInitial() reads both.
  private readonly _preference = signal<ColorScheme>(this.readInitial());

  public readonly preference: Signal<ColorScheme> = this._preference;
  public readonly resolved: Signal<'light' | 'dark'> = computed(() => {
    const pref = this._preference();
    return pref === 'system' ? this._platform.prefersColorScheme() : pref;
  });
  public readonly isDark: Signal<boolean> = computed(() => this.resolved() === 'dark');

  constructor() {
    if (!this._platform.isBrowser) {
      return;
    }
    // Use the real browser document, not inject(DOCUMENT), so the dark class lands
    // on the actual <html> element (matches the theme's :root scope; the SSR mock is a different object).
    const doc = document;
    effect(() => {
      toggleClass(doc.documentElement, 'dark', this.isDark());
    });
    effect(() => {
      this._storage.set(this._preference());
    });
  }

  public set(pref: ColorScheme): void {
    this._preference.set(pref);
  }

  public cycle(): void {
    const i = CYCLE.indexOf(this._preference());
    this._preference.set(CYCLE[(i + 1) % CYCLE.length] ?? 'system');
  }

  private readInitial(): ColorScheme {
    if (!this._platform.isBrowser) {
      return 'system';
    }
    const stored = this._storage.get();
    return stored && COLOR_SCHEME_VALUES.includes(stored) ? stored : 'system';
  }
}
