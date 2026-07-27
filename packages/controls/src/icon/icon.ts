import { NgTemplateOutlet } from '@angular/common';
import { afterRenderEffect, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';
import { NgnBase, provideSelf, NgnPt } from '@ngneers/controls/base';
import { Logger, NgnError } from '@ngneers/controls/utils';
import { iconControlTemplate } from '@ngneers/controls-themes/templates/icon';

import { GlobalIconTemplate } from './global-icon-template';
import { NGN_CUSTOM_ICONS, NGN_ICON_REGISTRY } from './icon-registry';

import type { NgnIconEntry, NgnIconKey, NgnIconRegistry } from './icon-registry';
import type { IconifyIcon } from '@iconify/types';
import type { IconType } from '@ngneers/controls-custom-types';

/**
 * CJS icon modules (e.g. `@iconify/icons-tabler/*`) bind as `{ __esModule, default: <data> }`
 * under Node ESM interop; unwrap to the real Iconify data so `.body` is readable.
 */
function unwrapIcon<T>(mod: T): T {
  return mod && typeof mod === 'object' && 'default' in mod ? (mod as { default: T }).default : mod;
}

function generateIconSvg(
  sanitizer: DomSanitizer,
  iconData: IconifyIcon,
  scale: number
): SafeHtml | null {
  iconData = unwrapIcon(iconData);
  if (typeof iconData?.body !== 'string') {
    Logger.error(
      new NgnError(
        'icon',
        'Icon data has no string "body". If importing from a CommonJS icon package, the module default may need unwrapping.',
        iconData
      )
    );
    return null;
  }

  // Note: @iconify/types documents default as 16, but we default to 24 to match Tabler.
  // All Tabler icons provide explicit dimensions, so this fallback rarely triggers.
  const width = iconData.width ?? 24;
  const height = iconData.height ?? 24;

  const insetX = scale === 1 ? 0 : ((scale - 1) / scale) * (width / 2);
  const insetY = scale === 1 ? 0 : ((scale - 1) / scale) * (height / 2);
  const vbX = insetX;
  const vbY = insetY;
  const vbW = width - insetX * 2;
  const vbH = height - insetY * 2;

  return sanitizer.bypassSecurityTrustHtml(
    `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="${vbX} ${vbY} ${vbW} ${vbH}">${iconData.body}</svg>`
  );
}

/**
 * @category control
 */
@Component({
  selector: 'ngn-icon',
  templateUrl: './icon.html',
  imports: [NgnPt, NgTemplateOutlet],
  providers: [provideSelf(NgnIcon)],
  host: {
    ngSkipHydration: 'true',
  },
})
export class NgnIcon extends NgnBase<'icon'> {
  protected readonly theme = this.injectThemeTemplate(iconControlTemplate, 'root');
  private readonly _globalIconTemplate = inject(GlobalIconTemplate).globalIconTemplate;
  private readonly _sanitizer = inject(DomSanitizer);
  private readonly _registry = inject(NGN_ICON_REGISTRY, { optional: true });
  private readonly _isCustom = inject(NGN_CUSTOM_ICONS, { optional: true }) ?? false;

  /**
   * A key into the registered icon set (from `withDefaultIcons()` or `withCustomIcons()`).
   * Used as a fallback when {@link icon} is not provided; requires an icon registry.
   * @default undefined
   */
  public readonly defaultIcon = input<NgnIconKey>();
  /**
   * The icon to render. Accepts an Iconify data object, a registered icon entry, or a
   * custom value resolved via the {@link GlobalIconTemplate}. Takes precedence over {@link defaultIcon}.
   * @default undefined
   */
  public readonly icon = input<IconType>();

  protected readonly iconSvg = computed(() => {
    const value = unwrapIcon(this.icon());
    if (!value || typeof value !== 'object') return null;

    let iconData: IconifyIcon;
    let scale = 1;

    if ('body' in value) {
      iconData = value as IconifyIcon;
    } else if (
      'icon' in value &&
      typeof value.icon === 'object' &&
      'body' in unwrapIcon(value.icon)
    ) {
      const entry = value as NgnIconEntry;
      iconData = unwrapIcon(entry.icon);
      scale = entry.scale ?? 1;
    } else {
      return null;
    }

    return generateIconSvg(this._sanitizer, iconData, scale);
  });

  protected readonly defaultIconSvg = computed(() => {
    const key = this.defaultIcon();
    if (!key || this._isCustom || !this._registry) return null;
    const raw = unwrapIcon((this._registry as NgnIconRegistry)[key]);
    const entry: NgnIconEntry =
      'body' in raw ? { icon: raw as IconifyIcon, scale: 1 } : (raw as NgnIconEntry);

    return generateIconSvg(this._sanitizer, unwrapIcon(entry.icon), entry.scale ?? 1);
  });

  protected readonly customDefaultIcon = computed(() => {
    const key = this.defaultIcon();
    if (!key || !this._isCustom || !this._registry) return null;
    return this._registry[key] as IconType;
  });

  protected readonly iconTemplate = computed(() => this._globalIconTemplate());

  constructor() {
    super();
    // Invariant checks live here — NOT inside the computeds above.
    // Throwing inside a computed() is swallowed by Angular's reactive graph:
    // producerRecomputeValue caches the error and only re-throws on a direct
    // getter read, so a recompute during change-detection producer polling
    // runs the body (firing the NgnError constructor's fancy log) without ever
    // surfacing the error. afterRenderEffect throws surface reliably.
    afterRenderEffect(() => {
      const icon = this.icon();
      const defaultIcon = this.defaultIcon();

      if (!icon && !defaultIcon) {
        throw new NgnError(
          'icon',
          'Icon component requires either an icon or a default icon to be set.'
        );
      }

      if (defaultIcon && !this._registry) {
        throw new NgnError(
          'icon',
          'No icon registry provided. Add withDefaultIcons() or withCustomIcons() to your provideNgnControls() call.'
        );
      }

      // The template path is used for non-Iconify [icon] values and for custom
      // default icons; both require a registered GlobalIconTemplate.
      const needsTemplate = (!!icon && !this.iconSvg()) || !!this.customDefaultIcon();
      if (needsTemplate && !this._globalIconTemplate()) {
        throw new NgnError(
          'icon',
          'No GlobalIconTemplate registered. Required when using [icon] with non-Iconify values or withCustomIcons() with [defaultIcon]. If using Iconify, pass an IconifyIcon data object (e.g., import tablerUser from "@iconify/icons-tabler/user").'
        );
      }
    });
  }
}
