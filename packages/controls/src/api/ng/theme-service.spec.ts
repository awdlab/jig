import { CSP_NONCE } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { nova } from '@awdlab/jig-themes/nova';
import { afterEach, describe, expect, it } from 'vitest';

import { provideJigControls } from './provider';
import { ThemeService } from './theme-service';

function jigStyles(): HTMLStyleElement[] {
  return Array.from(document.head.querySelectorAll<HTMLStyleElement>('style[jig-style]'));
}

function loadTheme(nonce: string | null): HTMLStyleElement[] {
  TestBed.configureTestingModule({
    providers: [
      provideJigControls({ theme: { preset: nova }, disableAnimations: true }),
      { provide: CSP_NONCE, useValue: nonce },
    ],
  });
  TestBed.inject(ThemeService).loadScope('button');
  return jigStyles();
}

describe('ThemeService', () => {
  afterEach(() => {
    jigStyles().forEach(el => el.remove());
  });

  it('stamps the CSP nonce on every style element it injects', () => {
    const styles = loadTheme('test-nonce');
    expect(styles.length).toBeGreaterThan(0);
    expect(styles.map(el => el.getAttribute('nonce'))).toEqual(styles.map(() => 'test-nonce'));
  });

  it('omits the nonce attribute when no nonce is configured', () => {
    const styles = loadTheme(null);
    expect(styles.length).toBeGreaterThan(0);
    expect(styles.some(el => el.hasAttribute('nonce'))).toBe(false);
  });
});
