import { ThemePart } from './theme-part';

export type Theme<P extends ThemePart[] = ThemePart[]> = {
  readonly name: string;
  readonly parts: P;
};

// TODO: Check that all dependencies are available in the parts
export function createTheme<P extends ThemePart[]>(name: string, parts: P): Theme<P> {
  return {
    name,
    parts,
  };
}
