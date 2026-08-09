import { inject } from '@angular/core';

import { NgnGlobal } from './globals';

const idPrefix = 'awd-id-';

export function generateElementId() {
  return idPrefix + inject(NgnGlobal).nextElementId++;
}
