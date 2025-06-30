import { ThemePart } from './theme-part';
import { ThemePartTemplate } from './theme-part-template';

export type Theme<T extends ThemePart[] = ThemePart[]> = {
  parts: T;
};

type ThemePartDependencies<T> = T extends ThemePart<any, infer D> ? D : never;

type _GetDependencyError<
  T extends ThemePart[],
  P extends ThemePart,
  D extends ThemePartTemplate,
> = D extends D
  ? D extends T[number]['template']
    ? never
    : `❌ Theme part '${D['scope']}', which is a dependency of '${P['template']['scope']}', is not included in the theme.`
  : never;
type _GetError<T extends ThemePart[], P extends ThemePart> = P extends P
  ? _GetDependencyError<T, P, ThemePartDependencies<P>[number]>
  : never;
export type GetError<T extends ThemePart<any, any>[]> = _GetError<T, T[number]>;

export type ThemeParts<T extends ThemePart<any, any> = ThemePart<any, any>> = readonly (
  | T
  | readonly T[]
)[];
type _FlatThemeParts<T> = T extends readonly [infer A, ...infer R]
  ? A extends ThemePart<any, any>
    ? [A, ..._FlatThemeParts<R>]
    : A extends readonly ThemePart<any, any>[]
      ? [...A, ..._FlatThemeParts<R>]
      : _FlatThemeParts<R>
  : [];

export function createTheme<const T extends ThemeParts>(
  parts: GetError<_FlatThemeParts<T>> extends never ? T : GetError<_FlatThemeParts<T>>
): Theme<_FlatThemeParts<T>> {
  return {
    parts: (parts as T).flat() as _FlatThemeParts<T>,
  };
}
