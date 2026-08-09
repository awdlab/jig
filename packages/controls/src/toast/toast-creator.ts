import { Injector, runInInjectionContext } from '@angular/core';
import { injectOrThrow } from '@awdlab/jig/utils-ng';

import { JigToastManager } from './toast-manager';

import type { JigToastOptions, JigToastRef } from './types';

class ToastCreator {
  private readonly _manager: JigToastManager;

  constructor() {
    this._manager = injectOrThrow(
      JigToastManager,
      'injectToastCreator',
      'JigToastManager not found. Make sure to use withToasts() to provide jig toasts!'
    );
  }

  public show(options: JigToastOptions): JigToastRef {
    const id = this._manager.addToast(options);
    return {
      hide: () => this._manager.removeToast(id),
    };
  }
}

export function injectToastCreator(injector?: Injector): ToastCreator {
  if (injector) {
    return runInInjectionContext(injector, () => injectToastCreator());
  }
  return new ToastCreator();
}
