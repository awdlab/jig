// One customizeKinds call feeding both the type augmentation and the runtime list.
import { customizeColors, customizeKinds } from '@awdlab/jig/api';
import { nova } from '@awdlab/jig-themes/nova';

import type { CustomColor, CustomKind } from '@awdlab/jig-custom-types';

export const APP_KINDS = customizeKinds(nova, {
  button: { remove: ['link'], add: ['fancy'] },
} as const);

export const APP_COLORS = customizeColors(nova, { remove: ['info'], add: ['brand'] } as const);

declare module '@awdlab/jig-custom-types' {
  export interface JigCustomTypes {
    kind: typeof APP_KINDS;
    color: typeof APP_COLORS;
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
// @ts-expect-error removed by the app
const removedColor: CustomColor = 'info';

// @ts-expect-error not a nova button kind
customizeKinds(nova, { button: { remove: ['nope'] } } as const);

export { added, addedColor, bogus, kept, removed, removedColor, untouched };
