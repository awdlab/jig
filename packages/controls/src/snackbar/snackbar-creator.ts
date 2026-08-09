import { Injector, runInInjectionContext } from '@angular/core';
import { injectOrThrow } from '@awdlab/jig/utils-ng';

import { AwdSnackbarManager } from './snackbar-manager';

import type { AwdSnackbarOptions, AwdSnackbarRef } from './types';

export class SnackbarCreator {
  private readonly _manager: AwdSnackbarManager;

  constructor() {
    this._manager = injectOrThrow(
      AwdSnackbarManager,
      'injectSnackbarCreator',
      'AwdSnackbarManager not found. Make sure to use withSnackbars() to provide jig snackbars!'
    );
  }

  public show(options: AwdSnackbarOptions): AwdSnackbarRef {
    const id = this._manager.addSnackbar(options);
    return {
      hide: () => this._manager.removeSnackbar(id),
    };
  }
}

export function injectSnackbarCreator(injector?: Injector): SnackbarCreator {
  if (injector) {
    return runInInjectionContext(injector, () => injectSnackbarCreator());
  }
  return new SnackbarCreator();
}
