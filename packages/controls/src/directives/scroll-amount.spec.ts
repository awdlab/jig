import { describe, expect, it } from 'vitest';
import { computeDistanceFromEnd, isWithinEndZone } from './scroll-amount';

describe('computeDistanceFromEnd', () => {
  it('returns full remaining distance at the top', () => {
    // content 1000, viewport 300, scrolled 0 => 700 remaining
    expect(computeDistanceFromEnd(1000, 300, 0)).toBe(700);
  });

  it('returns 0 at the bottom', () => {
    expect(computeDistanceFromEnd(1000, 300, 700)).toBe(0);
  });

  it('never returns negative (overscroll clamps to 0)', () => {
    expect(computeDistanceFromEnd(1000, 300, 800)).toBe(0);
  });

  it('returns 0 when content fits the viewport', () => {
    expect(computeDistanceFromEnd(300, 300, 0)).toBe(0);
  });
});

describe('isWithinEndZone', () => {
  it('is true when distance is at or below the threshold', () => {
    expect(isWithinEndZone(50, 100)).toBe(true);
    expect(isWithinEndZone(100, 100)).toBe(true);
  });
  it('is false when distance exceeds the threshold', () => {
    expect(isWithinEndZone(150, 100)).toBe(false);
  });
});
