import { describe, expect, it } from 'vitest';

import { clampToBounds, isWithinBounds } from './bounds';

const min = new Date(2026, 2, 10, 18, 0, 0);
const max = new Date(2026, 3, 5, 6, 0, 0);

describe('isWithinBounds', () => {
  it('includes both bound days whatever their time of day', () => {
    expect(isWithinBounds(new Date(2026, 2, 10, 0, 0, 0), min, max)).toBe(true);
    expect(isWithinBounds(new Date(2026, 3, 5, 23, 59, 0), min, max)).toBe(true);
  });

  it('excludes the days just outside the bounds', () => {
    expect(isWithinBounds(new Date(2026, 2, 9), min, max)).toBe(false);
    expect(isWithinBounds(new Date(2026, 3, 6), min, max)).toBe(false);
  });

  it('treats a null bound as open', () => {
    expect(isWithinBounds(new Date(1900, 0, 1), null, max)).toBe(true);
    expect(isWithinBounds(new Date(2100, 0, 1), min, null)).toBe(true);
  });
});

describe('clampToBounds', () => {
  it('moves an early date onto the min day, keeping its time', () => {
    const d = clampToBounds(new Date(2025, 0, 1, 9, 30, 0), min, max);
    expect([d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()]).toEqual([
      2026, 2, 10, 9, 30,
    ]);
  });

  it('moves a late date onto the max day', () => {
    const d = clampToBounds(new Date(2027, 5, 30), min, max);
    expect([d.getFullYear(), d.getMonth(), d.getDate()]).toEqual([2026, 3, 5]);
  });

  it('leaves an in-range date unchanged', () => {
    const date = new Date(2026, 2, 20, 12, 0, 0);
    expect(clampToBounds(date, min, max).getTime()).toBe(date.getTime());
  });
});
