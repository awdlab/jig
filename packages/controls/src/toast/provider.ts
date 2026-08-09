import { InjectionToken, type Provider } from '@angular/core';

import { AwdToastManager } from './toast-manager';

import type { AwdToastOptionsMeta } from './types';

export type AwdToastFeature = {
  providers: Provider[];
};

export const NGN_TOAST_USER_DEFAULTS = new InjectionToken<AwdToastOptionsMeta>(
  'NGN_TOAST_USER_DEFAULTS'
);

export function withToasts(defaultOptions?: AwdToastOptionsMeta): AwdToastFeature {
  return {
    providers: [
      AwdToastManager,
      {
        provide: NGN_TOAST_USER_DEFAULTS,
        useValue: defaultOptions || {},
      },
    ],
  };
}
