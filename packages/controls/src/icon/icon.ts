import { NgTemplateOutlet } from '@angular/common';
import {
  afterRenderEffect,
  Component,
  computed,
  inject,
  input,
  TemplateRef,
  viewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgnTemplate, templateTypesFn } from '@ngneers/controls/api/ng';
import { NgnBase, provideSelf, NgnPt } from '@ngneers/controls/base';
import { NgnError } from '@ngneers/controls/utils';
import { asyncComputed } from '@ngneers/controls/utils-ng';
import { IconType } from '@ngneers/controls-custom-types';
import { iconControlTemplate } from '@ngneers/controls-themes/templates/icon';

import { DEFAULT_ICONS } from './default-icons/ts';
import { GlobalIconTemplate } from './global-icon-template';
import { DefaultIcon, IconTemplateContext } from './types';

/**
 * @category control
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-icon',
  templateUrl: './icon.html',
  imports: [NgnPt, NgTemplateOutlet, NgnTemplate],
  providers: [provideSelf(NgnIcon)],
  host: {
    ngSkipHydration: 'true',
  },
})
export class NgnIcon extends NgnBase<'icon'> {
  protected readonly theme = this.injectThemeTemplate(iconControlTemplate, 'root');
  private readonly _globalIconTemplate = inject(GlobalIconTemplate).globalIconTemplate;
  private readonly _sanitizer = inject(DomSanitizer);

  public readonly defaultIcon = input<DefaultIcon>();
  public readonly icon = input<IconType>();

  protected readonly templateType = templateTypesFn<IconTemplateContext>();

  protected readonly defaultIconSvg = asyncComputed(async () => {
    const defaultIconKey = this.defaultIcon();
    if (!defaultIconKey) {
      return null;
    }
    const svg = DEFAULT_ICONS[defaultIconKey];
    return this._sanitizer.bypassSecurityTrustHtml(await svg()); // This is safe as we control the SVG content
  }, null);

  private readonly _defaultIconTemplate =
    viewChild.required<TemplateRef<IconTemplateContext>>('defaultIconTemplate');

  protected readonly usedIconTemplate = computed(() => {
    const globalTemplate = this._globalIconTemplate();
    if (globalTemplate) {
      return globalTemplate;
    }
    return this._defaultIconTemplate();
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
