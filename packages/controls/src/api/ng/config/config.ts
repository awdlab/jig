import { inject, InjectionToken, provideAppInitializer, type Provider } from '@angular/core';
import { registerCustomLanguages, type Translations } from '@awdlab/jig/i18n';
import { type DeepPartial, Logger, type LogLevel } from '@awdlab/jig/utils';

import type { TooltipOptions } from './tooltip';
import type { JigStateStorage } from '@awdlab/jig/utils-ng';
import type { StyleScope, Theme } from '@awdlab/jig-themes';

export const JIG_CONFIG = new InjectionToken<JigConfig>('JIG_CONFIG');

export type JigConfig = {
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
    readonly stateStorage: JigStateStorage;
    readonly splitter: {
      readonly stateStorage: JigStateStorage;
    };
    readonly inputField: {
      /** Mark the label of a field whose control is required. */
      readonly showRequiredMarker: boolean;
    };
    readonly tooltip: TooltipOptions;
  };
};

export type JigConfigInit = DeepPartial<
  JigConfig,
  'theme.preset.*' | 'theme.styleScope.*' | 'customTranslations.*'
>;

export const defaultJigConfig: JigConfig = {
  logLevel: 'info',
  disableAnimations: false,
  respectReducedMotion: true,
  theme: {
    preset: null,
    lazyLoaded: false,
    styleScope: null,
    cssLayer: 'jig',
    namePrefix: 'jig-',
  },
  defaults: {
    stateStorage: 'session',
    splitter: {
      stateStorage: 'session',
    },
    inputField: {
      showRequiredMarker: false,
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

export function provideJigConfig(config?: JigConfigInit): Provider {
  return [
    {
      provide: JIG_CONFIG,
      useValue: {
        logLevel: config?.logLevel ?? defaultJigConfig.logLevel,
        customTranslations: config?.customTranslations,
        disableAnimations: config?.disableAnimations ?? defaultJigConfig.disableAnimations,
        respectReducedMotion: config?.respectReducedMotion ?? defaultJigConfig.respectReducedMotion,
        theme: {
          preset: config?.theme?.preset ?? defaultJigConfig.theme.preset,
          lazyLoaded: config?.theme?.lazyLoaded ?? defaultJigConfig.theme.lazyLoaded,
          styleScope: config?.theme?.styleScope ?? defaultJigConfig.theme.styleScope,
          cssLayer:
            config?.theme?.cssLayer === undefined
              ? defaultJigConfig.theme.cssLayer
              : config?.theme?.cssLayer,
          namePrefix: config?.theme?.namePrefix ?? defaultJigConfig.theme.namePrefix,
        },
        defaults: {
          stateStorage: config?.defaults?.stateStorage ?? defaultJigConfig.defaults.stateStorage,
          splitter: {
            stateStorage:
              config?.defaults?.splitter?.stateStorage ??
              config?.defaults?.stateStorage ??
              defaultJigConfig.defaults.splitter.stateStorage,
          },
          inputField: {
            showRequiredMarker:
              config?.defaults?.inputField?.showRequiredMarker ??
              defaultJigConfig.defaults.inputField.showRequiredMarker,
          },
          tooltip: {
            placement:
              config?.defaults?.tooltip?.placement ?? defaultJigConfig.defaults.tooltip.placement,
            offset: config?.defaults?.tooltip?.offset ?? defaultJigConfig.defaults.tooltip.offset,
            showDelay:
              config?.defaults?.tooltip?.showDelay ?? defaultJigConfig.defaults.tooltip.showDelay,
            hideDelay:
              config?.defaults?.tooltip?.hideDelay ?? defaultJigConfig.defaults.tooltip.hideDelay,
            showArrow:
              config?.defaults?.tooltip?.showArrow ?? defaultJigConfig.defaults.tooltip.showArrow,
            showOnHover:
              config?.defaults?.tooltip?.showOnHover ??
              defaultJigConfig.defaults.tooltip.showOnHover,
            showOnFocus:
              config?.defaults?.tooltip?.showOnFocus ??
              defaultJigConfig.defaults.tooltip.showOnFocus,
            hideOnTooltipHover:
              config?.defaults?.tooltip?.hideOnTooltipHover ??
              defaultJigConfig.defaults.tooltip.hideOnTooltipHover,
            hideOnClick:
              config?.defaults?.tooltip?.hideOnClick ??
              defaultJigConfig.defaults.tooltip.hideOnClick,
            autoAriaMode:
              config?.defaults?.tooltip?.autoAriaMode ??
              defaultJigConfig.defaults.tooltip.autoAriaMode,
          },
        },
      } satisfies JigConfig,
    },
    provideAppInitializer(() => {
      const config = inject(JIG_CONFIG);
      if (config?.customTranslations) {
        registerCustomLanguages(config.customTranslations);
      }
      Logger.logLevel = config.logLevel ?? Logger.logLevel;
    }),
  ];
}
