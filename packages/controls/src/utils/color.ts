/** RGBA color. r/g/b are 0–255, a is 0–1. */
export type RGBA = { r: number; g: number; b: number; a: number };
/** HSVA color. h is 0–360, s/v/a are 0–1. */
export type HSVA = { h: number; s: number; v: number; a: number };
/** Supported serialization formats. */
export type ColorFormat = 'hex' | 'rgb' | 'hsl';

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
const round = (n: number) => Math.round(n);

/** Parse a hex / rgb(a) / hsl(a) string into RGBA, or null if unrecognized. */
export function parseColor(input: string): RGBA | null {
  const s = input.trim().toLowerCase();

  // hex
  const hex = s.match(/^#([0-9a-f]{3,8})$/);
  if (hex) {
    const h = hex[1]!;
    if (h.length === 3 || h.length === 4) {
      const r = parseInt(h[0]! + h[0]!, 16);
      const g = parseInt(h[1]! + h[1]!, 16);
      const b = parseInt(h[2]! + h[2]!, 16);
      const a = h.length === 4 ? parseInt(h[3]! + h[3]!, 16) / 255 : 1;
      return { r, g, b, a };
    }
    if (h.length === 6 || h.length === 8) {
      const r = parseInt(h.slice(0, 2), 16);
      const g = parseInt(h.slice(2, 4), 16);
      const b = parseInt(h.slice(4, 6), 16);
      const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
      return { r, g, b, a };
    }
    return null;
  }

  // rgb / rgba
  const rgb = s.match(
    /^rgba?\(\s*(-?[\d.]+)[,\s]+(-?[\d.]+)[,\s]+(-?[\d.]+)(?:[,\s/]+([\d.]+))?\s*\)$/
  );
  if (rgb) {
    return {
      r: clamp(round(parseFloat(rgb[1]!)), 0, 255),
      g: clamp(round(parseFloat(rgb[2]!)), 0, 255),
      b: clamp(round(parseFloat(rgb[3]!)), 0, 255),
      a: rgb[4] !== undefined ? clamp(parseFloat(rgb[4]), 0, 1) : 1,
    };
  }

  // hsl / hsla
  const hsl = s.match(
    /^hsla?\(\s*([\d.]+)[,\s]+([\d.]+)%[,\s]+([\d.]+)%(?:[,\s/]+([\d.]+))?\s*\)$/
  );
  if (hsl) {
    const h = parseFloat(hsl[1]!);
    const sl = parseFloat(hsl[2]!) / 100;
    const l = parseFloat(hsl[3]!) / 100;
    const a = hsl[4] !== undefined ? clamp(parseFloat(hsl[4]), 0, 1) : 1;
    return { ...hslToRgb(h, sl, l), a };
  }

  return null;
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h = ((h % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return { r: round((r + m) * 255), g: round((g + m) * 255), b: round((b + m) * 255) };
}

/** RGBA → HSVA. */
export function rgbaToHsva({ r, g, b, a }: RGBA): HSVA {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : d / max;
  return { h, s, v: max, a };
}

/** HSVA → RGBA. */
export function hsvaToRgba({ h, s, v, a }: HSVA): RGBA {
  h = ((h % 360) + 360) % 360;
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return { r: round((r + m) * 255), g: round((g + m) * 255), b: round((b + m) * 255), a };
}

const toHex2 = (n: number) => clamp(round(n), 0, 255).toString(16).padStart(2, '0');

/** Serialize RGBA to the given format. `withAlpha` includes the alpha channel. */
export function formatColor(c: RGBA, format: ColorFormat, withAlpha: boolean): string {
  const a = clamp(c.a, 0, 1);
  if (format === 'hex') {
    const base = `#${toHex2(c.r)}${toHex2(c.g)}${toHex2(c.b)}`;
    return withAlpha ? `${base}${toHex2(a * 255)}` : base;
  }
  if (format === 'rgb') {
    return withAlpha
      ? `rgba(${round(c.r)}, ${round(c.g)}, ${round(c.b)}, ${+a.toFixed(2)})`
      : `rgb(${round(c.r)}, ${round(c.g)}, ${round(c.b)})`;
  }
  // hsl
  const { h, s, v } = rgbaToHsva(c);
  const l = v - (v * s) / 2;
  const sl = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);
  const H = round(h);
  const S = round(sl * 100);
  const L = round(l * 100);
  return withAlpha ? `hsla(${H}, ${S}%, ${L}%, ${+a.toFixed(2)})` : `hsl(${H}, ${S}%, ${L}%)`;
}
