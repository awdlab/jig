import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, input, TemplateRef, viewChild } from '@angular/core';
import { IconType } from '@ngneers/controls/custom-types';

import { GlobalIconTemplate } from './global-icon-template';
import { NgnTemplate } from '../api/template';

@Component({
  selector: 'ngn-icon',
  templateUrl: './icon.html',
  imports: [NgnTemplate, NgTemplateOutlet],
  host: {
    '[attr.ngSkipHydration]': 'true',
  },
})
export class Icon {
  private readonly _globalIconTemplate = inject(GlobalIconTemplate).globalIconTemplate;

  public readonly icon = input.required<IconType>();

  private readonly _defaultIconTemplate =
    viewChild.required<TemplateRef<unknown>>('defaultIconTemplate');

  protected readonly usedIconTemplate = computed(() => {
    const globalTemplate = this._globalIconTemplate();
    if (globalTemplate) {
      return globalTemplate;
    }
    return this._defaultIconTemplate();
  });
}
