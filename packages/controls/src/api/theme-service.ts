import {
  DOCUMENT,
  inject,
  Injectable,
  Injector,
  OnDestroy,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Logger } from '@ngneers/controls/utils';
import { applyTheme, ControlTemplate, getClassName, Theme } from '@ngneers/controls-themes';
import { skip } from 'rxjs';

import { NGN_CONFIG } from './config';

export type ControlTemplateInfo<T extends ControlTemplate> = {
  scope: string;
  class: (className?: T['classNames'][number] | '') => string;
};

export function injectThemeTemplate<T extends ControlTemplate>(
  template: T,
  options?: { injector?: Injector }
): ControlTemplateInfo<T> {
  const config = options?.injector?.get(NGN_CONFIG) ?? inject(NGN_CONFIG);
  const themeService = options?.injector?.get(ThemeService) ?? inject(ThemeService);
  themeService.loadScope(template.scope);
  return {
    scope: template.scope,
    class: getClassName.bind(null, config.theme.namePrefix, template.scope),
  };
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
    this._loadedScopes.forEach(scope => {
      Logger.debug(`Reloading theme scope "${scope}" for active theme "${newTheme.name}".`);
      this.applyTheme(newTheme, [scope]);
    });
  }

  private unloadAllScopes(): void {
    Logger.warn('Unloading all theme scopes is not implemented yet. This is a placeholder method.');
  }

  private applyTheme(theme: Theme, scopes: string[]): void {
    applyTheme(theme, scopes, {
      document: this._document,
      layer: this._config.theme.cssLayer ?? undefined,
      styleScope: this._config.theme.styleScope ?? undefined,
      namePrefix: this._config.theme.namePrefix,
    });
  }
}
