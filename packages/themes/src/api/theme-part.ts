import { ThemePartTemplate } from './theme-part-template';
import { DeepKeys } from './utils';

type _VariableKeys<T extends ThemePartTemplate> = T['scope'] extends ''
  ? DeepKeys<T['variables']>
  : `${T['scope']}.${DeepKeys<T['variables']>}`;

export type VariableKeys<T extends ThemePartTemplate[]> = _VariableKeys<T[number]>;

export type VariableDefinition<T, K extends string> = T extends object
  ? { [P in keyof T]?: VariableDefinition<T[P], K> }
  : Omit<string, `{${string}}`> | `{${K}}`;

export type CssFunction<
  TVarKeys extends string = string,
  TClassNames extends string = string,
> = (arg: { v: (key: TVarKeys) => string; c: (className?: TClassNames) => string }) => string;

export type ThemePartContent<
  TTemplate extends ThemePartTemplate = ThemePartTemplate,
  TDependencies extends ThemePartTemplate[] = ThemePartTemplate[],
> = {
  variables?: VariableDefinition<
    TTemplate['variables'],
    VariableKeys<[TTemplate, ...TDependencies]>
  >;
  css?: CssFunction<VariableKeys<[TTemplate, ...TDependencies]>, TTemplate['classNames'][number]>;
};
export type ThemePart<
  TTemplate extends ThemePartTemplate = ThemePartTemplate,
  TDependencies extends ThemePartTemplate[] = ThemePartTemplate[],
> = {
  template: TTemplate;
  dependencies: TDependencies;
  root?: ThemePartContent<TTemplate, TDependencies>;
  light?: ThemePartContent<TTemplate, TDependencies>;
  dark?: ThemePartContent<TTemplate, TDependencies>;
  highContrast?: ThemePartContent<TTemplate, TDependencies>;
};

export function createThemePart<
  TTemplate extends ThemePartTemplate,
  TDependencies extends ThemePartTemplate[] = [],
>(
  definition: {
    template: TTemplate;
    dependencies?: TDependencies;
  } & Omit<ThemePart<TTemplate, TDependencies>, 'template' | 'dependencies'>
): ThemePart<TTemplate, TDependencies> {
  return {
    template: definition.template,
    dependencies: (definition.dependencies ?? []) as TDependencies,
    root: definition.root,
    light: definition.light,
    dark: definition.dark,
    highContrast: definition.highContrast,
  };
}

export const css = String.raw;
