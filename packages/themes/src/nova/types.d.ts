import type { KINDS } from './index';

// Type-only declarations for module augmentation
declare module '@ngneers/controls-custom-types' {
  export interface NgnThemeTypes {
    kind: KINDS;
  }
}
