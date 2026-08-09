/// <reference types="@awdlab/jig-custom-types" />

import { COLORS, KINDS } from '.';

declare module '@awdlab/jig-custom-types' {
  export interface NgnThemeTypes {
    kind: typeof KINDS;
    color: typeof COLORS;
  }
}
