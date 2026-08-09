/** Locale-specific separators derived from `Intl.NumberFormat`. */
export type LocaleNumberInfo = {
  /** The decimal separator, e.g. `.` (en) or `,` (de). */
  decimal: string;
  /** The grouping (thousands) separator, e.g. `,` (en) or `.` (de). */
  group: string;
  /**
   * The locale's digit glyphs indexed by value (`digits[0]` … `digits[9]`).
   * Non-Latin numbering systems (e.g. `ar-EG` → `٠…٩`) are mapped back to
   * ASCII before parsing. `null` when the locale already uses ASCII digits.
   */
  digits: readonly string[] | null;
};

/** Derives the decimal/grouping separators and digit glyphs for a locale. */
export function localeNumberInfo(locale: string): LocaleNumberInfo {
  const parts = new Intl.NumberFormat(locale).formatToParts(12345.6);
  const plain = new Intl.NumberFormat(locale, { useGrouping: false });
  const digits = Array.from({ length: 10 }, (_, i) => plain.format(i));
  const isAscii = digits.every((glyph, i) => glyph === String(i));
  return {
    decimal: parts.find(p => p.type === 'decimal')?.value ?? '.',
    group: parts.find(p => p.type === 'group')?.value ?? ',',
    digits: isAscii ? null : digits,
  };
}

export type ParsedNumber =
  | { kind: 'empty' }
  | { kind: 'invalid' }
  | { kind: 'value'; value: number };

/**
 * Parses user-typed text into a number using the locale's separators:
 * grouping separators (and non-breaking spaces used as such) are stripped,
 * the locale decimal separator is normalized to `.`. Exponent notation is
 * accepted; anything else non-numeric is `invalid`.
 */
export function parseLocaleNumber(text: string, info: LocaleNumberInfo): ParsedNumber {
  const trimmed = text.trim();
  if (!trimmed) {
    return { kind: 'empty' };
  }
  let normalized = trimmed;
  // Map non-Latin digit glyphs (e.g. ar-EG ٠…٩) back to ASCII before validating.
  if (info.digits) {
    for (let i = 0; i < 10; i++) {
      normalized = normalized.split(info.digits[i]!).join(String(i));
    }
  }
  normalized = normalized.split(info.group).join('');
  // Locales that group with spaces render non-breaking variants; users type
  // plain spaces — \s covers both, so strip all whitespace flavors.
  normalized = normalized.replace(/\s/g, '');
  if (info.decimal !== '.') {
    normalized = normalized.split(info.decimal).join('.');
  }
  if (!/^[+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i.test(normalized)) {
    return { kind: 'invalid' };
  }
  const value = Number(normalized);
  if (!Number.isFinite(value)) {
    return { kind: 'invalid' };
  }
  return { kind: 'value', value };
}

/** Number of decimal places of `value` (bounded to 20, exponent-safe). */
export function decimalPlaces(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  let factor = 1;
  let places = 0;
  while (Math.round(value * factor) / factor !== value && places < 20) {
    factor *= 10;
    places++;
  }
  return places;
}

/** Rounds `value` to `decimals` decimal places (float-drift cleanup). */
export function roundToPrecision(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/** Clamps `value` into `[min, max]`; open bounds when `null`/`undefined`. */
export function clampValue(value: number, min?: number | null, max?: number | null): number {
  if (min != null && value < min) {
    return min;
  }
  if (max != null && value > max) {
    return max;
  }
  return value;
}

/**
 * Steps `current` by `amount` in `direction`, clamped into `[min, max]` (no
 * wrapping). The result is rounded to the combined precision of the operands
 * so float drift (`0.1 + 0.2`) never surfaces. Stepping from `null` seeds at
 * `min` (increment) or `max` (decrement), falling back to `0` on open bounds.
 */
export function stepNumberValue(
  current: number | null,
  direction: 1 | -1,
  amount: number,
  min?: number | null,
  max?: number | null
): number {
  if (current === null) {
    const seed = direction === 1 ? (min ?? 0) : (max ?? 0);
    return clampValue(seed, min, max);
  }
  const decimals = Math.max(decimalPlaces(current), decimalPlaces(amount));
  const next = roundToPrecision(current + direction * amount, decimals);
  return clampValue(next, min, max);
}
