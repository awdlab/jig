import { computed, contentChild, Directive, input, TemplateRef, viewChild } from '@angular/core';
import { templateTypesFn } from '@awdlab/jig/api/ng';
import { NgnBase } from '@awdlab/jig/base';

import type { HeaderTemplateType } from './types';

@Directive()
export abstract class DrawerTemplates extends NgnBase<'drawer'> {
  // Header template
  private readonly _defaultHeaderTemplate =
    viewChild.required<TemplateRef<typeof this.templateTypes.header>>('defaultHeaderTemplate');
  private readonly _userHeaderTemplate =
    contentChild<TemplateRef<typeof this.templateTypes.header>>('header');
  /**
   * Set a custom template for the header.
   * Can also be set using an `<ng-template>` element with `#header` template reference variable.
   */
  public readonly templateHeader = input<TemplateRef<typeof this.templateTypes.header> | null>(
    null
  );
  protected readonly headerTemplate = computed(
    () => this._userHeaderTemplate() ?? this.templateHeader() ?? this._defaultHeaderTemplate()
  );

  // Footer template
  private readonly _userFooterTemplate = contentChild<TemplateRef<unknown>>('footer');
  /**
   * Set a custom template for the footer.
   * Can also be set using an `<ng-template>` element with `#footer` template reference variable.
   */
  public readonly templateFooter = input<TemplateRef<unknown> | null>(null);
  protected readonly footerTemplate = computed(
    () => this._userFooterTemplate() ?? this.templateFooter()
  );

  // Content template
  private readonly _userContentTemplate = contentChild<TemplateRef<unknown>>('content');
  /**
   * Set a custom template for the content.
   * Can also be set using an `<ng-template>` element with `#content` template reference variable.
   */
  public readonly content = input<TemplateRef<unknown> | null>(null);
  protected readonly contentTemplate = computed(
    () => this._userContentTemplate() ?? this.content()
  );

  /**
   * Types for the drawer templates.
   */
  public readonly templateTypes = templateTypesFn<{
    /**
     * Type of the template variable for the header template.
     */
    header: HeaderTemplateType;
  }>();
}
