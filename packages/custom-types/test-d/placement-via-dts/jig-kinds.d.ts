// The types-only recipe: nothing imports this, so it must be a .d.ts to reach the program.
import type { ThemeKind } from '@awdlab/jig-custom-types';
import type {} from '@awdlab/jig-themes/nova';

declare module '@awdlab/jig-custom-types' {
  export interface JigCustomTypes {
    kind: { button: Exclude<ThemeKind<'button'>, 'link'> | 'fancy' };
  }
}
