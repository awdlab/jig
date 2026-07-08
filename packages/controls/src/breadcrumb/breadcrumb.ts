import { NgTemplateOutlet } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgnTemplate } from '@ngneers/controls/api/ng';
import { NgnPt, provideSelf } from '@ngneers/controls/base';
import { NgnIcon } from '@ngneers/controls/icon';
import { NgnItemView } from '@ngneers/controls/item-view';
import { NgnMenu } from '@ngneers/controls/menu';
import { maybeCallback } from '@ngneers/controls/utils';
import { breadcrumbControlTemplate } from '@ngneers/controls-themes/templates/breadcrumb';

import { BreadcrumbTemplates } from './breadcrumb-templates';

import type { BreadcrumbItem } from './types';
import type { IconType } from '@ngneers/controls-custom-types';

/**
 * @category control
 */
@Component({
  selector: 'ngn-breadcrumb',
  templateUrl: './breadcrumb.html',
  imports: [NgnPt, RouterLink, NgTemplateOutlet, NgnTemplate, NgnIcon, NgnItemView, NgnMenu],

  providers: [provideSelf(NgnBreadcrumb)],
})
export class NgnBreadcrumb extends BreadcrumbTemplates {
  protected readonly theme = this.injectThemeTemplate(breadcrumbControlTemplate, 'root');

  /**
   * The breadcrumb entries to render, ordered from root to the current page.
   * @see {@link BreadcrumbItem}
   */
  public readonly items = input.required<BreadcrumbItem[]>();
  /**
   * Icon rendered between adjacent breadcrumb items.
   * Falls back to the theme's default separator icon when unset.
   */
  public readonly iconItemSeparator = input<IconType>();
  /**
   * Icon for the overflow menu trigger shown when items are collapsed to save space.
   * Falls back to the theme's default overflow icon when unset.
   */
  public readonly iconOverflow = input<IconType>();

  protected readonly maybeCallback = maybeCallback;
}
