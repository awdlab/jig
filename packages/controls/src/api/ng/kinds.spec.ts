import { Injector, runInInjectionContext } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Logger } from '@awdlab/jig/utils';
import { createTheme } from '@awdlab/jig-themes';
import { describe, expect, it, vi } from 'vitest';

import { injectThemeColors, injectThemeControlDefaults, injectThemeControlKinds } from './kinds';
import { provideJigControls } from './provider';

import type { JigConfigInit } from './config';

const preset = createTheme('test', [], {
  kinds: {
    button: ['primary', 'link'] as const,
    tag: ['default', 'pill'] as const,
  },
  colors: ['primary', 'info'] as const,
  defaults: {
    button: { kind: 'link' },
    tag: { kind: 'pill' },
    badge: { color: 'primary' },
  },
});

function configure(config: JigConfigInit['theme']) {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    providers: [provideJigControls({ theme: { preset, ...config } })],
  });
  return TestBed.inject(Injector);
}

describe('injectThemeControlKinds', () => {
  it('prefers the configured kinds over the theme', () => {
    const injector = configure({ kinds: { button: ['primary', 'fancy'] } });
    const kinds = runInInjectionContext(injector, () => injectThemeControlKinds('button'));
    expect(kinds()).toEqual(['primary', 'fancy']);
  });

  it('falls back to the theme for a control with no override', () => {
    const injector = configure({ kinds: { button: ['primary', 'fancy'] } });
    const kinds = runInInjectionContext(injector, () => injectThemeControlKinds('tag'));
    expect(kinds()).toEqual(['default', 'pill']);
  });

  it('returns an empty list when the override removes every kind', () => {
    const injector = configure({ kinds: { button: [] } });
    const kinds = runInInjectionContext(injector, () => injectThemeControlKinds('button'));
    expect(kinds()).toEqual([]);
  });
});

describe('injectThemeColors', () => {
  it('prefers the configured colors over the theme', () => {
    const injector = configure({ colors: ['primary', 'brand'] });
    const colors = runInInjectionContext(injector, () => injectThemeColors());
    expect(colors()).toEqual(['primary', 'brand']);
  });
});

describe('injectThemeControlDefaults', () => {
  it('drops a theme default that the override removed', () => {
    const injector = configure({ kinds: { button: ['primary', 'fancy'] } });
    const defaults = runInInjectionContext(injector, () => injectThemeControlDefaults('button'));
    expect(defaults().kind).toBeUndefined();
  });

  it('keeps a theme default that survived the override', () => {
    const injector = configure({ kinds: { tag: ['default', 'pill'] } });
    const defaults = runInInjectionContext(injector, () => injectThemeControlDefaults('tag'));
    expect(defaults().kind).toBe('pill');
  });

  it('drops a theme default color that the override removed', () => {
    const injector = configure({ colors: ['info'] });
    const defaults = runInInjectionContext(injector, () => injectThemeControlDefaults('badge'));
    expect(defaults().color).toBeUndefined();
  });

  it('keeps a theme default color that survived the override', () => {
    const injector = configure({ colors: ['primary', 'brand'] });
    const defaults = runInInjectionContext(injector, () => injectThemeControlDefaults('badge'));
    expect(defaults().color).toBe('primary');
  });

  it('warns once about a dropped default', () => {
    const warn = vi.spyOn(Logger, 'warn').mockImplementation(() => undefined);
    const injector = configure({
      kinds: { splitter: ['thin'] },
      defaults: { splitter: { kind: 'invisible' } },
    });
    const defaults = runInInjectionContext(injector, () => injectThemeControlDefaults('splitter'));
    defaults();
    defaults();
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0]?.[0]).toContain('invisible');
    warn.mockRestore();
  });

  it('prefers the configured defaults over the theme', () => {
    const injector = configure({ defaults: { button: { kind: 'primary' } } });
    const defaults = runInInjectionContext(injector, () => injectThemeControlDefaults('button'));
    expect(defaults().kind).toBe('primary');
  });
});
