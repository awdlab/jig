import { CSP_NONCE } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { nova } from '@awdlab/jig-themes/nova';
import { afterEach, describe, expect, it } from 'vitest';

import { provideJigControls } from './provider';
import { ThemeService } from './theme-service';

import type { JigConfigInit } from './config';

function jigStyles(): HTMLStyleElement[] {
  return Array.from(document.head.querySelectorAll<HTMLStyleElement>('style[jig-style]'));
}

function loadTheme(config: JigConfigInit, scopes: string[] = ['button'], nonce?: string | null) {
  TestBed.configureTestingModule({
    providers: [
      provideJigControls({ disableAnimations: true, ...config }),
      ...(nonce === undefined ? [] : [{ provide: CSP_NONCE, useValue: nonce }]),
    ],
  });
  const service = TestBed.inject(ThemeService);
  scopes.forEach(scope => service.loadScope(scope));
  return jigStyles();
}

const themed = (extra?: JigConfigInit['theme']): JigConfigInit => ({
  theme: { preset: nova, ...extra },
});

describe('ThemeService', () => {
  afterEach(() => {
    jigStyles().forEach(el => el.remove());
  });

  it('stamps the CSP nonce on every style element it injects', () => {
    const styles = loadTheme(themed(), ['button'], 'test-nonce');
    expect(styles.length).toBeGreaterThan(0);
    expect(styles.map(el => el.getAttribute('nonce'))).toEqual(styles.map(() => 'test-nonce'));
  });

  it('omits the nonce attribute when no nonce is configured', () => {
    const styles = loadTheme(themed(), ['button'], null);
    expect(styles.length).toBeGreaterThan(0);
    expect(styles.some(el => el.hasAttribute('nonce'))).toBe(false);
  });

  it('emits rules at :root when no style scope is configured', () => {
    const css = loadTheme(themed(), ['button'])
      .map(el => el.textContent)
      .join('\n');
    expect(css).toContain(':root {');
    expect(css).toContain('&.dark {');
  });

  it('emits rules under the configured style scope', () => {
    const css = loadTheme(themed({ styleScope: { kind: 'class', name: 'my-app' } }), ['button'])
      .map(el => el.textContent)
      .join('\n');
    expect(css).toContain('.my-app {');
    expect(css).not.toContain(':root {');
    // `dark` lives on the document element, so it has to match an ancestor of the scope.
    expect(css).toContain(':root.dark & {');
  });

  it('scopes selector-bearing at-rules but leaves keyframes alone', () => {
    const css = loadTheme(themed({ styleScope: { kind: 'class', name: 'my-app' } }), [
      'splitter',
      'tooltip',
    ])
      .map(el => el.textContent)
      .join('\n');
    expect(css).toMatch(/@media[^{]*\{\s*\.my-app\s*\{/);
    expect(css).toMatch(/@keyframes[^{]*\{\s*from\s*\{/);
    expect(css).not.toMatch(/@keyframes[^{]*\{\s*\.my-app/);
  });
});
