import { Injector, runInInjectionContext } from '@angular/core';
import { injectOrThrow } from '@awdlab/jig/utils-ng';

import { JigSnackbarManager } from './snackbar-manager';

import type { JigSnackbarOptions, JigSnackbarRef } from './types';

export class SnackbarCreator {
  private readonly _manager: JigSnackbarManager;

  constructor() {
    this._manager = injectOrThrow(
      JigSnackbarManager,
      'injectSnackbarCreator',
      'JigSnackbarManager not found. Make sure to use withSnackbars() to provide jig snackbars!'
    );
  }

  public show(options: JigSnackbarOptions): JigSnackbarRef {
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
