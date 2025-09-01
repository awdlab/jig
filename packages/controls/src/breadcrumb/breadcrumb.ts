import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { injectThemeTemplate, NgnTemplate } from '@ngneers/controls/api/ng';
import { IconType } from '@ngneers/controls/custom-types';
import { NgnIcon } from '@ngneers/controls/icon';
import { NgnItemView } from '@ngneers/controls/item-view';
import { NgnMenu } from '@ngneers/controls/menu';
import { breadcrumbControlTemplate } from '@ngneers/controls-themes/templates/breadcrumb';

import { BreadcrumbTemplates } from './breadcrumb-templates';
import { BreadcrumbItem } from './types';

/**
 * @category control
 */
@Component({
  selector: 'ngn-breadcrumb',
  templateUrl: './breadcrumb.html',
  imports: [NgClass, RouterLink, NgTemplateOutlet, NgnTemplate, NgnIcon, NgnItemView, NgnMenu],
  host: {
    '[class]': 'theme.class()',
  },
})
export class NgnBreadcrumb extends BreadcrumbTemplates {
  protected readonly theme = injectThemeTemplate(breadcrumbControlTemplate);

  public readonly items = input.required<BreadcrumbItem[]>();
  public readonly iconItemSeparator = input<IconType>();
  public readonly iconOverflow = input<IconType>();
}
