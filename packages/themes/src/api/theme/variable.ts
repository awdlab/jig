import type { DeepKeys } from '../utils/deep-keys.js';
import type { SubKey } from '../utils/sub-key.js';

export type VariableKeys<S extends string, V> = SubKey<[S, DeepKeys<V>]>;

type KeySuggestion<T extends string> = Omit<string, `{${string}}`> | `{${T}}`;

export type VariableValues<TVariables extends object, TKeys extends string> = {
  [K in keyof TVariables as K extends `__${string}` ? never : K]?: TVariables[K] extends object
    ? VariableValues<TVariables[K], TKeys>
    : KeySuggestion<TKeys>;
};
