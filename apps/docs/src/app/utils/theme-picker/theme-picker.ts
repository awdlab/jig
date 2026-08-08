import {
  Component,
  computed,
  DestroyRef,
  DOCUMENT,
  type EnvironmentProviders,
  inject,
  Injectable,
  provideAppInitializer,
  REQUEST,
  signal,
} from '@angular/core';
import { Platform, ThemeService } from '@ngneers/controls/api/ng';
import { NgnColorPicker } from '@ngneers/controls/color-picker';
import { NgnSelectButton } from '@ngneers/controls/select-button';
import { createTheme, createThemePart } from '@ngneers/controls-themes/api';
import { nova } from '@ngneers/controls-themes/nova';
import {
  colorsTemplate as novaColorsTemplate,
  coral,
  novaColorValues,
} from '@ngneers/controls-themes/nova/base';
import { createShadeColorPart, shade } from '@ngneers/controls-themes/shade';
import { zinc } from '@ngneers/controls-themes/shade/base';
import { material } from '@ngneers/controls-themes/material';
import {
  colorsTemplate as materialColorsTemplate,
  material as materialColorPart,
  materialColorValues,
} from '@ngneers/controls-themes/material/base';

import type { Theme } from '@ngneers/controls-themes';

export type ThemeOptionId = 'nova' | 'shade' | 'material';

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
  /** Surface (neutral) color choices; omitted for themes without a tintable surface palette. */
  surfaces?: readonly ThemeColorOption[];
};

/** A rendered swatch row (primary or surface) for the active theme. */
type SwatchGroup = {
  kind: 'primary' | 'surface';
  label: string;
  options: readonly ThemeColorOption[];
  selected: string | null;
  fallback: string;
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
    // Only hue/saturation of these feed nova's fixed neutral ramp.
    surfaces: [
      { name: 'Slate (default)', hex: null, swatch: '#64748b' },
      { name: 'Gray', hex: '#6b7280', swatch: '#6b7280' },
      { name: 'Zinc', hex: '#71717a', swatch: '#71717a' },
      { name: 'Stone', hex: '#78716c', swatch: '#78716c' },
      { name: 'Neutral', hex: '#737373', swatch: '#737373' },
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
  {
    id: 'material',
    label: 'Material',
    // Material primary swatches are restricted to hues that stay DARK at the
    // fixed L=50% ramp (getColorShade normalizes lightness, so only hue/sat
    // matter). Blue/indigo/violet/purple/pink read well both as a filled-button
    // background (white text) and as primary-colored text/links on a light
    // surface. Bright hues (teal, amber, cyan, green, yellow) fail both and are
    // deliberately omitted.
    colors: [
      { name: 'Indigo (default)', hex: null, swatch: '#3f51b5' },
      { name: 'Blue', hex: '#3d5afe', swatch: '#3d5afe' },
      { name: 'Deep Purple', hex: '#673ab7', swatch: '#673ab7' },
      { name: 'Violet', hex: '#7c3aed', swatch: '#7c3aed' },
      { name: 'Pink', hex: '#e91e63', swatch: '#e91e63' },
    ],
    surfaces: [
      { name: 'Grey (default)', hex: null, swatch: '#5f6368' },
      { name: 'Blue Grey', hex: '#607d8b', swatch: '#607d8b' },
      { name: 'Brown', hex: '#795548', swatch: '#795548' },
    ],
  },
];

function buildNovaTheme(hex: string | null, surfaceHex: string | null): Theme {
  if (hex == null && surfaceHex == null) {
    return nova;
  }
  const colorPart = createThemePart({
    scope: 'color',
    variables: [novaColorsTemplate],
    root: { values: novaColorValues(hex, false, surfaceHex) },
    dark: { values: novaColorValues(hex, true, surfaceHex) },
  });
  // Keep the theme NAME stable — the themeColor helper keys off it.
  return createTheme(
    nova.name,
    nova.parts.map(part => (part === coral ? colorPart : part)),
    nova.meta
  );
}

function buildMaterialTheme(hex: string | null, surfaceHex: string | null): Theme {
  if (hex == null && surfaceHex == null) {
    return material;
  }
  const colorPart = createThemePart({
    scope: 'color',
    variables: [materialColorsTemplate],
    root: { values: materialColorValues(hex, false, surfaceHex) },
    dark: { values: materialColorValues(hex, true, surfaceHex) },
  });
  return createTheme(
    material.name,
    material.parts.map(part => (part === materialColorPart ? colorPart : part)),
    material.meta
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
  /** Selected primary base color per theme; `null` = that theme's default. */
  colors: Record<ThemeOptionId, string | null>;
  /** Selected surface (neutral) base color per theme; `null` = that theme's default. */
  surfaces: Record<ThemeOptionId, string | null>;
};

function fallbackState(): PickerState {
  return {
    id: DEFAULT_THEME_ID,
    colors: { nova: null, shade: null, material: null },
    surfaces: { nova: null, shade: null, material: null },
  };
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
    const readColors = (raw: unknown, target: Record<ThemeOptionId, string | null>): void => {
      if (!raw || typeof raw !== 'object') {
        return;
      }
      const map = raw as Record<string, unknown>;
      for (const key of ['nova', 'shade', 'material'] as const) {
        const value = map[key];
        if (typeof value === 'string' || value === null) {
          target[key] = value ?? null;
        }
      }
    };
    readColors((parsed as { colors?: unknown })?.colors, state.colors);
    readColors((parsed as { surfaces?: unknown })?.surfaces, state.surfaces);
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
  if (state.id === 'nova') {
    return buildNovaTheme(hex, state.surfaces.nova);
  }
  if (state.id === 'material') {
    return buildMaterialTheme(hex, state.surfaces.material);
  }
  return buildShadeTheme(hex);
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

  private readonly _surfaceByTheme = signal<Record<ThemeOptionId, string | null>>({
    ...this._initial.surfaces,
  });

  public readonly activeOption = computed(
    () => this.themes.find(t => t.id === this.themeId()) ?? this.themes[0]!
  );

  public readonly selectedColor = computed(() => this._colorByTheme()[this.themeId()]);

  public readonly selectedSurface = computed(() => this._surfaceByTheme()[this.themeId()]);

  /**
   * The swatch rows to render, driven by the active theme: always a `primary` row, plus a
   * `surface` row for themes that expose a tintable neutral palette. `selected` is read here so
   * the row stays reactive; `fallback` seeds the custom-color input.
   */
  public readonly swatchGroups = computed(() => {
    const option = this.activeOption();
    const groups: SwatchGroup[] = [
      {
        kind: 'primary',
        label: 'Primary',
        options: option.colors,
        selected: this.selectedColor(),
        fallback: '#4557ba',
      },
    ];
    if (option.surfaces) {
      groups.push({
        kind: 'surface',
        label: 'Surface',
        options: option.surfaces,
        selected: this.selectedSurface(),
        fallback: '#475569',
      });
    }
    return groups;
  });

  public select(kind: 'primary' | 'surface', hex: string | null): void {
    if (kind === 'primary') {
      this.selectColor(hex);
    } else {
      this.selectSurface(hex);
    }
  }

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

  public selectSurface(hex: string | null): void {
    this._surfaceByTheme.update(surfaces => ({ ...surfaces, [this.themeId()]: hex }));
    this._apply();
    this._persist();
  }

  private _apply(): void {
    const hex = this.selectedColor();
    let theme: Theme;
    if (this.themeId() === 'nova') {
      theme = buildNovaTheme(hex, this.selectedSurface());
    } else if (this.themeId() === 'material') {
      theme = buildMaterialTheme(hex, this.selectedSurface());
    } else {
      theme = buildShadeTheme(hex);
    }
    this._themeService.activeTheme.set(theme);
  }

  private _persist(): void {
    if (!this._platform.isBrowser) {
      return;
    }
    const state: PickerState = {
      id: this.themeId(),
      colors: this._colorByTheme(),
      surfaces: this._surfaceByTheme(),
    };
    const value = encodeURIComponent(JSON.stringify(state));
    this._document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
  }
}

@Component({
  selector: 'ngn-docs-theme-picker',
  imports: [NgnSelectButton, NgnColorPicker],
  template: `
    <div class="flex flex-col gap-(--ngn-size-padding-xl)">
      <ngn-select-button
        aria-label="Theme"
        [options]="themeOptions"
        [value]="picker.themeId()"
        (valueChange)="picker.selectTheme($event)"
      />

      @for (group of picker.swatchGroups(); track group.kind) {
        <div class="flex flex-col gap-(--ngn-size-padding-sm)">
          <span class="text-xs font-medium text-(--ngn-color-surface-600)">{{ group.label }}</span>
          <div
            class="flex flex-wrap items-center gap-(--ngn-size-padding-sm)"
            role="group"
            [attr.aria-label]="group.label + ' color'"
          >
            @for (color of group.options; track color.name) {
              <button
                type="button"
                class="size-8 cursor-pointer rounded-(--ngn-size-rounded-md) border-2 transition-transform hover:scale-110"
                [style.background-color]="color.swatch"
                [style.border-color]="
                  group.selected === color.hex ? 'var(--ngn-color-text)' : 'var(--ngn-color-border)'
                "
                [attr.aria-label]="'Use ' + color.name"
                [attr.aria-pressed]="group.selected === color.hex"
                [attr.title]="color.name"
                (click)="picker.select(group.kind, color.hex)"
              ></button>
            }
            <!-- Custom color via our own color picker (opaque theme colors → hex, no alpha).
                 The picker emits valueChange on every drag frame; debounce so a drag coalesces
                 into one theme rebuild + cookie write instead of one per pointer move. -->
            <ngn-color-picker
              [alpha]="false"
              [value]="group.selected ?? group.fallback"
              [label]="'Custom ' + group.label + ' color'"
              (valueChange)="onCustomColor(group.kind, $event)"
            />
          </div>
        </div>
      }
    </div>
  `,
})
export class NgnDocsThemePicker {
  protected readonly picker = inject(ThemePickerService);

  protected readonly themeOptions = this.picker.themes.map(theme => ({
    label: theme.label,
    value: theme.id,
  }));

  private _customColorTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this._customColorTimer));
  }

  /** Trailing-debounced theme apply for the custom color picker's per-frame `valueChange`. */
  protected onCustomColor(kind: 'primary' | 'surface', hex: string): void {
    clearTimeout(this._customColorTimer);
    this._customColorTimer = setTimeout(() => this.picker.select(kind, hex), 60);
  }
}
