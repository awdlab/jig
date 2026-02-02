import { Signal } from '@angular/core';
import { toggleClass } from '@ngneers/controls/utils';

import { effectWithPrevious } from './signals';

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
