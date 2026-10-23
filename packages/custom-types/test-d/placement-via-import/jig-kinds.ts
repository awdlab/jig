// The documented customizeKinds recipe: a plain .ts module the app config imports.
import { customizeKinds } from '@awdlab/jig/api';
import { nova } from '@awdlab/jig-themes/nova';

export const APP_KINDS = customizeKinds(nova, {
  button: { remove: ['link'], add: ['fancy'] },
} as const);

declare module '@awdlab/jig-custom-types' {
  export interface JigCustomTypes {
    kind: typeof APP_KINDS;
  }
}
