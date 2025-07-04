import { Scoped } from './scoped';

export type ControlTemplate<
  S extends string = string,
  C extends string[] = string[],
> = Scoped<S> & { readonly classNames: C };

type _ResolveWildcards<C extends string> = C extends `${infer Prefix}*${infer Suffix}`
  ? `${Prefix}${string}${Suffix}`
  : C;
type ResolveWildcards<C extends readonly string[]> = C extends readonly [infer Head, ...infer Tail]
  ? Head extends string
    ? Tail extends readonly string[]
      ? [_ResolveWildcards<Head>, ...ResolveWildcards<Tail>]
      : never
    : never
  : C;
export function createControlTemplate<S extends string, const C extends string[]>(init: {
  scope: S;
  classNames: C;
}) {
  return init as ControlTemplate<S, ResolveWildcards<C>>;
}
