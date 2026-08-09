import { I18n } from '@awdlab/jig/i18n';
import { AwdGlobal } from '@awdlab/jig/utils-ng';

import { type AwdConfigInit, provideAwdConfig } from './config';
import { Platform } from './platform';
import { ThemeService } from './theme-service';

import type { EnvironmentProviders, Provider } from '@angular/core';

export type AwdFeature = {
  providers: (Provider | EnvironmentProviders)[];
};

export function provideAwdControls(
  config?: AwdConfigInit,
  ...features: AwdFeature[]
): (Provider | EnvironmentProviders)[] {
  return [
    AwdGlobal,
    ThemeService,
    I18n,
    Platform,
    provideAwdConfig(config),
    ...features.map(f => f.providers).flat(),
  ];
}
