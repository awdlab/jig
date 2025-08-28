import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { injectThemeTemplate, NgnTemplate } from '@ngneers/controls/api/ng';
import { IconType } from '@ngneers/controls/custom-types';
import { NgnIcon } from '@ngneers/controls/icon';
import { NgnItemView } from '@ngneers/controls/item-view';
import { breadcrumbControlTemplate } from '@ngneers/controls-themes/templates/breadcrumb';

import { BreadcrumbTemplates } from './breadcrumb-templates';
import { BreadcrumbItem } from './types';

/**
 * @category control
 */
@Component({
  selector: 'ngn-breadcrumb',
  templateUrl: './breadcrumb.html',
  imports: [NgClass, NgnTemplate, NgnIcon, NgnItemView],
  host: {
    '[class]': 'theme.class()',
  },
})
export class NgnBreadcrumb extends BreadcrumbTemplates {
  protected readonly theme = injectThemeTemplate(breadcrumbControlTemplate);

  public readonly items = input.required<BreadcrumbItem[]>();
  public readonly separatorIcon = input<IconType>();
}
