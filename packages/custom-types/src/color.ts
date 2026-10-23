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
    : CustomColorInt;

/**
 * The colors the loaded theme itself declares, as a union. Compose an app's own list from it —
 * `Exclude<ThemeColor, 'info'> | 'brand'` — and augment `JigCustomTypes` with the result.
 * Resolves to `never` when no theme augmentation is loaded.
 */
export type ThemeColor = [GetCustomType<JigThemeTypes>] extends [never]
  ? never
  : GetCustomType<JigThemeTypes> extends readonly (infer A)[]
    ? A
    : never;

/**
 * Falls back to `string` when no theme or app type augmentation is loaded, so bindings keep
 * working (unchecked) instead of failing outright.
 */
export type CustomColor = [CustomColorInt] extends [never] ? string : UnionCustomColor;
