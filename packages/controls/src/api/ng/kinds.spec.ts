import { Injector, runInInjectionContext } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { createTheme } from '@awdlab/jig-themes';
import { describe, expect, it } from 'vitest';

import { injectThemeColors, injectThemeControlDefaults, injectThemeControlKinds } from './kinds';
import { provideJigControls } from './provider';

import type { JigConfigInit } from './config';

const preset = createTheme('test', [], {
  kinds: {
    button: ['primary', 'link'] as const,
    tag: ['default', 'pill'] as const,
  },
  colors: ['primary', 'info'] as const,
  defaults: { button: { kind: 'link' }, tag: { kind: 'pill' } },
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

  it('prefers the configured defaults over the theme', () => {
    const injector = configure({ defaults: { button: { kind: 'primary' } } });
    const defaults = runInInjectionContext(injector, () => injectThemeControlDefaults('button'));
    expect(defaults().kind).toBe('primary');
  });
});
