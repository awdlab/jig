import { computed, contentChild, Directive, input, TemplateRef, viewChild } from '@angular/core';
import { templateTypesFn } from '@ngneers/controls/api';

@Directive()
export abstract class DialogTemplates {
  private readonly _defaultHeaderTemplate =
    viewChild.required<TemplateRef<unknown>>('defaultHeaderTemplate');
  private readonly _userHeaderTemplate = contentChild<TemplateRef<unknown>>('header');
  public readonly templateHeader = input<TemplateRef<unknown> | null>(null);
  protected readonly headerTemplate = computed(
    () => this._userHeaderTemplate() ?? this.templateHeader() ?? this._defaultHeaderTemplate()
  );

  private readonly _defaultFooterTemplate =
    viewChild.required<TemplateRef<unknown>>('defaultFooterTemplate');
  private readonly _userFooterTemplate = contentChild<TemplateRef<unknown>>('footer');
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
