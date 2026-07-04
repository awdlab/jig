import { Injector, runInInjectionContext } from '@angular/core';
import { injectOrThrow } from '@ngneers/controls/utils-ng';

import { NgnSnackbarManager } from './snackbar-manager';

import type { NgnSnackbarOptions, NgnSnackbarRef } from './types';

export class SnackbarCreator {
  private readonly _manager: NgnSnackbarManager;

  constructor() {
    this._manager = injectOrThrow(
      NgnSnackbarManager,
      'injectSnackbarCreator',
      'NgnSnackbarManager not found. Make sure to use withSnackbars() to provide ngn snackbars!'
    );
  }

  public show(options: NgnSnackbarOptions): NgnSnackbarRef {
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
