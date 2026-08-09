import { describe, expect, it } from 'vitest';

import {
  clampValue,
  decimalPlaces,
  localeNumberInfo,
  parseLocaleNumber,
  roundToPrecision,
  stepNumberValue,
} from './helper';

const en = localeNumberInfo('en-US');
const de = localeNumberInfo('de-DE');
const fr = localeNumberInfo('fr-FR');

describe('localeNumberInfo', () => {
  it('derives separators per locale', () => {
    expect(en).toEqual({ decimal: '.', group: ',', digits: null });
    expect(de).toEqual({ decimal: ',', group: '.', digits: null });
    expect(fr.decimal).toBe(',');
  });
});

describe('parseLocaleNumber', () => {
  it('parses plain and grouped en-US numbers', () => {
    expect(parseLocaleNumber('1234.5', en)).toEqual({ kind: 'value', value: 1234.5 });
    expect(parseLocaleNumber('1,234.5', en)).toEqual({ kind: 'value', value: 1234.5 });
    expect(parseLocaleNumber('-12', en)).toEqual({ kind: 'value', value: -12 });
    expect(parseLocaleNumber('+12', en)).toEqual({ kind: 'value', value: 12 });
    expect(parseLocaleNumber('.5', en)).toEqual({ kind: 'value', value: 0.5 });
  });

  it('parses de-DE numbers (comma decimal, dot grouping)', () => {
    expect(parseLocaleNumber('1234,5', de)).toEqual({ kind: 'value', value: 1234.5 });
    expect(parseLocaleNumber('1.234,5', de)).toEqual({ kind: 'value', value: 1234.5 });
    // Documented locale trade-off: '.' is the de grouping separator and is stripped.
    expect(parseLocaleNumber('1.5', de)).toEqual({ kind: 'value', value: 15 });
  });

  it('parses fr-FR numbers typed with plain spaces', () => {
    expect(parseLocaleNumber('1 234,5', fr)).toEqual({ kind: 'value', value: 1234.5 });
  });

  it('parses non-Latin digit glyphs (ar-EG)', () => {
    const ar = localeNumberInfo('ar-EG');
    // Arabic-Indic numerals produced by the locale's own formatter.
    const formatted = new Intl.NumberFormat('ar-EG', { useGrouping: false }).format(1234.5);
    expect(formatted).not.toMatch(/[0-9]/); // sanity: really non-ASCII digits
    expect(parseLocaleNumber(formatted, ar)).toEqual({ kind: 'value', value: 1234.5 });
  });

  it('accepts exponent notation', () => {
    expect(parseLocaleNumber('1e3', en)).toEqual({ kind: 'value', value: 1000 });
    expect(parseLocaleNumber('1.5e-2', en)).toEqual({ kind: 'value', value: 0.015 });
  });

  it('returns empty for blank text', () => {
    expect(parseLocaleNumber('', en)).toEqual({ kind: 'empty' });
    expect(parseLocaleNumber('   ', en)).toEqual({ kind: 'empty' });
  });

  it('returns invalid for non-numeric text', () => {
    expect(parseLocaleNumber('abc', en)).toEqual({ kind: 'invalid' });
    expect(parseLocaleNumber('1..2', en)).toEqual({ kind: 'invalid' });
    expect(parseLocaleNumber('-', en)).toEqual({ kind: 'invalid' });
    expect(parseLocaleNumber('Infinity', en)).toEqual({ kind: 'invalid' });
    expect(parseLocaleNumber('0x10', en)).toEqual({ kind: 'invalid' });
    // ',' only stripped when it is the grouping separator
    expect(parseLocaleNumber('1,5', de)).toEqual({ kind: 'value', value: 1.5 });
  });
});

describe('decimalPlaces / roundToPrecision', () => {
  it('counts decimal places', () => {
    expect(decimalPlaces(1)).toBe(0);
    expect(decimalPlaces(0.1)).toBe(1);
    expect(decimalPlaces(0.25)).toBe(2);
    expect(decimalPlaces(1e-3)).toBe(3);
  });

  it('rounds to a precision', () => {
    expect(roundToPrecision(0.30000000000000004, 1)).toBe(0.3);
    expect(roundToPrecision(1.005, 1)).toBe(1);
  });
});

describe('clampValue', () => {
  it('clamps into bounds, open bounds pass through', () => {
    expect(clampValue(5, 0, 10)).toBe(5);
    expect(clampValue(-5, 0, 10)).toBe(0);
    expect(clampValue(15, 0, 10)).toBe(10);
    expect(clampValue(15, undefined, undefined)).toBe(15);
  });
});

describe('stepNumberValue', () => {
  it('steps plainly without snapping to a grid', () => {
    expect(stepNumberValue(7, 1, 5, 0, 100)).toBe(12);
    expect(stepNumberValue(7, -1, 5, 0, 100)).toBe(2);
  });

  it('never shows float drift', () => {
    expect(stepNumberValue(0.2, 1, 0.1)).toBe(0.3);
    expect(stepNumberValue(0.3, -1, 0.1)).toBe(0.2);
    expect(stepNumberValue(0.35, 1, 0.1)).toBe(0.45);
  });

  it('clamps at the bounds instead of wrapping', () => {
    expect(stepNumberValue(9, 1, 5, 0, 10)).toBe(10);
    expect(stepNumberValue(10, 1, 5, 0, 10)).toBe(10);
    expect(stepNumberValue(1, -1, 5, 0, 10)).toBe(0);
  });

  it('seeds from null at min/max, falling back to 0', () => {
    expect(stepNumberValue(null, 1, 1, 5, 10)).toBe(5);
    expect(stepNumberValue(null, -1, 1, 5, 10)).toBe(10);
    expect(stepNumberValue(null, 1, 1)).toBe(0);
    expect(stepNumberValue(null, -1, 1)).toBe(0);
    // seed is clamped when the opposite bound crowds it
    expect(stepNumberValue(null, 1, 1, undefined, -5)).toBe(-5);
  });
});
