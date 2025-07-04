export type Scoped<T extends string = string> = { readonly scope: T };

export type ControlTemplate<
  S extends string = string,
  C extends string[] = string[],
> = Scoped<S> & { readonly classNames: C };

type VariableKeys<S, V> = S extends '' ? DeepKeys<V> : `${S}.${DeepKeys<V>}`;
type KeySuggestion<T extends string> = Omit<string, `{${string}}`> | `{${T}}`;
type VariableValues<TVariables extends object, TKeys extends string> = {
  [K in keyof TVariables]?: TVariables[K] extends object
    ? VariableValues<TVariables[K], TKeys>
    : KeySuggestion<TKeys>;
};
export type TemplateVariable<T> = T | { readonly [subKey: string]: TemplateVariable<T> };
export type VariableTemplate<
  S extends string = string,
  V extends Record<string, TemplateVariable<null>> = Record<string, TemplateVariable<null>>,
> = Scoped<S> & {
  readonly variables: V;
  readonly defaults?: Record<string, TemplateVariable<string>>;
  readonly __varkeys: VariableKeys<S, V>;
};

export type PartContent<
  V extends Record<string, TemplateVariable<null>> = Record<string, TemplateVariable<null>>,
> = {
  readonly values?: Record<string, TemplateVariable<string>>;
  readonly css?: (args: {
    v: (key: string) => string;
    c: (className?: string) => string;
  }) => string;
};
export type Part<
  S extends string = string,
  C extends ControlTemplate = ControlTemplate<S>,
  V extends VariableTemplate<S>[] = VariableTemplate<S>[],
  D extends VariableTemplate[] = VariableTemplate[],
> = Scoped<S> & {
  readonly controlTemplate?: C;
  readonly variables?: V;
  readonly dependencies?: D;
  readonly root?: PartContent;
  readonly light?: PartContent;
  readonly dark?: PartContent;
  readonly highContrast?: PartContent;
};

function createControlTemplate<S extends string, C extends string[]>(init: {
  scope: S;
  classNames: C;
}): ControlTemplate<S, C> {
  return {
    scope: init.scope,
    classNames: init.classNames,
  };
}

function createVariableTemplate<
  S extends string,
  V extends Record<string, TemplateVariable<null>>,
>(init: {
  scope: S;
  variables: V;
  defaults?: VariableValues<V, VariableKeys<S, V>>;
}): VariableTemplate<S, V> {
  return {
    scope: init.scope,
    variables: init.variables,
    defaults: init.defaults as Record<string, TemplateVariable<string>>,
  } satisfies Omit<VariableTemplate<S, V>, '__varkeys'> as VariableTemplate<S, V>;
}
