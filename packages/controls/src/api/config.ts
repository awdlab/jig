import { inject, InjectionToken, provideAppInitializer, Provider } from '@angular/core';
import { DeepPartial } from '@ngneers/controls/utils';
import { StyleScope, Theme } from '@ngneers/controls-themes';
import { Logger, LogLevel } from 'packages/controls/src/utils/logger';

export const NGN_CONFIG = new InjectionToken<NgnConfig>('NGN_CONFIG');

export type NgnConfig = {
  readonly logLevel: LogLevel;
  readonly theme: {
    readonly preset: Theme | null;
    readonly lazyLoaded: boolean;
    readonly styleScope: StyleScope | null;
    readonly cssLayer: string | null;
    readonly namePrefix: string;
  };
};

export type NgnConfigInit = DeepPartial<NgnConfig, 'theme.preset.*' | 'theme.styleScope.*'>;

export function provideNgnConfig(config?: NgnConfigInit): Provider {
  return [
    {
      provide: NGN_CONFIG,
      useValue: {
        logLevel: config?.logLevel ?? 'info',
        theme: {
          preset: config?.theme?.preset ?? null,
          lazyLoaded: config?.theme?.lazyLoaded ?? false,
          styleScope: config?.theme?.styleScope ?? null,
          cssLayer:
            config?.theme?.cssLayer === undefined ? 'ngn-controls' : config?.theme?.cssLayer,
          namePrefix: config?.theme?.namePrefix ?? 'ngn-',
        },
      } satisfies NgnConfig,
    },
    provideAppInitializer(() => {
      const config = inject(NGN_CONFIG);
      Logger.logLevel = config.logLevel ?? Logger.logLevel;
    }),
  ];
}
