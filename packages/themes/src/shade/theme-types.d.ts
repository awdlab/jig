/// <reference types="@ngneers/controls-custom-types" />

import { COLORS, KINDS } from '.';

declare module '@ngneers/controls-custom-types' {
  export interface NgnThemeTypes {
    kind: typeof KINDS;
    color: typeof COLORS;
  }
}
