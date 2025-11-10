import { ThemePart } from './theme-part';

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
  };
};

// TODO: Check that all dependencies are available in the parts
export function createTheme<
  P extends ThemePart[],
  KINDS extends Record<string, readonly string[]>,
  COLORS extends readonly string[],
>(name: string, parts: P, metadata?: { kinds?: KINDS; colors?: COLORS }): Theme<P, KINDS> {
  return {
    name,
    parts,
    meta: {
      kinds: metadata?.kinds,
      colors: metadata?.colors,
    },
  };
}
