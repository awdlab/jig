export type ThemePartTemplateVar = undefined | { [subKey: string]: ThemePartTemplateVar };

export type ThemePartTemplate<
  TScope extends string = string,
  TVars extends Record<string, ThemePartTemplateVar> = Record<string, ThemePartTemplateVar>,
  TClassNames extends string[] = string[],
> = {
  scope: TScope;
  variables: TVars;
  classNames: TClassNames;
};

export function createThemePartTemplate<
  TScope extends string,
  TVars extends Record<string, ThemePartTemplateVar> = Record<string, ThemePartTemplateVar>,
  const TClassNames extends string[] = string[],
>(
  template: ThemePartTemplate<TScope, TVars, TClassNames>
): ThemePartTemplate<TScope, TVars, TClassNames> {
  return template;
}
