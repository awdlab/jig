import { describe, expect, it } from 'vitest';

import type { JigFilterAttribute } from './types';

type Person = { id: number; name: string; email: string; active: boolean };
type PropertyBacked = Extract<JigFilterAttribute<Person, Person>, { key: unknown }>;

describe('JigFilterAttribute', () => {
  it('keeps `key` a literal union, so editors can complete it', () => {
    // `string` leaking in would silently disable completions and accept any typo.
    const literal: string extends PropertyBacked['key'] ? false : true = true;
    const covers: 'email' extends PropertyBacked['key'] ? true : false = true;
    expect([literal, covers]).toEqual([true, true]);
  });

  it('accepts a property-backed attribute without a selector', () => {
    const attribute = {
      key: 'email',
      label: 'E-mail',
      dataType: 'string',
    } satisfies JigFilterAttribute<Person, Person>;
    expect(attribute.key).toBe('email');
  });

  it('accepts a computed attribute, which names no property and must select', () => {
    const attribute = {
      computedKey: 'search',
      label: 'Any field',
      dataType: 'custom',
      selector: (p: Person) => `${p.name} ${p.email}`,
    } satisfies JigFilterAttribute<Person, Person>;
    expect(attribute.computedKey).toBe('search');
  });

  it('rejects a key the item does not carry, and a computed key without a selector', () => {
    // @ts-expect-error 'naem' is not a property of Person
    const typo = { key: 'naem', label: 'Name', dataType: 'string' } satisfies JigFilterAttribute<
      Person,
      Person
    >;
    const noSelector = {
      computedKey: 'search',
      label: 'Any field',
      dataType: 'custom',
      // @ts-expect-error a computed attribute must supply a selector
    } satisfies JigFilterAttribute<Person, Person>;
    expect([typo, noSelector]).toHaveLength(2);
  });
});
