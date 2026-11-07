import { Injectable } from '@angular/core';
import { NotificationManager } from '@awdlab/jig/utils-ng';

import { DEFAULT_SNACKBAR_OPTIONS } from './defaults';
import { JIG_SNACKBAR_USER_DEFAULTS } from './provider';
import { JigSnackbarHost } from './snackbar-host';

import type { JigSnackbarOptions } from './types';

@Injectable()
export class JigSnackbarManager extends NotificationManager<JigSnackbarOptions> {
  constructor() {
    super(
      'JigSnackbarManager',
      JigSnackbarHost,
      DEFAULT_SNACKBAR_OPTIONS,
      JIG_SNACKBAR_USER_DEFAULTS,
      'Failed to inject JIG_SNACKBAR_USER_DEFAULTS, make sure to use withSnackbars() to provide jig snackbars!'
    );
  }
}
