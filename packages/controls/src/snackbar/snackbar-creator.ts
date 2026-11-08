import { Injector, runInInjectionContext } from '@angular/core';
import { injectOrThrow, NotificationCreator } from '@awdlab/jig/utils-ng';

import { JigSnackbarManager } from './snackbar-manager';

import type { JigSnackbarOptions } from './types';

export class SnackbarCreator extends NotificationCreator<JigSnackbarOptions> {
  constructor() {
    super(
      injectOrThrow(
        JigSnackbarManager,
        'injectSnackbarCreator',
        'JigSnackbarManager not found. Make sure to use withSnackbars() to provide jig snackbars!'
      )
    );
  }
}

export function injectSnackbarCreator(injector?: Injector): SnackbarCreator {
  if (injector) {
    return runInInjectionContext(injector, () => injectSnackbarCreator());
  }
  return new SnackbarCreator();
}
