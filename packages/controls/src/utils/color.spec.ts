import { describe, expect, it } from 'vitest';

import { formatColor, hsvaToRgba, parseColor, rgbaToHsva } from './color';

describe('color utils', () => {
  it('parses hex', () => {
    expect(parseColor('#ff0000')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    expect(parseColor('#f00')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    expect(parseColor('#ff000080')?.a).toBeCloseTo(0.5, 1);
  });

  it('parses rgb/rgba', () => {
    expect(parseColor('rgb(10, 20, 30)')).toEqual({ r: 10, g: 20, b: 30, a: 1 });
    expect(parseColor('rgba(10, 20, 30, 0.5)')).toEqual({ r: 10, g: 20, b: 30, a: 0.5 });
  });

  it('parses hsl', () => {
    const red = parseColor('hsl(0, 100%, 50%)');
    expect(red?.r).toBe(255);
    expect(red?.g).toBe(0);
    expect(red?.b).toBe(0);
  });

  it('returns null for garbage', () => {
    expect(parseColor('not-a-color')).toBeNull();
  });

  it('round-trips rgb <-> hsv', () => {
    const original = { r: 123, g: 45, b: 200, a: 1 };
    const back = hsvaToRgba(rgbaToHsva(original));
    expect(back.r).toBeCloseTo(123, 0);
    expect(back.g).toBeCloseTo(45, 0);
    expect(back.b).toBeCloseTo(200, 0);
  });

  it('formats', () => {
    const c = { r: 255, g: 0, b: 0, a: 0.5 };
    expect(formatColor(c, 'hex', false)).toBe('#ff0000');
    expect(formatColor(c, 'hex', true)).toBe('#ff000080');
    expect(formatColor(c, 'rgb', true)).toBe('rgba(255, 0, 0, 0.5)');
    expect(formatColor({ r: 255, g: 0, b: 0, a: 1 }, 'hsl', false)).toBe('hsl(0, 100%, 50%)');
  });

  it('formats hsl for a non-primary mid-tone color', () => {
    // rgb(204, 128, 51) == hsl(30, 60%, 50%)
    expect(formatColor({ r: 204, g: 128, b: 51, a: 1 }, 'hsl', false)).toBe('hsl(30, 60%, 50%)');
  });

  it('formats hsla with alpha < 1', () => {
    expect(formatColor({ r: 204, g: 128, b: 51, a: 0.4 }, 'hsl', true)).toBe(
      'hsla(30, 60%, 50%, 0.4)'
    );
  });

  it('clamps out-of-range rgb components', () => {
    expect(parseColor('rgb(300, -10, 500)')).toEqual({ r: 255, g: 0, b: 255, a: 1 });
  });

  it('parses 4-digit hex with alpha', () => {
    const c = parseColor('#f008');
    expect(c?.r).toBe(255);
    expect(c?.g).toBe(0);
    expect(c?.b).toBe(0);
    expect(c?.a).toBeCloseTo(0.533, 2);
  });

  it('wraps out-of-range hsl hue', () => {
    expect(parseColor('hsl(720, 100%, 50%)')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
  });
});
