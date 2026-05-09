import { inject, InjectionToken, provideAppInitializer, type Provider } from '@angular/core';
import { registerCustomLanguages, type Translations } from '@ngneers/controls/i18n';
import { type DeepPartial, Logger, type LogLevel } from '@ngneers/controls/utils';

import type { TooltipOptions } from './tooltip';
import type { NgnStateStorage } from '@ngneers/controls/utils-ng';
import type { StyleScope, Theme } from '@ngneers/controls-themes';

export const NGN_CONFIG = new InjectionToken<NgnConfig>('NGN_CONFIG');

export type NgnConfig = {
  readonly logLevel: LogLevel;
  readonly customTranslations?: Record<string, () => Promise<Translations>>;
  readonly disableAnimations: boolean;
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
    readonly tooltip: TooltipOptions;
  };
};

export type NgnConfigInit = DeepPartial<
  NgnConfig,
  'theme.preset.*' | 'theme.styleScope.*' | 'customTranslations.*'
>;

export const defaultNgnConfig: NgnConfig = {
  logLevel: 'info',
  disableAnimations: false,
  theme: {
    preset: null,
    lazyLoaded: false,
    styleScope: null,
    cssLayer: 'ngn-controls',
    namePrefix: 'ngn-',
  },
  defaults: {
    stateStorage: 'session',
    splitter: {
      stateStorage: 'session',
    },
    tooltip: {
      placement: 'bottom',
      offset: 4,
      showDelay: '0.5s',
      hideDelay: '0.1s',
      showArrow: true,
      showOnHover: true,
      showOnFocus: true,
      hideOnTooltipHover: false,
      hideOnClick: true,
      autoAriaMode: 'description',
    },
  },
};

export function provideNgnConfig(config?: NgnConfigInit): Provider {
  return [
    {
      provide: NGN_CONFIG,
      useValue: {
        logLevel: config?.logLevel ?? defaultNgnConfig.logLevel,
        customTranslations: config?.customTranslations,
        disableAnimations: config?.disableAnimations ?? defaultNgnConfig.disableAnimations,
        theme: {
          preset: config?.theme?.preset ?? defaultNgnConfig.theme.preset,
          lazyLoaded: config?.theme?.lazyLoaded ?? defaultNgnConfig.theme.lazyLoaded,
          styleScope: config?.theme?.styleScope ?? defaultNgnConfig.theme.styleScope,
          cssLayer:
            config?.theme?.cssLayer === undefined
              ? defaultNgnConfig.theme.cssLayer
              : config?.theme?.cssLayer,
          namePrefix: config?.theme?.namePrefix ?? defaultNgnConfig.theme.namePrefix,
        },
        defaults: {
          stateStorage: config?.defaults?.stateStorage ?? defaultNgnConfig.defaults.stateStorage,
          splitter: {
            stateStorage:
              config?.defaults?.splitter?.stateStorage ??
              config?.defaults?.stateStorage ??
              defaultNgnConfig.defaults.splitter.stateStorage,
          },
          tooltip: {
            placement:
              config?.defaults?.tooltip?.placement ?? defaultNgnConfig.defaults.tooltip.placement,
            offset: config?.defaults?.tooltip?.offset ?? defaultNgnConfig.defaults.tooltip.offset,
            showDelay:
              config?.defaults?.tooltip?.showDelay ?? defaultNgnConfig.defaults.tooltip.showDelay,
            hideDelay:
              config?.defaults?.tooltip?.hideDelay ?? defaultNgnConfig.defaults.tooltip.hideDelay,
            showArrow:
              config?.defaults?.tooltip?.showArrow ?? defaultNgnConfig.defaults.tooltip.showArrow,
            showOnHover:
              config?.defaults?.tooltip?.showOnHover ??
              defaultNgnConfig.defaults.tooltip.showOnHover,
            showOnFocus:
              config?.defaults?.tooltip?.showOnFocus ??
              defaultNgnConfig.defaults.tooltip.showOnFocus,
            hideOnTooltipHover:
              config?.defaults?.tooltip?.hideOnTooltipHover ??
              defaultNgnConfig.defaults.tooltip.hideOnTooltipHover,
            hideOnClick:
              config?.defaults?.tooltip?.hideOnClick ??
              defaultNgnConfig.defaults.tooltip.hideOnClick,
            autoAriaMode:
              config?.defaults?.tooltip?.autoAriaMode ??
              defaultNgnConfig.defaults.tooltip.autoAriaMode,
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
