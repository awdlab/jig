import { computed, contentChild, Directive, input, TemplateRef, viewChild } from '@angular/core';
import { templateTypesFn } from '@ngneers/controls/api/ng';
import { NgnBase } from '@ngneers/controls/base';

import type { HeaderTemplateType } from './types';

@Directive()
export abstract class AccordionTemplates extends NgnBase<'accordionPanel'> {
  private readonly _defaultHeaderTemplate =
    viewChild.required<TemplateRef<HeaderTemplateType>>('defaultHeaderTemplate');
  private readonly _userHeaderTemplate = contentChild<TemplateRef<HeaderTemplateType>>('header');
  /**
   * Set a custom template for the header of the accordion panel.
   * Can also be set using an `<ng-template>` element with `#header` template reference variable.
   */
  public readonly templateHeader = input<TemplateRef<HeaderTemplateType> | null>(null);
  protected readonly headerTemplate = computed(
    () => this._userHeaderTemplate() ?? this.templateHeader() ?? this._defaultHeaderTemplate()
  );

  private readonly _userContentTemplate = contentChild<TemplateRef<unknown>>('content');
  /**
   * The required template for the content of the accordion panel.
   * Can also be set using an `<ng-template>` element with `#content` template reference variable.
   */
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
