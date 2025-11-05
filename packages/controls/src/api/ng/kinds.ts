import { inject } from '@angular/core';
import { CustomKind } from '@ngneers/controls-custom-types';

import { NGN_CONFIG } from './config';

/**
 * Retrieves the available kinds for a given control from the theme configuration.
 * Does **not** return custom kinds defined by the user in `NgnCustomTypes`.
 * @param controlName The name of the control to get kinds for.
 * @returns A tuple of available kinds for the specified control.
 * @todo make reactive (signal)
 */
export function injectThemeControlKinds<T extends string>(controlName: T): CustomKind<T>[] {
  const val = inject(NGN_CONFIG).theme.preset?.meta.kinds?.[controlName] ?? [];
  return val as CustomKind<T>[];
}
