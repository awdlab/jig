import { Provider } from '@angular/core';
import { NgnGlobal } from '@ngneers/controls/utils';

export function provideNgnControls(): Provider[] {
  return [NgnGlobal];
}
