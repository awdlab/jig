import { NgTemplateOutlet } from '@angular/common';
import {
  afterRenderEffect,
  Component,
  computed,
  inject,
  input,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { NgnTemplate, templateTypeFn } from '@ngneers/controls/api';
import { NgnBase } from '@ngneers/controls/base';
import { IconType } from '@ngneers/controls/custom-types';
import { NgnError } from '@ngneers/controls/utils';

import { GlobalIconTemplate } from './global-icon-template';
import { IconTemplateContext } from './types';

@Component({
  selector: 'ngn-icon',
  templateUrl: './icon.html',
  imports: [NgTemplateOutlet, NgnTemplate],
  host: {
    '[attr.ngSkipHydration]': 'true',
  },
})
export class NgnIcon extends NgnBase {
  private readonly _globalIconTemplate = inject(GlobalIconTemplate).globalIconTemplate;

  public readonly defaultIcon = input<string>();
  public readonly icon = input<IconType>();
  public readonly size = input<string>('1rem');

  protected readonly templateType = templateTypeFn<IconTemplateContext['$implicit']>();

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
