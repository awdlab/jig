import { CssFunction, VariableDefinition } from './theme-part';
import { DeepKeys, deepMerge } from './utils';

export type ThemePartTemplateVar<T> = T | { [subKey: string]: ThemePartTemplateVar<T> };

export type ThemePartTemplate<
  TScope extends string = string,
  TVars extends Record<string, ThemePartTemplateVar<any>> = any,
  TClassNames extends string[] = string[],
> = {
  scope: TScope;
  variables: TVars;
  classNames: TClassNames;
  css?: CssFunction<DeepKeys<TVars>, TClassNames[number]>;
};

export function createThemePartTemplate<
  TScope extends string,
  TVars extends Record<string, ThemePartTemplateVar<null>>,
  const TClassNames extends string[],
  TDefaults extends VariableDefinition<TVars, DeepKeys<TVars>>,
>(
  template: ThemePartTemplate<TScope, TVars, TClassNames>,
  options?: {
    defaults?: TDefaults;
    defaultStyles?: CssFunction<DeepKeys<TVars>, TClassNames[number]>;
  }
): ThemePartTemplate<TScope, TVars, TClassNames> {
  return {
    ...template,
    variables: (options?.defaults
      ? deepMerge(template.variables, options.defaults)
      : template.variables) as TVars,
    css: options?.defaultStyles,
  };
}
