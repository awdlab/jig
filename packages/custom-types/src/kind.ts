import type { JigCustomTypes, JigThemeTypes } from './custom-types.js';

type GetCustomType<Group, K> = K extends string
  ? Group extends { kind: { [key in K]: infer T } }
    ? T
    : never
  : never;

type CustomKindInt<K> = [GetCustomType<JigCustomTypes, K>] extends [never]
  ? GetCustomType<JigThemeTypes, K>
  : GetCustomType<JigCustomTypes, K>;

// The [never] wrapper is required: a bare `never extends readonly (infer A)[]` matches with
// no inference candidate for A, which silently yields `unknown` and disables type checking.
type UnionCustomKind<K> = [CustomKindInt<K>] extends [never]
  ? never
  : CustomKindInt<K> extends readonly (infer A)[]
    ? A
    : never;

/**
 * Falls back to `string` when no theme or app type augmentation is loaded, so bindings keep
 * working (unchecked) instead of failing outright.
 */
export type CustomKind<K> = [UnionCustomKind<K>] extends [never] ? string : UnionCustomKind<K>;
