import type { NgnCustomTypes, NgnThemeTypes } from './custom-types';

type GetCustomType<Group> = Group extends { color: infer T } ? T : never;

type CustomColorInt =
  GetCustomType<NgnCustomTypes> extends never
    ? GetCustomType<NgnThemeTypes>
    : GetCustomType<NgnCustomTypes>;

export type CustomColor = CustomColorInt extends readonly (infer A)[] ? A : never;
