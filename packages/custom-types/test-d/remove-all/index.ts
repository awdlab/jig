// Banning every value must leave nothing bindable, not fall back to unchecked `string`.
import { customizeColors, customizeKinds } from '@awdlab/jig/api';
import { nova } from '@awdlab/jig-themes/nova';

import type { CustomColor, CustomKind } from '@awdlab/jig-custom-types';

export const APP_KINDS = customizeKinds(nova, {
  button: { remove: ['primary', 'secondary', 'link', 'text', 'icon'] },
} as const);

export const APP_COLORS = customizeColors(nova, {
  remove: ['primary', 'secondary', 'accent', 'surface', 'info', 'success', 'warning', 'error'],
} as const);

declare module '@awdlab/jig-custom-types' {
  export interface JigCustomTypes {
    kind: typeof APP_KINDS;
    color: typeof APP_COLORS;
  }
}

// @ts-expect-error every button kind was removed
const banned: CustomKind<'button'> = 'primary';
// @ts-expect-error every button kind was removed
const bogus: CustomKind<'button'> = 'totally-bogus';
// @ts-expect-error every color was removed
const noColor: CustomColor = 'primary';

// A control the customization never named still types from the theme.
const untouched: CustomKind<'message'> = 'outlined';
// @ts-expect-error not a nova message kind
const wrongControl: CustomKind<'message'> = 'primary';

export { banned, bogus, noColor, untouched, wrongControl };
