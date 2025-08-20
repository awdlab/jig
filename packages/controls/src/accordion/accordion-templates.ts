import { computed, contentChild, Directive, input, TemplateRef, viewChild } from '@angular/core';
import { templateTypesFn } from '@ngneers/controls/api/ng';

import { HeaderTemplateType } from './types';

@Directive()
export abstract class AccordionTemplates {
  private readonly _defaultHeaderTemplate =
    viewChild.required<TemplateRef<HeaderTemplateType>>('defaultHeaderTemplate');
  private readonly _userHeaderTemplate = contentChild<TemplateRef<HeaderTemplateType>>('header');
  public readonly templateHeader = input<TemplateRef<HeaderTemplateType> | null>(null);
  protected readonly headerTemplate = computed(
    () => this._userHeaderTemplate() ?? this.templateHeader() ?? this._defaultHeaderTemplate()
  );

  private readonly _userContentTemplate = contentChild<TemplateRef<unknown>>('content');
  public readonly templateContent = input<TemplateRef<unknown> | null>(null);
  protected readonly contentTemplate = computed(
    () => this._userContentTemplate() ?? this.templateContent()
  );

  /**
   * Types for the dialog templates.
   */
  public readonly templateTypes = templateTypesFn<{
    header: HeaderTemplateType;
  }>();
}
