import { NgTemplateOutlet } from '@angular/common';
import {
  afterRenderEffect,
  Component,
  computed,
  inject,
  input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';
import { NgnBase, provideSelf, NgnPt } from '@ngneers/controls/base';
import { NgnError } from '@ngneers/controls/utils';
import { iconControlTemplate } from '@ngneers/controls-themes/templates/icon';

import { GlobalIconTemplate } from './global-icon-template';
import { NGN_CUSTOM_ICONS, NGN_ICON_REGISTRY } from './icon-registry';

import type { NgnIconEntry, NgnIconKey, NgnIconRegistry } from './icon-registry';
import type { IconifyIcon } from '@iconify/types';
import type { IconType } from '@ngneers/controls-custom-types';

function generateIconSvg(sanitizer: DomSanitizer, iconData: IconifyIcon, scale: number): SafeHtml {
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
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  public readonly defaultIcon = input<NgnIconKey>();
  public readonly icon = input<IconType>();

  protected readonly iconSvg = computed(() => {
    const value = this.icon();
    if (!value || typeof value !== 'object') return null;

    let iconData: IconifyIcon;
    let scale = 1;

    if ('body' in value) {
      iconData = value as IconifyIcon;
    } else if ('icon' in value && typeof value.icon === 'object' && 'body' in value.icon) {
      const entry = value as NgnIconEntry;
      iconData = entry.icon;
      scale = entry.scale ?? 1;
    } else {
      return null;
    }

    return generateIconSvg(this._sanitizer, iconData, scale);
  });

  protected readonly defaultIconSvg = computed(() => {
    const key = this.defaultIcon();
    if (!key || this._isCustom) return null;
    if (!this._registry) {
      throw new NgnError(
        'icon',
        'No icon registry provided. Call provideNgnDefaultIcons() or provideNgnCustomIcons() in your application providers.'
      );
    }
    const raw = (this._registry as NgnIconRegistry)[key];
    const entry: NgnIconEntry =
      'body' in raw ? { icon: raw as IconifyIcon, scale: 1 } : (raw as NgnIconEntry);

    return generateIconSvg(this._sanitizer, entry.icon, entry.scale ?? 1);
  });

  protected readonly customDefaultIcon = computed(() => {
    const key = this.defaultIcon();
    if (!key || !this._isCustom) return null;
    if (!this._registry) {
      throw new NgnError(
        'icon',
        'No icon registry provided. Call provideNgnDefaultIcons() or provideNgnCustomIcons() in your application providers.'
      );
    }
    return this._registry[key] as IconType;
  });

  protected readonly iconTemplate = computed(() => {
    const template = this._globalIconTemplate();
    if (!template) {
      throw new NgnError(
        'icon',
        'No GlobalIconTemplate registered. Required when using [icon] with non-Iconify values or provideNgnCustomIcons() with [defaultIcon]. If using Iconify, pass an IconifyIcon data object (e.g., import tablerUser from "@iconify/icons-tabler/user").'
      );
    }
    return template;
  });

  constructor() {
    super();
    afterRenderEffect(() => {
      if (!this.icon() && !this.defaultIcon()) {
        throw new NgnError(
          'icon',
          'Icon component requires either an icon or a default icon to be set.'
        );
      }
    });
  }
}
