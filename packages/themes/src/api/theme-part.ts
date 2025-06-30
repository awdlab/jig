import { ThemePartTemplate } from './theme-part-template';
import { DeepKeys } from './utils';

type _VariableKeys<T extends ThemePartTemplate<any, any, any>> = T['scope'] extends ''
  ? DeepKeys<T['variables']>
  : `${T['scope']}.${DeepKeys<T['variables']>}`;

export type VariableKeys<T extends ThemePartTemplate<any, any, any>[]> = _VariableKeys<T[number]>;

export type VariableDefinition<T, K extends string> = T extends object
  ? { [P in keyof T]?: VariableDefinition<T[P], K> }
  : Omit<string, `{${string}}`> | `{${K}}`;

export type CssFunction<
  TVarKeys extends string = string,
  TClassNames extends string = string,
> = (arg: { v: (key: TVarKeys) => string; c: (className?: TClassNames) => string }) => string;

export type ThemePartContent<
  TTemplate extends ThemePartTemplate<any, any, any> = ThemePartTemplate,
  TDependencies extends ThemePartTemplate<any, any, any>[] = ThemePartTemplate[],
> = {
  variables?: VariableDefinition<
    TTemplate['variables'],
    VariableKeys<[TTemplate, ...TDependencies]>
  >;
  css?: CssFunction<VariableKeys<[TTemplate, ...TDependencies]>, TTemplate['classNames'][number]>;
};
export type ThemePart<
  TTemplate extends ThemePartTemplate<any, any, any> = ThemePartTemplate,
  TDependencies extends ThemePartTemplate<any, any, any>[] = ThemePartTemplate[],
> = {
  template: TTemplate;
  root?: ThemePartContent<TTemplate, TDependencies>;
  light?: ThemePartContent<TTemplate, TDependencies>;
  dark?: ThemePartContent<TTemplate, TDependencies>;
  highContrast?: ThemePartContent<TTemplate, TDependencies>;
};

export function createThemePart<
  TTemplate extends ThemePartTemplate<any, any, any>,
  TDependencies extends ThemePartTemplate<any, any, any>[] = [],
>(
  definition: {
    template: TTemplate;
    dependencies?: TDependencies;
  } & ThemePart<TTemplate, TDependencies>
): ThemePart<TTemplate, TDependencies> {
  return {
    template: definition.template,
    root: definition.root,
    light: definition.light,
    dark: definition.dark,
    highContrast: definition.highContrast,
  };
}

export const css = String.raw;
