// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface NgnCustomTypes {
  // Empty interface to define custom types
}

export type IconType = NgnCustomTypes extends { icon: infer T } ? T : string;

export type ButtonKindType = NgnCustomTypes extends { kind: { button: infer T } }
  ? T
  : 'icon' | string;

export type ChipKindType = NgnCustomTypes extends { kind: { chip: infer T } } ? T : string;
