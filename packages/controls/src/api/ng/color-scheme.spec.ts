import { signal, type WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import {
  COLOR_SCHEME_STORAGE,
  type ColorScheme,
  type ColorSchemeStorage,
  ColorSchemeService,
} from './color-scheme';
import { Platform } from './platform';

class FakePlatform {
  public isBrowser = true;
  public prefers: WritableSignal<'light' | 'dark'> = signal('light');
  public prefersColorScheme = this.prefers;
}

class MemoryStorage implements ColorSchemeStorage {
  public value: ColorScheme | null = null;
  public get() {
    return this.value;
  }
  public set(v: ColorScheme) {
    this.value = v;
  }
}

function setup(initial: ColorScheme | null, platform = new FakePlatform()) {
  const storage = new MemoryStorage();
  storage.value = initial;
  TestBed.configureTestingModule({
    providers: [
      ColorSchemeService,
      { provide: Platform, useValue: platform },
      { provide: COLOR_SCHEME_STORAGE, useValue: storage },
    ],
  });
  const service = TestBed.inject(ColorSchemeService);
  return { service, storage, platform };
}

function htmlHasDark() {
  return document.documentElement.classList.contains('dark');
}

describe('ColorSchemeService', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark');
  });

  it('defaults to system when storage is empty', () => {
    const { service } = setup(null);
    expect(service.preference()).toBe('system');
  });

  it('initializes preference from storage', () => {
    const { service } = setup('dark');
    expect(service.preference()).toBe('dark');
  });

  it('resolves system to the OS preference', () => {
    const platform = new FakePlatform();
    platform.prefers.set('dark');
    const { service } = setup('system', platform);
    expect(service.resolved()).toBe('dark');
    expect(service.isDark()).toBe(true);
  });

  it('pinned preference ignores OS changes', () => {
    const platform = new FakePlatform();
    const { service } = setup('light', platform);
    platform.prefers.set('dark');
    TestBed.tick();
    expect(service.resolved()).toBe('light');
  });

  it('system preference reacts live to OS changes', () => {
    const platform = new FakePlatform();
    const { service } = setup('system', platform);
    expect(service.isDark()).toBe(false);
    platform.prefers.set('dark');
    TestBed.tick();
    expect(service.isDark()).toBe(true);
  });

  it('toggles the dark class on <html> and persists', () => {
    const { service, storage } = setup('light');
    TestBed.tick();
    expect(htmlHasDark()).toBe(false);
    service.set('dark');
    TestBed.tick();
    expect(htmlHasDark()).toBe(true);
    expect(storage.value).toBe('dark');
  });

  it('cycle() goes light -> dark -> system -> light', () => {
    const { service } = setup('light');
    service.cycle();
    expect(service.preference()).toBe('dark');
    service.cycle();
    expect(service.preference()).toBe('system');
    service.cycle();
    expect(service.preference()).toBe('light');
  });

  it('falls back to system for an unrecognized stored value', () => {
    const { service } = setup('unknown' as ColorScheme);
    expect(service.preference()).toBe('system');
  });

  it('defaults to system and registers no effects in SSR', () => {
    const platform = new FakePlatform();
    platform.isBrowser = false;
    const { service } = setup('dark', platform);
    TestBed.tick();
    expect(service.preference()).toBe('system'); // storage ignored on server
  });
});
