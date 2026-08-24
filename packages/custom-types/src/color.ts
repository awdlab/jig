import type { JigCustomTypes, JigThemeTypes } from './custom-types.js';

type GetCustomType<Group> = Group extends { color: infer T } ? T : never;

type CustomColorInt = [GetCustomType<JigCustomTypes>] extends [never]
  ? GetCustomType<JigThemeTypes>
  : GetCustomType<JigCustomTypes>;

// The [never] wrapper is required: a bare `never extends readonly (infer A)[]` matches with
// no inference candidate for A, which silently yields `unknown` and disables type checking.
type UnionCustomColor = [CustomColorInt] extends [never]
  ? never
  : CustomColorInt extends readonly (infer A)[]
    ? A
    : never;

/**
 * Falls back to `string` when no theme or app type augmentation is loaded, so bindings keep
 * working (unchecked) instead of failing outright.
 */
export type CustomColor = [UnionCustomColor] extends [never] ? string : UnionCustomColor;
