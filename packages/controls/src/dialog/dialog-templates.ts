import { computed, contentChild, Directive, input, TemplateRef, viewChild } from '@angular/core';
import { templateTypesFn } from '@ngneers/controls/api/ng';

@Directive()
export abstract class DialogTemplates {
  private readonly _userContentTemplate = contentChild<TemplateRef<unknown>>('content');
  /**
   * The required template for the content of the dialog.
   * Can also be set using an `<ng-template>` element with `#content` template reference variable.
   */
  public readonly templateContent = input<TemplateRef<unknown> | null>(null);
  protected readonly contentTemplate = computed(
    () => this._userContentTemplate() ?? this.templateContent()
  );

  private readonly _defaultHeaderTemplate =
    viewChild.required<TemplateRef<unknown>>('defaultHeaderTemplate');
  private readonly _userHeaderTemplate = contentChild<TemplateRef<unknown>>('header');
  /**
   * Set a custom template for the header of the dialog.
   * Can also be set using an `<ng-template>` element with `#header` template reference variable.
   */
  public readonly templateHeader = input<TemplateRef<unknown> | null>(null);
  protected readonly headerTemplate = computed(
    () => this._userHeaderTemplate() ?? this.templateHeader() ?? this._defaultHeaderTemplate()
  );

  private readonly _defaultFooterTemplate =
    viewChild.required<TemplateRef<unknown>>('defaultFooterTemplate');
  private readonly _userFooterTemplate = contentChild<TemplateRef<unknown>>('footer');
  /**
   * Set a custom template for the footer of the dialog.
   * Can also be set using an `<ng-template>` element with `#footer` template reference variable.
   */
  public readonly templateFooter = input<TemplateRef<unknown> | null>(null);
  protected readonly footerTemplate = computed(
    () => this._userFooterTemplate() ?? this.templateFooter() ?? this._defaultFooterTemplate()
  );

  /**
   * Types for the dialog templates.
   */
  public readonly templateTypes = templateTypesFn<{
    header: {
      headerId: string;
      title: string | null;
    };
  }>();
}
