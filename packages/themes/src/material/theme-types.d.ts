/// <reference types="@awdlab/jig-custom-types" />

import { COLORS, KINDS } from '.';

declare module '@awdlab/jig-custom-types' {
  export interface JigThemeTypes {
    kind: typeof KINDS;
    color: typeof COLORS;
  }
}
