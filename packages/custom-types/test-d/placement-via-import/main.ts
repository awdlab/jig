// This tsconfig lists only main.ts, so jig-kinds.ts reaches the program through this import
// alone — the augmentation still applies, as the guide claims.
import { APP_KINDS } from './jig-kinds';

import type { CustomKind } from '@awdlab/jig-custom-types';

const added: CustomKind<'button'> = 'fancy';
// @ts-expect-error removed by the app
const removed: CustomKind<'button'> = 'link';

export { added, APP_KINDS, removed };
