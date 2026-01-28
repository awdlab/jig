import { NgnCustomTypes, NgnThemeTypes } from './custom-types';

type GetCustomType<Group, K> = K extends string
  ? Group extends { kind: { [key in K]: infer T } }
    ? T
    : never
  : never;

type CustomKindInt<K> =
  GetCustomType<NgnCustomTypes, K> extends never
    ? GetCustomType<NgnThemeTypes, K>
    : GetCustomType<NgnCustomTypes, K>;

type UnionCustomKind<K> = CustomKindInt<K> extends readonly (infer A)[] ? A : never;

export type CustomKind<K> = UnionCustomKind<K> extends never ? never : UnionCustomKind<K>;
