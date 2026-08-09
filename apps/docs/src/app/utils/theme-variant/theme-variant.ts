import { inject, Pipe, type PipeTransform } from '@angular/core';
import { ThemeService } from '@awdlab/jig/api/ng';

import type { CustomColor } from '@awdlab/jig-custom-types';

/**
 * Theme-portable color helper for the docs app.
 *
 * All themes share the same button-kind vocabulary (`primary | secondary | link | text | icon`),
 * so kinds need no translation — demos pass the kind literally.
 *
 * Colors differ per theme, and some accents only make sense in one theme. Example: a delete
 * button should carry the `destructive` color under Shade but NO special color under Nova (its
 * default). Pass a per-theme map keyed by theme name; the active theme's entry is returned, or
 * `undefined` (the control's default color) when the active theme has no entry.
 *
 * Two usage forms:
 *   themeColor({ Shade: 'destructive' })                 // Shade → destructive, others → default
 *   [color]="{ Shade: 'destructive' } | themeColor"      // template form
 *
 * Values are plain strings (not `CustomColor`): a theme-specific color like shade's `destructive`
 * is intentionally outside the canonical (nova) `CustomColor` union. The result is cast back to
 * `CustomColor` for the consuming `[color]` input — the active theme validates it at runtime.
 */
export type PerThemeColor = Partial<Record<string, string>>;

function resolve(
  theme: ThemeService,
  perTheme: PerThemeColor | undefined
): CustomColor | undefined {
  if (perTheme == null) {
    return undefined;
  }
  const name = theme.activeTheme()?.name;
  return name != null ? (perTheme[name] as CustomColor | undefined) : undefined;
}

/**
 * Resolve a theme-specific color, or `undefined` when the active theme has no override. Must run
 * in an injection context (component field initializer / constructor) — use for
 * `JigActionButtonConfig` arrays etc.
 */
export function themeColor(perTheme: PerThemeColor): CustomColor | undefined {
  return resolve(inject(ThemeService), perTheme);
}

/** `[color]="{ Shade: 'destructive' } | themeColor"` — theme-specific color, else default. */
@Pipe({ name: 'themeColor', pure: false })
export class ThemeColorPipe implements PipeTransform {
  private readonly _theme = inject(ThemeService);

  public transform(perTheme: PerThemeColor | undefined): CustomColor | undefined {
    return resolve(this._theme, perTheme);
  }
}
