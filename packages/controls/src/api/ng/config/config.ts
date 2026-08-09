import { inject, InjectionToken, provideAppInitializer, type Provider } from '@angular/core';
import { registerCustomLanguages, type Translations } from '@awdlab/jig/i18n';
import { type DeepPartial, Logger, type LogLevel } from '@awdlab/jig/utils';

import type { TooltipOptions } from './tooltip';
import type { AwdStateStorage } from '@awdlab/jig/utils-ng';
import type { StyleScope, Theme } from '@awdlab/jig-themes';

export const NGN_CONFIG = new InjectionToken<AwdConfig>('NGN_CONFIG');

export type AwdConfig = {
  readonly logLevel: LogLevel;
  readonly customTranslations?: Record<string, () => Promise<Translations>>;
  readonly disableAnimations: boolean;
  /** Collapse control animations to a near-zero duration while `prefers-reduced-motion: reduce` is set. */
  readonly respectReducedMotion: boolean;
  readonly theme: {
    readonly preset: Theme | null;
    readonly lazyLoaded: boolean;
    readonly styleScope: StyleScope | null;
    readonly cssLayer: string | null;
    readonly namePrefix: string;
  };
  readonly defaults: {
    readonly stateStorage: AwdStateStorage;
    readonly splitter: {
      readonly stateStorage: AwdStateStorage;
    };
    readonly tooltip: TooltipOptions;
  };
};

export type AwdConfigInit = DeepPartial<
  AwdConfig,
  'theme.preset.*' | 'theme.styleScope.*' | 'customTranslations.*'
>;

export const defaultAwdConfig: AwdConfig = {
  logLevel: 'info',
  disableAnimations: false,
  respectReducedMotion: true,
  theme: {
    preset: null,
    lazyLoaded: false,
    styleScope: null,
    cssLayer: 'jig-controls',
    namePrefix: 'jig-',
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

export function provideAwdConfig(config?: AwdConfigInit): Provider {
  return [
    {
      provide: NGN_CONFIG,
      useValue: {
        logLevel: config?.logLevel ?? defaultAwdConfig.logLevel,
        customTranslations: config?.customTranslations,
        disableAnimations: config?.disableAnimations ?? defaultAwdConfig.disableAnimations,
        respectReducedMotion: config?.respectReducedMotion ?? defaultAwdConfig.respectReducedMotion,
        theme: {
          preset: config?.theme?.preset ?? defaultAwdConfig.theme.preset,
          lazyLoaded: config?.theme?.lazyLoaded ?? defaultAwdConfig.theme.lazyLoaded,
          styleScope: config?.theme?.styleScope ?? defaultAwdConfig.theme.styleScope,
          cssLayer:
            config?.theme?.cssLayer === undefined
              ? defaultAwdConfig.theme.cssLayer
              : config?.theme?.cssLayer,
          namePrefix: config?.theme?.namePrefix ?? defaultAwdConfig.theme.namePrefix,
        },
        defaults: {
          stateStorage: config?.defaults?.stateStorage ?? defaultAwdConfig.defaults.stateStorage,
          splitter: {
            stateStorage:
              config?.defaults?.splitter?.stateStorage ??
              config?.defaults?.stateStorage ??
              defaultAwdConfig.defaults.splitter.stateStorage,
          },
          tooltip: {
            placement:
              config?.defaults?.tooltip?.placement ?? defaultAwdConfig.defaults.tooltip.placement,
            offset: config?.defaults?.tooltip?.offset ?? defaultAwdConfig.defaults.tooltip.offset,
            showDelay:
              config?.defaults?.tooltip?.showDelay ?? defaultAwdConfig.defaults.tooltip.showDelay,
            hideDelay:
              config?.defaults?.tooltip?.hideDelay ?? defaultAwdConfig.defaults.tooltip.hideDelay,
            showArrow:
              config?.defaults?.tooltip?.showArrow ?? defaultAwdConfig.defaults.tooltip.showArrow,
            showOnHover:
              config?.defaults?.tooltip?.showOnHover ??
              defaultAwdConfig.defaults.tooltip.showOnHover,
            showOnFocus:
              config?.defaults?.tooltip?.showOnFocus ??
              defaultAwdConfig.defaults.tooltip.showOnFocus,
            hideOnTooltipHover:
              config?.defaults?.tooltip?.hideOnTooltipHover ??
              defaultAwdConfig.defaults.tooltip.hideOnTooltipHover,
            hideOnClick:
              config?.defaults?.tooltip?.hideOnClick ??
              defaultAwdConfig.defaults.tooltip.hideOnClick,
            autoAriaMode:
              config?.defaults?.tooltip?.autoAriaMode ??
              defaultAwdConfig.defaults.tooltip.autoAriaMode,
          },
        },
      } satisfies AwdConfig,
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
