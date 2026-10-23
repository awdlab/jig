import { describe, expect, it } from 'vitest';

import type { JigFilterProperty } from './types';

type Person = { id: number; name: string; email: string; active: boolean };
type PropertyBacked = Extract<JigFilterProperty<Person, Person>, { key: unknown }>;

describe('JigFilterProperty', () => {
  it('keeps `key` a literal union, so editors can complete it', () => {
    // `string` leaking in would silently disable completions and accept any typo.
    const literal: string extends PropertyBacked['key'] ? false : true = true;
    const covers: 'email' extends PropertyBacked['key'] ? true : false = true;
    expect([literal, covers]).toEqual([true, true]);
  });

  it('accepts a property-backed property without a selector', () => {
    const property = {
      key: 'email',
      label: 'E-mail',
      dataType: 'string',
    } satisfies JigFilterProperty<Person, Person>;
    expect(property.key).toBe('email');
  });

  it('accepts a computed property, which names no property and must select', () => {
    const property = {
      computedKey: 'search',
      label: 'Any field',
      dataType: 'custom',
      selector: (p: Person) => `${p.name} ${p.email}`,
    } satisfies JigFilterProperty<Person, Person>;
    expect(property.computedKey).toBe('search');
  });

  it('reads a known property its own way, keeping the key as the identifier', () => {
    const property = {
      key: 'email',
      label: 'Domain',
      dataType: 'string',
      selector: (p: Person) => p.email.split('@')[1],
    } satisfies JigFilterProperty<Person, Person>;
    expect(property.selector({ email: 'a@b.com' } as Person)).toBe('b.com');
  });

  it('rejects naming both a property key and a computed key', () => {
    const both = {
      key: 'email',
      computedKey: 'search',
      label: 'L',
      dataType: 'string',
      selector: (p: Person) => p.name,
      // @ts-expect-error an property is identified one way or the other, not both
    } satisfies JigFilterProperty<Person, Person>;
    expect(both.key).toBe('email');
  });

  it('rejects a key the item does not carry, and a computed key without a selector', () => {
    // @ts-expect-error 'naem' is not a property of Person
    const typo = { key: 'naem', label: 'Name', dataType: 'string' } satisfies JigFilterProperty<
      Person,
      Person
    >;
    const noSelector = {
      computedKey: 'search',
      label: 'Any field',
      dataType: 'custom',
      // @ts-expect-error a computed property must supply a selector
    } satisfies JigFilterProperty<Person, Person>;
    void noSelector;
    expect([typo, noSelector]).toHaveLength(2);
  });
});
