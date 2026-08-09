import type { ThemePart } from './theme-part';

/**
 * Explicit per-control default `color`/`kind`, keyed by control name. When set,
 * these win over the implicit "first entry of the colors/kinds array" default,
 * so a bare `<button jigButton>` doesn't silently depend on array ordering.
 */
export type ThemeDefaults = Record<string, { color?: string; kind?: string }>;

export type Theme<
  P extends ThemePart[] = ThemePart[],
  KINDS extends Record<string, readonly string[]> = Record<string, readonly string[]>,
  COLORS extends readonly string[] = readonly string[],
> = {
  readonly name: string;
  readonly parts: P;
  readonly meta: {
    kinds?: KINDS;
    colors?: COLORS;
    defaults?: ThemeDefaults;
  };
};

// TODO: Check that all dependencies are available in the parts
export function createTheme<
  P extends ThemePart[],
  KINDS extends Record<string, readonly string[]>,
  COLORS extends readonly string[],
>(
  name: string,
  parts: P,
  metadata?: { kinds?: KINDS; colors?: COLORS; defaults?: ThemeDefaults }
): Theme<P, KINDS> {
  return {
    name,
    parts,
    meta: {
      kinds: metadata?.kinds,
      colors: metadata?.colors,
      defaults: metadata?.defaults,
    },
  };
}
