import { inject, Injector, runInInjectionContext } from '@angular/core';
import { throwExp } from '@ngneers/controls/utils';

import { NgnToastManager } from './toast-manager';
import { NgnToastOptions, NgnToastRef } from './types';

class ToastCreator {
  private readonly _manager: NgnToastManager;

  constructor() {
    this._manager =
      inject(NgnToastManager, { optional: true }) ??
      throwExp('Toast', 'NgnToastManager not found. Make sure to provide the Toast feature.');
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
