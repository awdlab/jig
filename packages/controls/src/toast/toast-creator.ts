import { Injector, runInInjectionContext } from '@angular/core';
import { injectOrThrow } from '@ngneers/controls/utils-ng';

import { NgnToastManager } from './toast-manager';
import { NgnToastOptions, NgnToastRef } from './types';

class ToastCreator {
  private readonly _manager: NgnToastManager;

  constructor() {
    this._manager = injectOrThrow(
      NgnToastManager,
      'injectToastCreator',
      'NgnToastManager not found. Make sure to use withToasts() to provide ngn toasts!'
    );
  }

  public show(options: NgnToastOptions): NgnToastRef {
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
