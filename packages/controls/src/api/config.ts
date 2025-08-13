import { inject, InjectionToken, provideAppInitializer, Provider } from '@angular/core';
import { registerCustomLanguages, Translations } from '@ngneers/controls/i18n';
import { DeepPartial, Logger, LogLevel, NgnStateStorage } from '@ngneers/controls/utils';
import { StyleScope, Theme } from '@ngneers/controls-themes';

export const NGN_CONFIG = new InjectionToken<NgnConfig>('NGN_CONFIG');

export type NgnConfig = {
  readonly logLevel: LogLevel;
  readonly customTranslations?: Record<string, () => Promise<Translations>>;
  readonly theme: {
    readonly preset: Theme | null;
    readonly lazyLoaded: boolean;
    readonly styleScope: StyleScope | null;
    readonly cssLayer: string | null;
    readonly namePrefix: string;
  };
  readonly defaults: {
    readonly stateStorage: NgnStateStorage;
    readonly splitter: {
      readonly stateStorage: NgnStateStorage;
    };
  };
};

export type NgnConfigInit = DeepPartial<
  NgnConfig,
  'theme.preset.*' | 'theme.styleScope.*' | 'customTranslations.*'
>;

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
        defaults: {
          stateStorage: config?.defaults?.stateStorage ?? 'session',
          splitter: {
            stateStorage:
              config?.defaults?.splitter?.stateStorage ??
              config?.defaults?.stateStorage ??
              'session',
          },
        },
      } satisfies NgnConfig,
    },
    provideAppInitializer(() => {
      const config = inject(NGN_CONFIG);
      if (config?.customTranslations) {
        registerCustomLanguages(config.customTranslations);
      }
      Logger.logLevel = config.logLevel ?? Logger.logLevel;
    }),
  ];
}
