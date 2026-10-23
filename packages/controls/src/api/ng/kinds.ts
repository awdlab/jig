import { computed, inject, type Signal } from '@angular/core';
import { Logger } from '@awdlab/jig/utils';

import { JIG_CONFIG, type JigConfig } from './config';
import { ThemeService } from './theme-service';

import type { CustomColor, CustomKind } from '@awdlab/jig-custom-types';
import type { Theme } from '@awdlab/jig-themes';

/**
 * Reactively reads the currently active theme (which may be switched at runtime via
 * `ThemeService`), falling back to the configured preset. Reading it inside a `computed`
 * tracks `ThemeService.activeTheme`, so derived kind/color lists update on a theme switch.
 */
function injectActiveTheme(): Signal<Theme | null | undefined> {
  const themeService = inject(ThemeService, { optional: true });
  const config = inject(JIG_CONFIG);
  // Only fall back to the configured preset when there is no `ThemeService`. When the service is
  // present, `activeTheme()` — including its valid `null` (cleared) state — is authoritative and
  // must be preserved rather than reintroducing the preset.
  return computed(() => (themeService ? themeService.activeTheme() : config.theme.preset));
}

/** The app's list for a control when it configured one, else the active theme's. */
function effectiveKinds(
  config: JigConfig,
  theme: Theme | null | undefined,
  controlName: string
): readonly string[] {
  return config.theme.kinds?.[controlName] ?? theme?.meta.kinds?.[controlName] ?? [];
}

/** The app's colors when it configured any, else the active theme's. */
function effectiveColors(config: JigConfig, theme: Theme | null | undefined): readonly string[] {
  return config.theme.colors ?? theme?.meta.colors ?? [];
}

const warnedDefaults = new Set<string>();

/** Drops a default the effective list no longer offers, warning once per control and value. */
function resolveDefault<V extends string>(
  value: V | undefined,
  available: readonly string[],
  axis: 'kind' | 'color',
  controlName: string
): V | undefined {
  if (value === undefined || available.includes(value)) {
    return value;
  }
  const key = `${controlName}:${axis}:${value}`;
  if (!warnedDefaults.has(key)) {
    warnedDefaults.add(key);
    Logger.warn(
      `The default ${axis} "${value}" for control "${controlName}" is not among its available ${axis}s. Falling back to the first available ${axis}.`
    );
  }
  return undefined;
}

/**
 * Retrieves the available kinds for a given control, as a reactive signal that updates when the
 * active theme changes. The app's configured kinds win over the theme's. Does **not** return
 * custom kinds defined by the user in `JigCustomTypes`.
 * @param controlName The name of the control to get kinds for.
 * @returns A signal of the available kinds for the specified control.
 */
export function injectThemeControlKinds<T extends string>(controlName: T): Signal<CustomKind<T>[]> {
  const activeTheme = injectActiveTheme();
  const config = inject(JIG_CONFIG);
  return computed(() => effectiveKinds(config, activeTheme(), controlName) as CustomKind<T>[]);
}

/**
 * Reads the per-control default `color`/`kind` — the app's configured defaults when it set any,
 * else the active theme's `meta.defaults` — as a reactive signal. Empty object when none is
 * configured; callers then fall back to the positional (first-array-entry) default. A default
 * `kind` or `color` that is not in the effective list is dropped, so removing the theme's default
 * falls back to the first remaining value instead of emitting one the app banned.
 * @param controlName The name of the control to get defaults for.
 */
export function injectThemeControlDefaults<T extends string>(
  controlName: T
): Signal<{ color?: CustomColor; kind?: CustomKind<T> }> {
  const activeTheme = injectActiveTheme();
  const config = inject(JIG_CONFIG);
  return computed(() => {
    const theme = activeTheme();
    const defaults = (config.theme.defaults?.[controlName] ??
      theme?.meta.defaults?.[controlName] ??
      {}) as { color?: CustomColor; kind?: CustomKind<T> };
    return {
      ...defaults,
      kind: resolveDefault(
        defaults.kind as string | undefined,
        effectiveKinds(config, theme, controlName),
        'kind',
        controlName
      ) as CustomKind<T> | undefined,
      color: resolveDefault(
        defaults.color as string | undefined,
        effectiveColors(config, theme),
        'color',
        controlName
      ) as CustomColor | undefined,
    };
  });
}

/**
 * Retrieves the available colors — the app's configured colors when it set any, else the active
 * theme's — as a reactive signal. Does **not** return custom colors defined by the user in
 * `JigCustomTypes`.
 * @param controlName Restricts the result to controls whose theme part is recolorable.
 * @returns A signal of the available colors.
 */
export function injectThemeColors(controlName?: string): Signal<CustomColor[]> {
  const activeTheme = injectActiveTheme();
  const config = inject(JIG_CONFIG);
  return computed(() => {
    const theme = activeTheme();
    if (controlName) {
      const classNames = theme?.parts.find(x => x.scope === controlName)?.controlTemplate
        ?.classNames;
      if (!classNames?.includes('color-*')) {
        return [];
      }
    }
    return effectiveColors(config, theme) as CustomColor[];
  });
}
