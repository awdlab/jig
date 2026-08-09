import { describe, expect, it } from 'vitest';

import { formatDate, parseDate } from './formatter';

describe('parseDate', () => {
  it('parses a basic MM/dd/yyyy string', () => {
    const d = parseDate('03/15/2026', 'MM/dd/yyyy')!;
    expect([d.getFullYear(), d.getMonth(), d.getDate()]).toEqual([2026, 2, 15]);
  });

  it('parses a dd.MM.yyyy string (non-US separators/order)', () => {
    const d = parseDate('15.03.2026', 'dd.MM.yyyy')!;
    expect([d.getFullYear(), d.getMonth(), d.getDate()]).toEqual([2026, 2, 15]);
  });

  it('clamps Feb 31 to Feb 28 in a non-leap year (no rollover to March)', () => {
    const d = parseDate('02/31/2026', 'MM/dd/yyyy')!;
    expect(d.getMonth()).toBe(1); // February, NOT March
    expect(d.getDate()).toBe(28);
  });

  it('clamps Feb 31 to Feb 29 in a leap year', () => {
    const d = parseDate('02/31/2024', 'MM/dd/yyyy')!;
    expect(d.getMonth()).toBe(1);
    expect(d.getDate()).toBe(29);
  });

  it('keeps a valid Feb 29 in a leap year', () => {
    const d = parseDate('02/29/2024', 'MM/dd/yyyy')!;
    expect([d.getMonth(), d.getDate()]).toEqual([1, 29]);
  });

  it('clamps day 31 to 30 for a 30-day month (April)', () => {
    const d = parseDate('04/31/2026', 'MM/dd/yyyy')!;
    expect([d.getMonth(), d.getDate()]).toEqual([3, 30]);
  });

  it('returns null when the string does not match the format', () => {
    expect(parseDate('not-a-date', 'MM/dd/yyyy')).toBeNull();
    expect(parseDate('03-15-2026', 'MM/dd/yyyy')).toBeNull(); // wrong separators
  });

  it('parses time tokens (HH:mm:ss)', () => {
    const d = parseDate('03/15/2026 14:30:45', 'MM/dd/yyyy HH:mm:ss')!;
    expect([d.getHours(), d.getMinutes(), d.getSeconds()]).toEqual([14, 30, 45]);
  });

  it('parses 12-hour time with AM/PM', () => {
    expect(parseDate('01/01/2026 12:00 AM', 'MM/dd/yyyy hh:mm a')!.getHours()).toBe(0);
    expect(parseDate('01/01/2026 12:00 PM', 'MM/dd/yyyy hh:mm a')!.getHours()).toBe(12);
    expect(parseDate('01/01/2026 01:00 PM', 'MM/dd/yyyy hh:mm a')!.getHours()).toBe(13);
    expect(parseDate('01/01/2026 07:00 AM', 'MM/dd/yyyy hh:mm a')!.getHours()).toBe(7);
  });

  it('parses a 2-digit year (yy) as 2000-2099', () => {
    const d = parseDate('15.03.24', 'dd.MM.yy')!;
    expect([d.getFullYear(), d.getMonth(), d.getDate()]).toEqual([2024, 2, 15]);
  });

  it('parses a separator-free format (MMddyyyy)', () => {
    const d = parseDate('06152026', 'MMddyyyy')!;
    expect([d.getFullYear(), d.getMonth(), d.getDate()]).toEqual([2026, 5, 15]);
  });

  it('clamps the day in a separator-free format too', () => {
    const d = parseDate('02312026', 'MMddyyyy')!;
    expect([d.getMonth(), d.getDate()]).toEqual([1, 28]); // Feb 28
  });

  it('rejects an out-of-range month instead of rolling into the next year', () => {
    expect(parseDate('13/15/2026', 'MM/dd/yyyy')).toBeNull();
    expect(parseDate('00/15/2026', 'MM/dd/yyyy')).toBeNull();
  });

  it('rejects out-of-range time components', () => {
    expect(parseDate('03/15/2026 25:00:00', 'MM/dd/yyyy HH:mm:ss')).toBeNull();
    expect(parseDate('03/15/2026 12:75:00', 'MM/dd/yyyy HH:mm:ss')).toBeNull();
    expect(parseDate('01/01/2026 13:00 PM', 'MM/dd/yyyy hh:mm a')).toBeNull(); // 13 invalid for 12h
  });

  it('round-trips with formatDate for a valid date', () => {
    const fmt = 'dd.MM.yyyy';
    const d = parseDate('28.02.2026', fmt)!;
    expect(formatDate(d, fmt)).toBe('28.02.2026');
  });
});
