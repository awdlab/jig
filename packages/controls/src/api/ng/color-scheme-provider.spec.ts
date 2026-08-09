import { describe, expect, it, vi } from 'vitest';

import {
  COLOR_SCHEME_STORAGE,
  COLOR_SCHEME_STORAGE_KEY,
  type ColorSchemeStorage,
  ColorSchemeService,
} from './color-scheme';
import { colorSchemeInitScript, withAutoColorScheme } from './color-scheme-provider';

function findStorage(feature: { providers: unknown[] }): ColorSchemeStorage {
  const entry = feature.providers.find(
    (p): p is { provide: unknown; useValue: ColorSchemeStorage } =>
      typeof p === 'object' &&
      p !== null &&
      (p as { provide?: unknown }).provide === COLOR_SCHEME_STORAGE
  );
  if (!entry) throw new Error('storage provider missing');
  return entry.useValue;
}

describe('withAutoColorScheme', () => {
  it('provides ColorSchemeService', () => {
    const feature = withAutoColorScheme();
    expect(feature.providers).toContain(ColorSchemeService);
  });

  it('defaults to localStorage-backed storage that stores the raw string', () => {
    const feature = withAutoColorScheme();
    const storage = findStorage(feature);
    const setSpy = vi.spyOn(Storage.prototype, 'setItem');
    storage.set('dark');
    expect(setSpy).toHaveBeenCalledWith(COLOR_SCHEME_STORAGE_KEY, 'dark');
    setSpy.mockRestore();
  });

  it('accepts a custom storage object', () => {
    const custom: ColorSchemeStorage = { get: () => 'system', set: () => {} };
    const feature = withAutoColorScheme({ storage: custom });
    expect(findStorage(feature)).toBe(custom);
  });

  it('uses sessionStorage when storage is "session"', () => {
    const feature = withAutoColorScheme({ storage: 'session' });
    const storage = findStorage(feature);
    const setSpy = vi.spyOn(Storage.prototype, 'setItem');
    storage.set('dark');
    expect(setSpy).toHaveBeenCalledWith(COLOR_SCHEME_STORAGE_KEY, 'dark');
    // confirm it targeted sessionStorage specifically
    expect(sessionStorage.getItem(COLOR_SCHEME_STORAGE_KEY)).toBe('dark');
    setSpy.mockRestore();
    sessionStorage.removeItem(COLOR_SCHEME_STORAGE_KEY);
  });
});

describe('colorSchemeInitScript', () => {
  it('emits an IIFE referencing the shared key and matchMedia', () => {
    const script = colorSchemeInitScript();
    expect(script).toContain(COLOR_SCHEME_STORAGE_KEY);
    expect(script).toContain('window.matchMedia');
    expect(script).toContain('localStorage');
    expect(script).toContain('prefers-color-scheme: dark');
    expect(script).toContain("classList.add('dark')");
  });

  it('uses sessionStorage when requested', () => {
    const script = colorSchemeInitScript({ storage: 'session' });
    expect(script).toContain('sessionStorage');
    expect(script).not.toContain('localStorage');
  });

  it('is syntactically valid JavaScript', () => {
    expect(() => new Function(colorSchemeInitScript())).not.toThrow();
  });

  function runScript(stored: string | null, osDark: boolean) {
    document.documentElement.classList.remove('dark');
    const getItem = vi.fn(() => stored);
    const matchMedia = vi.fn(() => ({ matches: osDark }));
    vi.stubGlobal('localStorage', { getItem, setItem: () => {}, removeItem: () => {} });
    // The script calls `window.matchMedia(...)`; stub both the bare global and
    // the property on `window` so the call resolves to our mock in any case.
    vi.stubGlobal('matchMedia', matchMedia);
    window.matchMedia = matchMedia as unknown as typeof window.matchMedia;
    new Function(colorSchemeInitScript())();
    // Guard: confirm the script body actually ran (storage was read), so a
    // swallowed try/catch can't make these assertions silently pass.
    expect(getItem).toHaveBeenCalled();
    const hasDark = document.documentElement.classList.contains('dark');
    vi.unstubAllGlobals();
    document.documentElement.classList.remove('dark');
    return hasDark;
  }

  it('applies dark when stored preference is dark', () => {
    expect(runScript('dark', false)).toBe(true);
  });

  it('does not apply dark when stored preference is light (even if OS is dark)', () => {
    expect(runScript('light', true)).toBe(false);
  });

  it('falls back to the OS preference when nothing is stored', () => {
    expect(runScript(null, true)).toBe(true);
    expect(runScript(null, false)).toBe(false);
  });
});
