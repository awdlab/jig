// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface NgnCustomTypes {
  // Empty interface to define custom types
}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface NgnThemeTypes {
  // Empty interface to define custom types
}

export type IconType = NgnCustomTypes extends { icon: infer T } ? T : string;

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

export type CustomKind<K> =
  UnionCustomKind<K> extends never ? never : UnionCustomKind<K> | null | undefined;

export type ChipKindType = NgnCustomTypes extends { kind: { chip: infer T } } ? T : string;
