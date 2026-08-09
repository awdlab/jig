import type { Scoped } from './scoped';

export type Dependency = {
  readonly class: string;
  readonly template: ControlTemplate;
  /**
   * Marks this dependency slot as projected (arrives via `<ng-content>` rather than being
   * rendered by the parent). Projected controls have no host element the parent can mark with
   * `[ptDep]`, so the slot is excluded from `pt`/`JigPassthrough` wiring and `d(depClass, inner)`
   * resolves to the child's own raw class instead of a marker + descendant selector.
   */
  readonly projected?: boolean;
};

export type ControlTemplate<
  S extends string = string,
  C extends string[] = string[],
  Deps extends readonly Dependency[] = readonly Dependency[],
> = Scoped<S> & { readonly classNames: C; readonly dependencies: Deps };

type _ResolveWildcards<C extends string> = C extends `${infer Prefix}*${infer Suffix}`
  ? `${Prefix}${string}${Suffix}`
  : C;
// Mapped (not head/tail-recursive) so instantiation depth stays O(1) in the
// number of class names — recursive tuple walking compounded across a control's
// dependency templates and tipped TS's depth limit (TS2589) on large controls.
type ResolveWildcards<C extends readonly string[]> = {
  -readonly [K in keyof C]: C[K] extends string ? _ResolveWildcards<C[K]> : C[K];
};

export function createControlTemplate<
  S extends string,
  const C extends string[],
  const Deps extends readonly Dependency[] = readonly [],
>(init: { scope: S; classNames: C; readonly dependencies?: Deps }) {
  // Default `dependencies` to an empty array so templates that omit it resolve
  // `Deps` to `readonly []` (no dep keys) rather than the unconstrained
  // `readonly Dependency[]`, which would pollute `ThemeClasses`/`JigPassthrough`
  // with an index signature for leaf controls.
  return { ...init, dependencies: init.dependencies ?? [] } as ControlTemplate<
    S,
    ResolveWildcards<C>,
    Deps
  >;
}
