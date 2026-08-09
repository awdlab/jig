import {
  computed,
  contentChild,
  Directive,
  input,
  TemplateRef,
  Type,
  viewChild,
} from '@angular/core';
import { templateTypesFn } from '@awdlab/jig/api/ng';
import { NgnBase } from '@awdlab/jig/base';

@Directive()
export abstract class DialogTemplates<T> extends NgnBase<'dialog'> {
  private readonly _userContentTemplate = contentChild<TemplateRef<unknown>>('content');
  /**
   * The content of the dialog.
   * Can be a string, a component type, or a template reference.
   * Can also be set using an `<ng-template>` element with `#content` template reference variable.
   */
  public readonly content = input<TemplateRef<unknown> | null | Type<T> | string>(null);
  protected readonly contentTemplate = computed(
    () => this._userContentTemplate() ?? this.content()
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
  /**
   * Whether the consumer supplied header content of their own.
   */
  protected readonly hasHeaderTemplate = computed(
    () => !!(this._userHeaderTemplate() ?? this.templateHeader())
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
   * Whether the consumer supplied footer content of their own.
   */
  protected readonly hasFooterTemplate = computed(
    () => !!(this._userFooterTemplate() ?? this.templateFooter())
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
