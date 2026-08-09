import { InjectionToken, type Provider } from '@angular/core';

import { JigSnackbarManager } from './snackbar-manager';

import type { JigSnackbarOptionsMeta } from './types';

export type JigSnackbarFeature = {
  providers: Provider[];
};

export const NGN_SNACKBAR_USER_DEFAULTS = new InjectionToken<JigSnackbarOptionsMeta>(
  'NGN_SNACKBAR_USER_DEFAULTS'
);

export function withSnackbars(defaultOptions?: JigSnackbarOptionsMeta): JigSnackbarFeature {
  return {
    providers: [
      JigSnackbarManager,
      {
        provide: NGN_SNACKBAR_USER_DEFAULTS,
        useValue: defaultOptions || {},
      },
    ],
  };
}
