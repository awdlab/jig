import { describe, expect, it } from 'vitest';

import { getDateOrTimeMask, DATE_TIME_MASKS } from './masks-date-time';

import type { InputMaskCfg, NumberSegment, EnumSegment, MaskSegment } from './types';

function findSegment(mask: InputMaskCfg, segmentName: string): MaskSegment | undefined {
  return mask.find(
    entry => typeof entry === 'object' && 'segment' in entry && entry.segment === segmentName
  ) as MaskSegment | undefined;
}

function separators(mask: InputMaskCfg): string[] {
  return mask.filter(entry => typeof entry === 'string') as string[];
}

describe('getDateOrTimeMask', () => {
  it('should parse HH:mm:ss into hour24, minute, second segments', () => {
    const mask = getDateOrTimeMask('HH:mm:ss');
    // HH → one NumberSegment, : → literal, mm → one NumberSegment, : → literal, ss → one NumberSegment
    // 3 segments + 2 separators = 5 items
    expect(mask).toHaveLength(5);

    const hour = findSegment(mask, 'hour24') as NumberSegment;
    expect(hour).toBeDefined();
    expect(hour.kind).toBe('number');
    expect(hour.min).toBe(0);
    expect(hour.max).toBe(23);
    expect(hour.length).toBe(2);

    const minute = findSegment(mask, 'minute') as NumberSegment;
    expect(minute).toBeDefined();
    expect(minute.min).toBe(0);
    expect(minute.max).toBe(59);
    expect(minute.length).toBe(2);

    const second = findSegment(mask, 'second') as NumberSegment;
    expect(second).toBeDefined();
    expect(second.min).toBe(0);
    expect(second.max).toBe(59);
    expect(second.length).toBe(2);

    expect(separators(mask)).toEqual([':', ':']);
  });

  it('should parse hh:mm:ss a into hour12, minute, second, period segments', () => {
    const mask = getDateOrTimeMask('hh:mm:ss a');
    // hh → hour12, : → sep, mm → minute, : → sep, ss → second, ' ' → sep, a → period
    expect(mask).toHaveLength(7);

    const hour = findSegment(mask, 'hour12') as NumberSegment;
    expect(hour).toBeDefined();
    expect(hour.min).toBe(1);
    expect(hour.max).toBe(12);
    expect(hour.length).toBe(2);

    const period = findSegment(mask, 'period') as EnumSegment;
    expect(period).toBeDefined();
    expect(period.kind).toBe('enum');
    expect(period.values).toEqual(['AM', 'PM']);
    expect(period.length).toBe(2);

    expect(separators(mask)).toEqual([':', ':', ' ']);
  });

  it('should parse MM/dd/yyyy into month, day, year segments', () => {
    const mask = getDateOrTimeMask('MM/dd/yyyy');
    expect(mask).toHaveLength(5);

    const month = findSegment(mask, 'month') as NumberSegment;
    expect(month).toBeDefined();
    expect(month.min).toBe(1);
    expect(month.max).toBe(12);
    expect(month.length).toBe(2);

    const day = findSegment(mask, 'day') as NumberSegment;
    expect(day).toBeDefined();
    expect(day.min).toBe(1);
    expect(day.max).toBe(31);
    expect(day.length).toBe(2);

    const year = findSegment(mask, 'year') as NumberSegment;
    expect(year).toBeDefined();
    expect(year.min).toBe(0);
    expect(year.max).toBe(9999);
    expect(year.length).toBe(4);

    expect(separators(mask)).toEqual(['/', '/']);
  });

  it('should parse HH:mm (short time) without seconds', () => {
    const mask = getDateOrTimeMask('HH:mm');
    expect(mask).toHaveLength(3);

    expect(findSegment(mask, 'hour24')).toBeDefined();
    expect(findSegment(mask, 'minute')).toBeDefined();
    expect(findSegment(mask, 'second')).toBeUndefined();
  });

  it('should handle single-char format symbols', () => {
    const mask = getDateOrTimeMask('H:m');
    const hour = findSegment(mask, 'hour24') as NumberSegment;
    expect(hour.length).toBe(1);

    const minute = findSegment(mask, 'minute') as NumberSegment;
    expect(minute.length).toBe(1);
  });

  it('should handle fractional seconds', () => {
    const mask = getDateOrTimeMask('HH:mm:ss.SSS');
    const frac = findSegment(mask, 'fractionalSecond') as NumberSegment;
    expect(frac).toBeDefined();
    expect(frac.min).toBe(0);
    expect(frac.max).toBe(999);
    expect(frac.length).toBe(3);
  });

  it('should preserve literal characters', () => {
    const mask = getDateOrTimeMask('dd-MM-yyyy');
    expect(separators(mask)).toEqual(['-', '-']);
  });
});

describe('DATE_TIME_MASKS', () => {
  it('should have date mask (MM/dd/yyyy)', () => {
    const mask = DATE_TIME_MASKS.date;
    expect(findSegment(mask, 'month')).toBeDefined();
    expect(findSegment(mask, 'day')).toBeDefined();
    expect(findSegment(mask, 'year')).toBeDefined();
  });

  it('should have time mask (HH:mm:ss)', () => {
    const mask = DATE_TIME_MASKS.time;
    expect(findSegment(mask, 'hour24')).toBeDefined();
    expect(findSegment(mask, 'minute')).toBeDefined();
    expect(findSegment(mask, 'second')).toBeDefined();
  });

  it('should have timeShort mask (HH:mm)', () => {
    const mask = DATE_TIME_MASKS.timeShort;
    expect(findSegment(mask, 'hour24')).toBeDefined();
    expect(findSegment(mask, 'minute')).toBeDefined();
    expect(findSegment(mask, 'second')).toBeUndefined();
  });

  it('should have time12 mask (hh:mm:ss a)', () => {
    const mask = DATE_TIME_MASKS.time12;
    expect(findSegment(mask, 'hour12')).toBeDefined();
    expect(findSegment(mask, 'minute')).toBeDefined();
    expect(findSegment(mask, 'second')).toBeDefined();
    expect(findSegment(mask, 'period')).toBeDefined();
  });
});
