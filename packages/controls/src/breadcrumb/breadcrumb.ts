import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { JigTemplate } from '@awdlab/jig/api/ng';
import { JigPt, provideSelf } from '@awdlab/jig/base';
import { I18n } from '@awdlab/jig/i18n';
import { JigIcon } from '@awdlab/jig/icon';
import { JigItemView } from '@awdlab/jig/item-view';
import { JigMenu } from '@awdlab/jig/menu';
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
  imports: [JigPt, RouterLink, NgTemplateOutlet, JigTemplate, JigIcon, JigItemView, JigMenu],

  providers: [provideSelf(JigBreadcrumb)],
  host: {
    role: 'navigation',
    '[attr.aria-label]': 'labelledBy() ? null : (label() ?? i18n["breadcrumb_label"]())',
    '[attr.aria-labelledby]': 'labelledBy()',
  },
})
export class JigBreadcrumb extends BreadcrumbTemplates {
  protected readonly theme = this.injectThemeTemplate(breadcrumbControlTemplate, 'root');
  protected readonly i18n = inject(I18n).translations;

  /**
   * The breadcrumb entries to render, ordered from root to the current page.
   * @see {@link BreadcrumbItem}
   */
  public readonly items = input.required<BreadcrumbItem[]>();
  /**
   * Accessible name for the breadcrumb landmark. Ignored when {@link labelledBy}
   * is set.
   * @default the translated "Breadcrumb"
   */
  public readonly label = input<string | null>(null);
  /**
   * Id of an element naming the breadcrumb landmark. Takes precedence over
   * {@link label}.
   * @default null
   */
  public readonly labelledBy = input<string | null>(null);
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

  /** The last entry is the current page: it is marked `aria-current` and never rendered as a link. */
  protected readonly currentId = computed(() => this.items().at(-1)?.id);

  protected readonly maybeCallback = maybeCallback;
}
