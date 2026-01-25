import { InjectionToken, Provider } from '@angular/core';

import { NgnToastManager } from './toast-manager';
import { NgnToastOptionsMeta } from './types';

export type NgnToastFeature = {
  providers: Provider[];
};

export const NGN_TOAST_USER_DEFAULTS = new InjectionToken<NgnToastOptionsMeta>(
  'NGN_TOAST_USER_DEFAULTS'
);

export function withToasts(defaultOptions?: NgnToastOptionsMeta): NgnToastFeature {
  return {
    providers: [
      NgnToastManager,
      {
        provide: NGN_TOAST_USER_DEFAULTS,
        useValue: defaultOptions || {},
      },
    ],
  };
}
