// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface NgnCustomTypes {
  // Empty interface to define custom types
}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface NgnThemeTypes {
  // Empty interface to define custom types
}

export type IconType = NgnCustomTypes extends { icon: infer T } ? T : string;

export type CustomKindInt<K> = K extends string
  ? NgnCustomTypes extends {
      kind: { [key in K]: infer T };
    }
    ? T
    : NgnThemeTypes extends {
          kind: { [key in K]: infer T };
        }
      ? T
      : never
  : never;

export type CustomKind<K> =
  CustomKindInt<K> extends never ? never : CustomKindInt<K> | null | undefined;

export type ChipKindType = NgnCustomTypes extends { kind: { chip: infer T } } ? T : string;
