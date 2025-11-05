import { NgTemplateOutlet } from '@angular/common';
import {
  afterRenderEffect,
  Component,
  computed,
  effect,
  inject,
  input,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { NgnTemplate, templateTypesFn } from '@ngneers/controls/api/ng';
import { NgnBase, provideSelf } from '@ngneers/controls/base';
import { NgnError } from '@ngneers/controls/utils';
import { IconType } from '@ngneers/controls-custom-types';
import { iconControlTemplate } from '@ngneers/controls-themes/templates/icon';

import { GlobalIconTemplate } from './global-icon-template';
import { IconTemplateContext } from './types';

/**
 * @category control
 */
@Component({
  selector: 'ngn-icon',
  templateUrl: './icon.html',
  imports: [NgTemplateOutlet, NgnTemplate],
  providers: [provideSelf(NgnIcon)],
  host: {
    ngSkipHydration: 'true',
    '[class]': 'theme.class()',
  },
})
export class NgnIcon extends NgnBase<'icon'> {
  protected readonly theme = this.injectThemeTemplate(iconControlTemplate);
  private readonly _globalIconTemplate = inject(GlobalIconTemplate).globalIconTemplate;

  public readonly defaultIcon = input<string>();
  public readonly icon = input<IconType>();
  public readonly size = input<string>();

  protected readonly templateType = templateTypesFn<IconTemplateContext>();

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

    effect(() => {
      const size = this.size();
      if (size) {
        this.element.nativeElement.style.setProperty('--icon-size', size);
      }
    });
  }
}
