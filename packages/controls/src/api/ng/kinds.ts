import { computed, inject, type Signal } from '@angular/core';

import { JIG_CONFIG } from './config';
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

/**
 * Retrieves the available kinds for a given control from the active theme, as a reactive signal
 * that updates when the active theme changes. Does **not** return custom kinds defined by the
 * user in `JigCustomTypes`.
 * @param controlName The name of the control to get kinds for.
 * @returns A signal of the available kinds for the specified control.
 */
export function injectThemeControlKinds<T extends string>(controlName: T): Signal<CustomKind<T>[]> {
  const activeTheme = injectActiveTheme();
  return computed(() => (activeTheme()?.meta.kinds?.[controlName] ?? []) as CustomKind<T>[]);
}

/**
 * Retrieves the available colors from the active theme, as a reactive signal that updates when
 * the active theme changes. Does **not** return custom colors defined by the user in
 * `JigCustomTypes`.
 * @returns A signal of the available colors.
 */
/**
 * Reads the explicit per-control default `color`/`kind` from the active theme's
 * `meta.defaults`, as a reactive signal. Empty object when none is configured —
 * callers then fall back to the positional (first-array-entry) default.
 * @param controlName The name of the control to get defaults for.
 */
export function injectThemeControlDefaults<T extends string>(
  controlName: T
): Signal<{ color?: CustomColor; kind?: CustomKind<T> }> {
  const activeTheme = injectActiveTheme();
  return computed(
    () =>
      (activeTheme()?.meta.defaults?.[controlName] ?? {}) as {
        color?: CustomColor;
        kind?: CustomKind<T>;
      }
  );
}

export function injectThemeColors(controlName?: string): Signal<CustomColor[]> {
  const activeTheme = injectActiveTheme();
  return computed(() => {
    const theme = activeTheme();
    if (controlName) {
      const classNames = theme?.parts.find(x => x.scope === controlName)?.controlTemplate
        ?.classNames;
      if (!classNames?.includes('color-*')) {
        return [];
      }
    }
    return (theme?.meta.colors ?? []) as CustomColor[];
  });
}
