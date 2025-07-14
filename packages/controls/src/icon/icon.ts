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
import { IconType } from '@ngneers/controls/custom-types';
import { NgnError } from '@ngneers/controls/utils';

import { GlobalIconTemplate } from './global-icon-template';

@Component({
  selector: 'ngn-icon',
  templateUrl: './icon.html',
  imports: [NgTemplateOutlet],
  host: {
    '[attr.ngSkipHydration]': 'true',
  },
})
export class NgnIcon {
  private readonly _globalIconTemplate = inject(GlobalIconTemplate).globalIconTemplate;

  public readonly defaultIcon = input<string>();
  public readonly icon = input<IconType>();

  private readonly _defaultIconTemplate =
    viewChild.required<TemplateRef<{ $implicit: IconType }>>('defaultIconTemplate');

  protected readonly usedIconTemplate = computed(() => {
    const globalTemplate = this._globalIconTemplate();
    if (globalTemplate) {
      return globalTemplate;
    }
    return this._defaultIconTemplate();
  });

  constructor() {
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
