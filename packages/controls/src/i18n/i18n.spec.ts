import { TestBed } from '@angular/core/testing';
import { provideJigControls } from '@awdlab/jig/api/ng';
import { afterEach, describe, expect, it } from 'vitest';

import { I18n } from './i18n';

function setup(config?: Parameters<typeof provideJigControls>[0]): I18n {
  TestBed.configureTestingModule({ providers: [provideJigControls(config)] });
  return TestBed.inject(I18n);
}

describe('I18n', () => {
  afterEach(() => {
    document.documentElement.lang = 'en';
  });

  it('adopts the document language', () => {
    document.documentElement.lang = 'de';
    expect(setup().language()).toBe('de');
  });

  it('falls back to en without a document language', () => {
    document.documentElement.lang = '';
    expect(setup().language()).toBe('en');
  });

  it('prefers an explicit language', () => {
    document.documentElement.lang = 'de';
    expect(setup({ language: 'en' }).language()).toBe('en');
  });

  it('keeps the document language in sync', () => {
    document.documentElement.lang = 'de';
    setup().setLanguage('en');
    TestBed.tick();
    expect(document.documentElement.lang).toBe('en');
  });

  it('leaves the document language alone when the sync is off', () => {
    document.documentElement.lang = 'de';
    setup({ syncDocumentLang: false }).setLanguage('en');
    TestBed.tick();
    expect(document.documentElement.lang).toBe('de');
  });

  it('does not change the document language on startup', () => {
    document.documentElement.lang = 'de';
    setup();
    TestBed.tick();
    expect(document.documentElement.lang).toBe('de');
  });
});
