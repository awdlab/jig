import { InjectionToken, type Provider } from '@angular/core';

import { AwdSnackbarManager } from './snackbar-manager';

import type { AwdSnackbarOptionsMeta } from './types';

export type AwdSnackbarFeature = {
  providers: Provider[];
};

export const NGN_SNACKBAR_USER_DEFAULTS = new InjectionToken<AwdSnackbarOptionsMeta>(
  'NGN_SNACKBAR_USER_DEFAULTS'
);

export function withSnackbars(defaultOptions?: AwdSnackbarOptionsMeta): AwdSnackbarFeature {
  return {
    providers: [
      AwdSnackbarManager,
      {
        provide: NGN_SNACKBAR_USER_DEFAULTS,
        useValue: defaultOptions || {},
      },
    ],
  };
}
