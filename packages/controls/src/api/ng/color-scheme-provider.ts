import { inject, provideAppInitializer } from '@angular/core';

import {
  COLOR_SCHEME_STORAGE,
  COLOR_SCHEME_STORAGE_KEY,
  COLOR_SCHEME_VALUES,
  type ColorScheme,
  type ColorSchemeStorage,
  ColorSchemeService,
} from './color-scheme';

import type { JigFeature } from './provider';

export type ColorSchemeStorageOption = 'local' | 'session' | ColorSchemeStorage;

function webStorage(kind: 'local' | 'session'): ColorSchemeStorage {
  return {
    get(): ColorScheme | null {
      try {
        const store = kind === 'local' ? localStorage : sessionStorage;
        const v = store.getItem(COLOR_SCHEME_STORAGE_KEY) as ColorScheme | null;
        return v && COLOR_SCHEME_VALUES.includes(v) ? v : null;
      } catch {
        return null;
      }
    },
    set(value: ColorScheme): void {
      try {
        const store = kind === 'local' ? localStorage : sessionStorage;
        store.setItem(COLOR_SCHEME_STORAGE_KEY, value);
      } catch {
        // ignore (private mode / blocked storage)
      }
    },
  };
}

function resolveStorage(option: ColorSchemeStorageOption | undefined): ColorSchemeStorage {
  if (option === 'session') return webStorage('session');
  if (option === 'local' || option === undefined) return webStorage('local');
  return option;
}

export function colorSchemeInitScript(options?: { storage?: 'local' | 'session' }): string {
  const store = options?.storage === 'session' ? 'sessionStorage' : 'localStorage';
  return (
    `(function(){try{` +
    `var k='${COLOR_SCHEME_STORAGE_KEY}';` +
    `var s=${store}.getItem(k);` +
    `var sys=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';` +
    `var m=(s==='light'||s==='dark')?s:sys;` +
    `if(m==='dark')document.documentElement.classList.add('dark');` +
    `}catch(e){}})();`
  );
}

export function withAutoColorScheme(options?: { storage?: ColorSchemeStorageOption }): JigFeature {
  return {
    providers: [
      ColorSchemeService,
      { provide: COLOR_SCHEME_STORAGE, useValue: resolveStorage(options?.storage) },
      // Sole purpose: eagerly instantiate the service so its constructor effects run.
      provideAppInitializer(() => {
        inject(ColorSchemeService);
      }),
    ],
  };
}
