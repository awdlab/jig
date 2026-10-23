// jig-kinds.d.ts is never imported; the tsconfig's `**/*.d.ts` glob is what pulls it in.
import type { CustomKind } from '@awdlab/jig-custom-types';

const added: CustomKind<'button'> = 'fancy';
// @ts-expect-error removed by the app
const removed: CustomKind<'button'> = 'link';

export { added, removed };
