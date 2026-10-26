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

/** Appends, prepends or removes space-separated `ids` in an IDREF list attribute such as `aria-labelledby`. */
export function toggleIdRefs(
  element: HTMLElement,
  attribute: string,
  ids: string,
  mode: 'append' | 'prepend' | 'remove'
) {
  const changed = ids.split(/\s+/).filter(Boolean);
  const kept = (element.getAttribute(attribute)?.split(/\s+/) ?? []).filter(
    id => id && !changed.includes(id)
  );
  const refs =
    mode === 'remove' ? kept : mode === 'prepend' ? [...changed, ...kept] : [...kept, ...changed];
  if (refs.length) {
    element.setAttribute(attribute, refs.join(' '));
  } else {
    element.removeAttribute(attribute);
  }
}
