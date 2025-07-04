import { Provider } from '@angular/core';
import { I18n } from '@ngneers/controls/i18n';
import { NgnGlobal } from '@ngneers/controls/utils';

import { NgnConfigInit, provideNgnConfig } from './config';
import { ThemeService } from './theme-service';

export function provideNgnControls(config?: NgnConfigInit): Provider[] {
  return [NgnGlobal, ThemeService, I18n, provideNgnConfig(config)];
}
