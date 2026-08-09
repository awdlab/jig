import { inject } from '@angular/core';

import { AwdGlobal } from './globals';

const idPrefix = 'jig-id-';

export function generateElementId() {
  return idPrefix + inject(AwdGlobal).nextElementId++;
}
