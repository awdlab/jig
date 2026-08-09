import { toggleClass } from '@awdlab/jig/utils';

import { effectWithPrevious } from './signals';

import type { Signal } from '@angular/core';

export function classSignal(element: HTMLElement, klass: Signal<string | string[]>) {
  effectWithPrevious(klass, (current, previous) => {
    if (previous) {
      toggleClass(element, previous, false);
    }
    if (current) {
      toggleClass(element, current, true);
    }
  });
}
