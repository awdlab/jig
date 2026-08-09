import type { Scoped } from './scoped';
import type { TemplateVariable } from './template-variable';
import type { VariableKeys, VariableValues } from './variable';

export type VariableTemplate<
  S extends string = string,
  V extends Record<string, TemplateVariable<null>> = Record<string, TemplateVariable<null>>,
> = Scoped<S> & {
  readonly variables: V;
  readonly defaults?: Record<string, TemplateVariable<string>>;
  readonly __varkeys: VariableKeys<S, V>;
};

export function createVariableTemplate<
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
