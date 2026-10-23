// Composing the app's kinds and colors from the theme's own values by hand.
import type {} from '@awdlab/jig-themes/nova';

import type { CustomColor, CustomKind, ThemeColor, ThemeKind } from '@awdlab/jig-custom-types';

declare module '@awdlab/jig-custom-types' {
  export interface JigCustomTypes {
    kind: { button: Exclude<ThemeKind<'button'>, 'link'> | 'fancy' };
    color: ThemeColor | 'brand';
  }
}

const added: CustomKind<'button'> = 'fancy';
const kept: CustomKind<'button'> = 'primary';
// @ts-expect-error removed by the app
const removed: CustomKind<'button'> = 'link';
const untouched: CustomKind<'message'> = 'outlined';
// @ts-expect-error not a nova message kind
const bogus: CustomKind<'message'> = 'fancy';
const addedColor: CustomColor = 'brand';
const keptColor: CustomColor = 'primary';

export { added, addedColor, bogus, kept, keptColor, removed, untouched };
