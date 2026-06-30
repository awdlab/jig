import {
  DOCUMENT,
  inject,
  Injectable,
  Injector,
  type OnDestroy,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Logger } from '@ngneers/controls/utils';
import {
  applyGlobalStyles,
  applyTheme,
  type ControlName,
  type ControlTemplate,
  getClassName,
  type Theme,
  type ThemeClasses,
  type ThemeTemplate,
} from '@ngneers/controls-themes';
import { globalStyles } from '@ngneers/controls-themes/base/global';
import { skip } from 'rxjs';

import { NGN_CONFIG, type NgnConfig } from './config';

export type AppliedThemeClassCfg<T extends ControlName> =
  | keyof ThemeClasses<ThemeTemplate[T]>
  | Partial<Record<keyof ThemeClasses<ThemeTemplate[T]>, boolean | (() => boolean)>>;

export type ControlTemplateInfo<T extends ControlTemplate<string, string[]>> = {
  scope: string;
  class: (className: T['classNames'][number]) => string;
  classes: (classes: {
    [K in T['classNames'][number]]?: boolean;
  }) => string;
};

export function themeTemplateToTemplateInfo<T extends ControlTemplate<string, string[]>>(
  config: NgnConfig,
  template: T,
  options?: { unstyled?: () => boolean }
): ControlTemplateInfo<T> {
  return {
    scope: template.scope,
    class: (className: T['classNames'][number]) =>
      getClassName(config.theme.namePrefix, template.scope, className, options?.unstyled?.()),
    classes: (classes: {
      [K in T['classNames'][number]]?: boolean;
    }): string => {
      let result = '';
      for (const className in classes) {
        if ((classes as Record<string, boolean | undefined>)[className]) {
          if (result) result += ' ';
          result += getClassName(
            config.theme.namePrefix,
            template.scope,
            className,
            options?.unstyled?.()
          );
        }
      }
      return result;
    },
  };
}

export function injectThemeTemplate<T extends ControlTemplate<string, string[]>>(
  template: T,
  options?: { injector?: Injector; unstyled?: () => boolean }
): ControlTemplateInfo<T> {
  const config = options?.injector?.get(NGN_CONFIG) ?? inject(NGN_CONFIG);
  const themeService = options?.injector?.get(ThemeService) ?? inject(ThemeService);
  themeService.loadScope(template.scope);
  return themeTemplateToTemplateInfo(config, template, { unstyled: options?.unstyled });
}

export function injectTheme<T extends ControlName>(
  controlName: T,
  options?: { injector?: Injector }
): ControlTemplate<T, string[]> {
  const themeService = options?.injector?.get(ThemeService) ?? inject(ThemeService);
  const theme = themeService.activeTheme();
  if (!theme) {
    throw new Error(
      `No active theme is set. Cannot inject theme for control "${controlName}". Please provide a theme in the configuration or set lazyLoaded to true if you plan to load themes dynamically.`
    );
  }
  const template = theme.parts.find(part => part.scope === controlName)?.controlTemplate as
    | ControlTemplate<T, string[]>
    | undefined;
  if (!template) {
    throw new Error(
      `The active theme "${theme.name}" does not contain a template for control "${controlName}".`
    );
  }
  return template;
}

export function getAppliedClasses<T extends ControlName>(
  klass: AppliedThemeClassCfg<T>,
  themeTemplateInfo: Omit<ControlTemplateInfo<ControlTemplate<T, string[]>>, 'class' | 'classes'>
): Array<{ class: string; name: string }> {
  function suffixes() {
    if (typeof klass === 'string') {
      return [klass];
    } else if (typeof klass === 'object' && klass !== null) {
      return Object.entries(klass)
        .filter(([_, value]) => (typeof value === 'function' ? value() : value))
        .map(([key, _]) => key);
    }
    return [];
  }
  const classes = suffixes().map(suffix => ({
    class: (themeTemplateInfo as ControlTemplateInfo<ControlTemplate<T, string[]>>).class(suffix),
    name: suffix,
  }));
  return classes;
}

@Injectable()
export class ThemeService implements OnDestroy {
  private readonly _config = inject(NGN_CONFIG);
  private readonly _loadedScopes = new Set<string>();
  private readonly _document = inject(DOCUMENT);

  public readonly activeTheme = signal(this._config.theme?.preset);

  constructor() {
    if (!this._config.theme?.preset && !this._config.theme?.lazyLoaded) {
      console.warn(
        'No active theme found. Please provide a theme in the configuration or set lazyLoaded to true if you plan to load themes dynamically.'
      );
    }

    if (this._config.disableAnimations) {
      const style = this._document.createElement('style');
      style.setAttribute('ngn-style', '');
      // we set the durations instead of setting animation/transition to none,
      // so that the animation starts/ends are still applied & the events are still fired
      style.innerHTML = `.ngn-control, .ngn-control * {
        animation-duration: 0s !important;
        transition-duration: 0s !important;
      }`;
      this._document.head.appendChild(style);
      Logger.debug('Animations have been disabled via configuration.');
    }

    toObservable(this.activeTheme)
      .pipe(takeUntilDestroyed(), skip(1))
      .subscribe(this.onThemeChange.bind(this));
  }

  public loadScope(scope: string): void {
    if (this._loadedScopes.has(scope)) {
      Logger.debug(`Theme scope "${scope}" is already loaded.`);
      return;
    }

    const activeTheme = untracked(() => this.activeTheme());
    if (!activeTheme) {
      Logger.debug(
        `No active theme set. Cannot load theme scope "${scope}". Scope will be loaded when the theme is set.`
      );
      return;
    } else {
      Logger.debug(`Loading theme scope "${scope}" for active theme "${activeTheme.name}".`);
      this.applyTheme(activeTheme, [scope]);
    }

    this._loadedScopes.add(scope);
  }

  public ngOnDestroy(): void {
    Logger.debug('ThemeService is being destroyed. Unloading all theme scopes...');
    this.unloadAllScopes();
    this._loadedScopes.clear();
  }

  private onThemeChange(newTheme: Theme | null): void {
    if (!newTheme) {
      Logger.warn('The active theme has been set to null.');
      this.unloadAllScopes();
      return;
    }

    Logger.debug(`Active theme changed to "${newTheme.name}". Reloading scopes...`);
    this.unloadAllScopes();
    this._loadedScopes.forEach(scope => {
      Logger.debug(`Reloading theme scope "${scope}" for active theme "${newTheme.name}".`);
      this.applyTheme(newTheme, [scope]);
    });
  }

  private unloadAllScopes(): void {
    this._document.head.querySelectorAll('style[ngn-style][data-theme-scope]').forEach(el => {
      el.remove();
    });
  }

  private applyTheme(theme: Theme, scopes: string[]): void {
    applyTheme(theme, scopes, {
      document: this._document,
      layer: this._config.theme.cssLayer ?? undefined,
      styleScope: this._config.theme.styleScope ?? undefined,
      namePrefix: this._config.theme.namePrefix,
    });
    applyGlobalStyles(globalStyles, {
      document: this._document,
      layer: this._config.theme.cssLayer ?? undefined,
      styleScope: this._config.theme.styleScope ?? undefined,
      namePrefix: this._config.theme.namePrefix,
    });
  }
}
