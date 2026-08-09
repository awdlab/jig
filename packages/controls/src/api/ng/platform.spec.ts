import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Platform } from './platform';

type MqlListener = (e: { matches: boolean }) => void;

function mockMatchMedia(initialDark: boolean) {
  const listeners: MqlListener[] = [];
  const mql = {
    matches: initialDark,
    media: '(prefers-color-scheme: dark)',
    addEventListener: (_: string, l: MqlListener) => listeners.push(l),
    removeEventListener: (_: string, l: MqlListener) => {
      const i = listeners.indexOf(l);
      if (i >= 0) listeners.splice(i, 1);
    },
  };
  vi.stubGlobal(
    'matchMedia',
    vi.fn((q: string) => {
      if (q.includes('prefers-color-scheme')) return mql;
      return { matches: false, media: q, addEventListener() {}, removeEventListener() {} };
    })
  );
  return {
    emit: (dark: boolean) => {
      mql.matches = dark;
      listeners.forEach(l => l({ matches: dark }));
    },
  };
}

describe('Platform.prefersColorScheme', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('reads the initial OS preference', () => {
    mockMatchMedia(true);
    const platform = TestBed.configureTestingModule({ providers: [Platform] }).inject(Platform);
    expect(platform.prefersColorScheme()).toBe('dark');
  });

  it('reacts live to OS preference changes', () => {
    const mq = mockMatchMedia(false);
    const platform = TestBed.configureTestingModule({ providers: [Platform] }).inject(Platform);
    expect(platform.prefersColorScheme()).toBe('light');
    mq.emit(true);
    expect(platform.prefersColorScheme()).toBe('dark');
  });

  it('defaults to light when matchMedia is unavailable (SSR)', () => {
    // In JSDOM document.defaultView === window, so stubbing the global also clears
    // win.matchMedia, tripping Platform's guard exactly as it would on the server.
    vi.stubGlobal('matchMedia', undefined);
    const platform = TestBed.configureTestingModule({ providers: [Platform] }).inject(Platform);
    expect(platform.prefersColorScheme()).toBe('light');
  });
});
