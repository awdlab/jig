import { Provider } from '@angular/core';
import { NgnGlobal } from '@ngneers/controls/utils';

import { NgnConfigInit, provideNgnConfig } from './config';
import { ThemeService } from './theme-service';

export function provideNgnControls(config?: NgnConfigInit): Provider[] {
  return [NgnGlobal, ThemeService, provideNgnConfig(config)];
}
