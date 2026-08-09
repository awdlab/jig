import { I18n } from '@awdlab/jig/i18n';
import { JigGlobal } from '@awdlab/jig/utils-ng';

import { type JigConfigInit, provideJigConfig } from './config';
import { Platform } from './platform';
import { ThemeService } from './theme-service';

import type { EnvironmentProviders, Provider } from '@angular/core';

export type JigFeature = {
  providers: (Provider | EnvironmentProviders)[];
};

export function provideJigControls(
  config?: JigConfigInit,
  ...features: JigFeature[]
): (Provider | EnvironmentProviders)[] {
  return [
    JigGlobal,
    ThemeService,
    I18n,
    Platform,
    provideJigConfig(config),
    ...features.map(f => f.providers).flat(),
  ];
}
