import { Injectable } from '@angular/core';
import { NotificationManager } from '@awdlab/jig/utils-ng';

import { DEFAULT_TOAST_OPTIONS } from './defaults';
import { JIG_TOAST_USER_DEFAULTS } from './provider';
import { JigToastHost } from './toast-host';

import type { JigToastOptions } from './types';

@Injectable()
export class JigToastManager extends NotificationManager<JigToastOptions> {
  constructor() {
    super(
      'JigToastManager',
      JigToastHost,
      DEFAULT_TOAST_OPTIONS,
      JIG_TOAST_USER_DEFAULTS,
      'Failed to inject JIG_TOAST_USER_DEFAULTS, make sure to use withToasts() to provide jig toasts!'
    );
  }
}
