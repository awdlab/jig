import { Injector, runInInjectionContext } from '@angular/core';
import { injectOrThrow } from '@awdlab/jig/utils-ng';

import { AwdToastManager } from './toast-manager';

import type { AwdToastOptions, AwdToastRef } from './types';

class ToastCreator {
  private readonly _manager: AwdToastManager;

  constructor() {
    this._manager = injectOrThrow(
      AwdToastManager,
      'injectToastCreator',
      'AwdToastManager not found. Make sure to use withToasts() to provide jig toasts!'
    );
  }

  public show(options: AwdToastOptions): AwdToastRef {
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
