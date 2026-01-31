import { Signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { toggleClass } from '@ngneers/controls/utils';
import { pairwise, startWith } from 'rxjs';

export function classSignal(element: HTMLElement, klass: Signal<string | string[]>) {
  toObservable(klass)
    .pipe(takeUntilDestroyed(), startWith(null), pairwise())
    .subscribe(([prev, next]) => {
      if (prev) {
        toggleClass(element, prev, false);
      }
      if (next) {
        toggleClass(element, next, true);
      }
    });
}
