import { InjectionToken, type Provider } from '@angular/core';

import { NgnSnackbarManager } from './snackbar-manager';

import type { NgnSnackbarOptionsMeta } from './types';

export type NgnSnackbarFeature = {
  providers: Provider[];
};

export const NGN_SNACKBAR_USER_DEFAULTS = new InjectionToken<NgnSnackbarOptionsMeta>(
  'NGN_SNACKBAR_USER_DEFAULTS'
);

export function withSnackbars(defaultOptions?: NgnSnackbarOptionsMeta): NgnSnackbarFeature {
  return {
    providers: [
      NgnSnackbarManager,
      {
        provide: NGN_SNACKBAR_USER_DEFAULTS,
        useValue: defaultOptions || {},
      },
    ],
  };
}
