import { I18n } from '@ngneers/controls/i18n';
import { NgnGlobal } from '@ngneers/controls/utils-ng';

import { type NgnConfigInit, provideNgnConfig } from './config';
import { Platform } from './platform';
import { ThemeService } from './theme-service';

import type { EnvironmentProviders, Provider } from '@angular/core';

export type NgnFeature = {
  providers: (Provider | EnvironmentProviders)[];
};

export function provideNgnControls(
  config?: NgnConfigInit,
  ...features: NgnFeature[]
): (Provider | EnvironmentProviders)[] {
  return [
    NgnGlobal,
    ThemeService,
    I18n,
    Platform,
    provideNgnConfig(config),
    ...features.map(f => f.providers).flat(),
  ];
}
