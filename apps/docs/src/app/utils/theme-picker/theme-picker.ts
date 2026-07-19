import {
  Component,
  computed,
  DOCUMENT,
  type EnvironmentProviders,
  inject,
  Injectable,
  provideAppInitializer,
  REQUEST,
  signal,
} from '@angular/core';
import { Platform, ThemeService } from '@ngneers/controls/api/ng';
import { NgnSelectButton } from '@ngneers/controls/select-button';
import { createTheme, createThemePart } from '@ngneers/controls-themes/api';
import { novaCoral } from '@ngneers/controls-themes/nova';
import {
  colorsTemplate as novaColorsTemplate,
  coral,
  novaColorValues,
} from '@ngneers/controls-themes/nova/base';
import { createShadeColorPart, shade } from '@ngneers/controls-themes/shade';
import { zinc } from '@ngneers/controls-themes/shade/base';

import type { Theme } from '@ngneers/controls-themes';

export type ThemeOptionId = 'nova' | 'shade';

export type ThemeColorOption = {
  name: string;
  /** Base color fed to the theme's color factory; `null` = the theme's built-in default. */
  hex: string | null;
  /** What the swatch dot shows (differs from `hex` only for defaults). */
  swatch: string;
};

export type ThemeOption = {
  id: ThemeOptionId;
  label: string;
  colors: readonly ThemeColorOption[];
};

const THEME_OPTIONS: readonly ThemeOption[] = [
  {
    id: 'nova',
    label: 'Nova',
    colors: [
      { name: 'Ink (default)', hex: null, swatch: '#4557ba' },
      { name: 'Sky', hex: '#0da6f2', swatch: '#0da6f2' },
      { name: 'Teal', hex: '#14b8a6', swatch: '#14b8a6' },
      { name: 'Rose', hex: '#f43f5e', swatch: '#f43f5e' },
      { name: 'Amber', hex: '#f59e0b', swatch: '#f59e0b' },
    ],
  },
  {
    id: 'shade',
    label: 'Shade',
    colors: [
      { name: 'Zinc (default)', hex: null, swatch: '#71717a' },
      { name: 'Blue', hex: '#3b82f6', swatch: '#3b82f6' },
      { name: 'Green', hex: '#16a34a', swatch: '#16a34a' },
      { name: 'Rose', hex: '#e11d48', swatch: '#e11d48' },
      { name: 'Violet', hex: '#7c3aed', swatch: '#7c3aed' },
      { name: 'Orange', hex: '#f97316', swatch: '#f97316' },
    ],
  },
];

function buildNovaTheme(hex: string | null): Theme {
  if (hex == null) {
    return novaCoral;
  }
  const colorPart = createThemePart({
    scope: 'color',
    variables: [novaColorsTemplate],
    root: { values: novaColorValues(hex, false) },
    dark: { values: novaColorValues(hex, true) },
  });
  // Keep the theme NAME stable — the themeColor helper keys off it.
  return createTheme(
    novaCoral.name,
    novaCoral.parts.map(part => (part === coral ? colorPart : part)),
    novaCoral.meta
  );
}

function buildShadeTheme(hex: string | null): Theme {
  if (hex == null) {
    return shade;
  }
  return createTheme(
    shade.name,
    shade.parts.map(part => (part === zinc ? createShadeColorPart(hex) : part)),
    shade.meta
  );
}

/** Nova is the default when nothing valid is stored. */
const DEFAULT_THEME_ID: ThemeOptionId = 'nova';

/**
 * Persisted in a cookie (not localStorage) so the SSR server can read it from the request and
 * render the saved theme directly — no first-paint flash. 1-year expiry, lax same-site.
 */
const COOKIE_NAME = 'ngn-docs-theme';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

type PickerState = {
  id: ThemeOptionId;
  /** Selected base color per theme; `null` = that theme's default. */
  colors: Record<ThemeOptionId, string | null>;
};

function fallbackState(): PickerState {
  return { id: DEFAULT_THEME_ID, colors: { nova: null, shade: null } };
}

/** Extract a single cookie's value from a `Cookie` header / `document.cookie` string. */
function readCookie(cookieString: string | null, name: string): string | null {
  if (!cookieString) {
    return null;
  }
  for (const part of cookieString.split(';')) {
    const eq = part.indexOf('=');
    if (eq === -1) {
      continue;
    }
    if (part.slice(0, eq).trim() === name) {
      // A malformed percent-encoding in the (server-side, attacker-controllable) Cookie header
      // would otherwise throw a URIError and crash SSR before parseThemeState's try/catch runs.
      try {
        return decodeURIComponent(part.slice(eq + 1).trim());
      } catch {
        return null;
      }
    }
  }
  return null;
}

/**
 * Validate a stored cookie value into picker state. Any problem — missing, malformed, or an
 * unknown/removed theme id — falls back to the nova default.
 */
function parseThemeState(rawValue: string | null): PickerState {
  const state = fallbackState();
  if (!rawValue) {
    return state;
  }
  try {
    const parsed: unknown = JSON.parse(rawValue);
    const savedId = (parsed as { id?: unknown })?.id;
    if (THEME_OPTIONS.some(t => t.id === savedId)) {
      state.id = savedId as ThemeOptionId;
    }
    const savedColors = (parsed as { colors?: Record<string, unknown> })?.colors;
    if (savedColors && typeof savedColors === 'object') {
      for (const key of ['nova', 'shade'] as const) {
        const value = savedColors[key];
        if (typeof value === 'string' || value === null) {
          state.colors[key] = value ?? null;
        }
      }
    }
    return state;
  } catch {
    return fallbackState();
  }
}

/**
 * Read the persisted selection in the current DI context: from the request `Cookie` header on
 * the server, from `document.cookie` in the browser. Must run in an injection context.
 */
function resolveThemeStateFromContext(): PickerState {
  const cookieString = inject(Platform).isBrowser
    ? inject(DOCUMENT).cookie
    : (inject(REQUEST, { optional: true })?.headers.get('cookie') ?? null);
  return parseThemeState(readCookie(cookieString, COOKIE_NAME));
}

function buildThemeFromState(state: PickerState): Theme {
  const hex = state.colors[state.id];
  return state.id === 'nova' ? buildNovaTheme(hex) : buildShadeTheme(hex);
}

/**
 * The theme to boot with on the CLIENT, resolved from the persisted cookie (or nova) at
 * module-eval time so it can be the `provideNgnControls` preset. The client then STARTS in the
 * saved theme and hydrates the (already server-rendered) saved-theme DOM with no re-apply/flash.
 * On the server `document` is unavailable here — the server instead resolves the theme per
 * request via {@link provideDocsThemeInitializer}.
 */
export function resolveInitialTheme(): Theme {
  const cookieString = typeof document === 'undefined' ? null : document.cookie;
  return buildThemeFromState(parseThemeState(readCookie(cookieString, COOKIE_NAME)));
}

/**
 * Server-side per-request theme resolution: before the SSR render, reads the request `Cookie`
 * header and sets the active theme, so the server sends fully-themed HTML (colors AND control
 * styles) for the saved theme — flash-free on any network, no client JS dependency. Runs on the
 * server only; the client boots from {@link resolveInitialTheme} (the eval-time preset), which
 * already matches, so no client-side re-apply.
 */
export function provideDocsThemeInitializer(): EnvironmentProviders {
  return provideAppInitializer(() => {
    if (inject(Platform).isBrowser) {
      return;
    }
    const themeService = inject(ThemeService);
    themeService.activeTheme.set(buildThemeFromState(resolveThemeStateFromContext()));
  });
}

/**
 * Shared state for the docs theme picker — one instance backs every picker on the page
 * (topbar popover, start-page theming section), so they stay in sync. Seeded from the same
 * cookie the bootstrap initializer reads, so it never re-applies on load; subsequent user
 * selections update the theme and persist to the cookie.
 */
@Injectable({ providedIn: 'root' })
export class ThemePickerService {
  private readonly _themeService = inject(ThemeService);
  private readonly _platform = inject(Platform);
  private readonly _document = inject(DOCUMENT);

  private readonly _initial = resolveThemeStateFromContext();

  public readonly themes = THEME_OPTIONS;

  public readonly themeId = signal<ThemeOptionId>(this._initial.id);

  private readonly _colorByTheme = signal<Record<ThemeOptionId, string | null>>({
    ...this._initial.colors,
  });

  public readonly activeOption = computed(
    () => this.themes.find(t => t.id === this.themeId()) ?? this.themes[0]!
  );

  public readonly selectedColor = computed(() => this._colorByTheme()[this.themeId()]);

  public selectTheme(id: ThemeOptionId): void {
    if (this.themeId() === id) {
      return;
    }
    this.themeId.set(id);
    this._apply();
    this._persist();
  }

  public selectColor(hex: string | null): void {
    this._colorByTheme.update(colors => ({ ...colors, [this.themeId()]: hex }));
    this._apply();
    this._persist();
  }

  private _apply(): void {
    const hex = this.selectedColor();
    const theme = this.themeId() === 'nova' ? buildNovaTheme(hex) : buildShadeTheme(hex);
    this._themeService.activeTheme.set(theme);
  }

  private _persist(): void {
    if (!this._platform.isBrowser) {
      return;
    }
    const state: PickerState = { id: this.themeId(), colors: this._colorByTheme() };
    const value = encodeURIComponent(JSON.stringify(state));
    this._document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
  }
}

@Component({
  selector: 'ngn-docs-theme-picker',
  imports: [NgnSelectButton],
  template: `
    <div class="flex flex-col gap-(--ngn-size-padding-xl)">
      <ngn-select-button
        aria-label="Theme"
        [options]="themeOptions"
        [value]="picker.themeId()"
        (valueChange)="picker.selectTheme($event)"
      />

      <div
        class="flex flex-wrap items-center gap-(--ngn-size-padding-sm)"
        role="group"
        aria-label="Theme color"
      >
        @for (color of picker.activeOption().colors; track color.name) {
          <button
            type="button"
            class="h-7 w-7 cursor-pointer rounded-full border border-(--ngn-color-border) transition-transform hover:scale-110"
            [style.background-color]="color.swatch"
            [style.outline]="
              picker.selectedColor() === color.hex ? '2px solid var(--ngn-color-text)' : 'none'
            "
            [style.outline-offset.px]="2"
            [attr.aria-label]="'Use ' + color.name"
            [attr.aria-pressed]="picker.selectedColor() === color.hex"
            [attr.title]="color.name"
            (click)="picker.selectColor(color.hex)"
          ></button>
        }
        <label
          class="relative h-7 w-7 cursor-pointer overflow-hidden rounded-full border border-(--ngn-color-border) bg-[conic-gradient(red,yellow,lime,cyan,blue,magenta,red)] transition-transform hover:scale-110"
          title="Custom color"
        >
          <input
            type="color"
            class="absolute inset-0 cursor-pointer opacity-0"
            aria-label="Custom theme color"
            [value]="picker.selectedColor() ?? '#4557ba'"
            (change)="onCustomColor($event)"
          />
        </label>
      </div>
    </div>
  `,
})
export class NgnDocsThemePicker {
  protected readonly picker = inject(ThemePickerService);

  protected readonly themeOptions = this.picker.themes.map(theme => ({
    label: theme.label,
    value: theme.id,
  }));

  protected onCustomColor(event: Event): void {
    this.picker.selectColor((event.target as HTMLInputElement).value);
  }
}
