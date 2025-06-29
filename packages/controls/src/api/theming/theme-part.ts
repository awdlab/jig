import { ThemePartTemplate } from './theme-part-template';
import { DeepKeys } from './utils';

type _VariableKeys<T extends ThemePartTemplate> = T['scope'] extends ''
  ? DeepKeys<T['variables']>
  : `${T['scope']}.${DeepKeys<T['variables']>}`;

export type VariableKeys<T extends ThemePartTemplate[]> = _VariableKeys<T[number]>;

export type VariableDefinition<T, K extends string> = T extends object
  ? { [P in keyof T]?: VariableDefinition<T[P], K> }
  : Omit<string, `{${string}}`> | `{${K}}`;

export type ThemePartContent<
  TTemplate extends ThemePartTemplate = ThemePartTemplate,
  TDependencies extends ThemePartTemplate[] = ThemePartTemplate[],
> = {
  variables?: VariableDefinition<
    TTemplate['variables'],
    VariableKeys<[TTemplate, ...TDependencies]>
  >;
  css?: (arg: {
    v: (key: VariableKeys<[TTemplate, ...TDependencies]>) => string;
    c: (className?: TTemplate['classNames'][number]) => string;
  }) => string;
};
export type ThemePart<
  TTemplate extends ThemePartTemplate = ThemePartTemplate,
  TDependencies extends ThemePartTemplate[] = ThemePartTemplate[],
> = {
  template: TTemplate;
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
