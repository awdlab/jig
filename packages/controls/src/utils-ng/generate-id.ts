import { HostAttributeToken, inject } from '@angular/core';

import { JigGlobal } from './globals';

const idPrefix = 'jig-id-';

export function generateElementId() {
  return idPrefix + inject(JigGlobal).nextElementId++;
}

/** The host element's static `id` attribute when set, else a generated id. */
export function hostOrGeneratedId() {
  return inject(new HostAttributeToken('id'), { optional: true }) ?? generateElementId();
}
