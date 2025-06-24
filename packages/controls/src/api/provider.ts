import { Provider } from '@angular/core';

import { NgnGlobal } from '../utils';

export function provideNgnControls(): Provider[] {
  return [NgnGlobal];
}
