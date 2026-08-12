import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { form, required } from '@angular/forms/signals';
import { describe, expect, it } from 'vitest';

import { tagCount, tagLength } from './validators';

function makeForm(tags: string[] | null) {
  return TestBed.runInInjectionContext(() => {
    const model = signal<{ tags: string[] | null }>({ tags });
    return form(model, path => {
      required(path.tags);
      tagCount(path.tags, { min: 2, max: 3 });
      tagLength(path.tags, { min: 2, max: 5 });
    });
  });
}

function kinds(tags: string[] | null): string[] {
  return makeForm(tags)
    .tags()
    .errors()
    .map(error => error.kind);
}

describe('tag-input validators', () => {
  it('reports required for a null value and skips the tag rules', () => {
    expect(kinds(null)).toEqual(['required']);
  });

  it('accepts a value satisfying every rule', () => {
    expect(kinds(['ab', 'cde'])).toEqual([]);
  });

  it('reports tagCount below the minimum', () => {
    expect(kinds(['ab'])).toContain('tagCount');
  });

  it('reports tagCount above the maximum', () => {
    expect(kinds(['ab', 'cd', 'ef', 'gh'])).toContain('tagCount');
  });

  it('carries the bounds and the actual count on the tagCount error', () => {
    const error = makeForm(['ab'])
      .tags()
      .errors()
      .find(candidate => candidate.kind === 'tagCount');

    expect(error).toMatchObject({ kind: 'tagCount', min: 2, max: 3, count: 1 });
  });

  it('reports tagLength for a tag that is too short, carrying the offender', () => {
    const error = makeForm(['ab', 'c'])
      .tags()
      .errors()
      .find(candidate => candidate.kind === 'tagLength');

    expect(error).toMatchObject({ kind: 'tagLength', min: 2, max: 5, tag: 'c', index: 1 });
  });

  it('reports tagLength for a tag that is too long', () => {
    expect(kinds(['ab', 'toolongvalue'])).toContain('tagLength');
  });

  it('reports a single tagLength error even with several offenders', () => {
    expect(kinds(['a', 'b', 'c']).filter(kind => kind === 'tagLength')).toHaveLength(1);
  });

  it('leaves an unbounded end unchecked', () => {
    const onlyMin = TestBed.runInInjectionContext(() => {
      const model = signal<{ tags: string[] | null }>({ tags: ['a', 'b', 'c', 'd', 'e'] });
      return form(model, path => tagCount(path.tags, { min: 2 }));
    });

    expect(onlyMin.tags().errors()).toEqual([]);
  });
});
