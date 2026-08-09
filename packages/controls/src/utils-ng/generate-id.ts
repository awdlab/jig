import { inject } from '@angular/core';

import { JigGlobal } from './globals';

const idPrefix = 'jig-id-';

export function generateElementId() {
  return idPrefix + inject(JigGlobal).nextElementId++;
}
