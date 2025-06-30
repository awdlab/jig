// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface NgnCustomTypes {
  // Empty interface to define custom types
}

export type IconType = NgnCustomTypes extends { icon: infer T } ? T : string;
