import { InjectionToken, type Provider } from '@angular/core';
import { provideNotifications } from '@awdlab/jig/utils-ng';

import { JigToastManager } from './toast-manager';

import type { JigToastOptionsMeta } from './types';

export type JigToastFeature = {
  providers: Provider[];
};

export const JIG_TOAST_USER_DEFAULTS = new InjectionToken<JigToastOptionsMeta>(
  'JIG_TOAST_USER_DEFAULTS'
);

export function withToasts(defaultOptions?: JigToastOptionsMeta): JigToastFeature {
  return {
    providers: provideNotifications(JigToastManager, JIG_TOAST_USER_DEFAULTS, defaultOptions),
  };
}
