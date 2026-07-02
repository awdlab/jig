export type RGB = { r: number; g: number; b: number };

/**
 * WCAG 2.x relative luminance of an sRGB color.
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
export function relativeLuminance({ r, g, b }: RGB): number {
  const convert = (c: number) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };

  return 0.2126 * convert(r) + 0.7152 * convert(g) + 0.0722 * convert(b);
}

/**
 * WCAG 2.x contrast ratio between two colors (1..21).
 */
export function contrastRatio(color1: RGB, color2: RGB): number {
  const l1 = relativeLuminance(color1);
  const l2 = relativeLuminance(color2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

export type ContrastCandidate<K extends string = string> = { key: K; rgb: RGB };

/**
 * Pick the candidate with the highest contrast against `background`.
 *
 * Best-effort: returns the highest-ratio candidate regardless of whether it
 * meets any WCAG threshold. Accepts any number of candidates so mid-tone
 * fallbacks (e.g. pure white/black) can be added later without an API change.
 */
export function bestContrast<K extends string>(
  background: RGB,
  candidates: ContrastCandidate<K>[]
): (ContrastCandidate<K> & { ratio: number }) | undefined {
  return candidates
    .map(candidate => ({ ...candidate, ratio: contrastRatio(background, candidate.rgb) }))
    .sort((a, b) => b.ratio - a.ratio)[0];
}

/** Parse `#rgb` / `#rrggbb` into 8-bit sRGB channels. */
export function hexToRgb(hex: string): RGB {
  let h = hex.trim().replace(/^#/, '');
  if (h.length === 3) {
    h = h
      .split('')
      .map(c => c + c)
      .join('');
  }
  const n = Number.parseInt(h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

/** sRGB (0-255) → HSL, all channels normalized to 0..1. */
function rgbToHsl({ r, g, b }: RGB): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;

  if (d === 0) {
    return { h: 0, s: 0, l };
  }

  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  switch (max) {
    case r:
      h = (g - b) / d + (g < b ? 6 : 0);
      break;
    case g:
      h = (b - r) / d + 2;
      break;
    default:
      h = (r - g) / d + 4;
      break;
  }

  return { h: h / 6, s, l };
}

/** HSL (0..1 channels) → sRGB (0-255). */
function hslToRgb(h: number, s: number, l: number): RGB {
  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  };
}

/**
 * Derive a palette shade from a base color, mirroring the CSS
 * `hsl(from <base> h s <lightness>)` trick in pure JS: keep the base hue and
 * saturation, override lightness with `(1000 - level) / 10` percent.
 */
export function shadeRgb(baseHex: string, level: number): RGB {
  const { h, s } = rgbToHsl(hexToRgb(baseHex));
  const l = (1000 - level) / 1000;
  return hslToRgb(h, s, l);
}

/** Serialize to a modern space-separated `rgb()` string. */
export function rgbToCss({ r, g, b }: RGB): string {
  return `rgb(${r} ${g} ${b})`;
}

/**
 * Pure-CSS auto-contrast foreground for an ARBITRARY runtime background —
 * custom colors (e.g. a user-supplied `--color`) or consumer var overrides —
 * where a value cannot be precomputed. Picks black or white via a relative
 * OKLCH lightness threshold, resolved live by the browser.
 *
 * This is a heuristic (perceptual lightness, not a measured WCAG ratio) and can
 * miss AA on mid-tone saturated colors. For the fixed theme palette, prefer the
 * precomputed, WCAG-measured `-contrast` variables instead.
 *
 * @param background any CSS color expression, e.g. `var(--color, #4557ba)`
 * @param threshold OKLCH lightness cutoff (0..1) above which black is chosen
 */
export function autoContrast(background: string, threshold = 0.62): string {
  return `oklch(from ${background} clamp(0, (${threshold} - l) * 1e7, 1) 0 h)`;
}
