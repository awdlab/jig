import { InjectionToken, type Provider } from '@angular/core';

import { JigToastManager } from './toast-manager';

import type { JigToastOptionsMeta } from './types';

export type JigToastFeature = {
  providers: Provider[];
};

export const NGN_TOAST_USER_DEFAULTS = new InjectionToken<JigToastOptionsMeta>(
  'NGN_TOAST_USER_DEFAULTS'
);

export function withToasts(defaultOptions?: JigToastOptionsMeta): JigToastFeature {
  return {
    providers: [
      JigToastManager,
      {
        provide: NGN_TOAST_USER_DEFAULTS,
        useValue: defaultOptions || {},
      },
    ],
  };
}
