import { NgTemplateOutlet } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AwdTemplate } from '@awdlab/jig/api/ng';
import { AwdPt, provideSelf } from '@awdlab/jig/base';
import { I18n } from '@awdlab/jig/i18n';
import { AwdIcon } from '@awdlab/jig/icon';
import { JigItemView } from '@awdlab/jig/item-view';
import { AwdMenu } from '@awdlab/jig/menu';
import { maybeCallback } from '@awdlab/jig/utils';
import { breadcrumbControlTemplate } from '@awdlab/jig-themes/templates/breadcrumb';

import { BreadcrumbTemplates } from './breadcrumb-templates';

import type { BreadcrumbItem } from './types';
import type { IconType } from '@awdlab/jig-custom-types';

/**
 * @category control
 */
@Component({
  selector: 'jig-breadcrumb',
  templateUrl: './breadcrumb.html',
  imports: [AwdPt, RouterLink, NgTemplateOutlet, AwdTemplate, AwdIcon, JigItemView, AwdMenu],

  providers: [provideSelf(AwdBreadcrumb)],
})
export class AwdBreadcrumb extends BreadcrumbTemplates {
  protected readonly theme = this.injectThemeTemplate(breadcrumbControlTemplate, 'root');
  protected readonly i18n = inject(I18n).translations;

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
