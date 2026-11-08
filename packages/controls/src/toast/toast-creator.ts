import { Injector, runInInjectionContext } from '@angular/core';
import { injectOrThrow, NotificationCreator } from '@awdlab/jig/utils-ng';

import { JigToastManager } from './toast-manager';

import type { JigToastOptions } from './types';

class ToastCreator extends NotificationCreator<JigToastOptions> {
  constructor() {
    super(
      injectOrThrow(
        JigToastManager,
        'injectToastCreator',
        'JigToastManager not found. Make sure to use withToasts() to provide jig toasts!'
      )
    );
  }
}

export function injectToastCreator(injector?: Injector): ToastCreator {
  if (injector) {
    return runInInjectionContext(injector, () => injectToastCreator());
  }
  return new ToastCreator();
}
