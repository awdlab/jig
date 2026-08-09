import { computed, contentChild, Directive, input, TemplateRef } from '@angular/core';
import { templateTypesFn } from '@awdlab/jig/api/ng';
import { AwdBase } from '@awdlab/jig/base';

import type { ContentTemplateType } from './types';

@Directive()
export abstract class InplaceTemplates extends AwdBase<'inplace'> {
  // Display template
  private readonly _userDisplayTemplate = contentChild<TemplateRef<unknown>>('display');
  /**
   * Set a custom template for the display.
   * Can also be set using an `<ng-template>` element with `#display` template reference variable.
   */
  public readonly templateDisplay = input<TemplateRef<unknown> | null>(null);
  protected readonly displayTemplate = computed(
    () => this._userDisplayTemplate() ?? this.templateDisplay()
  );
  /**
   * Context for the display template.
   */
  public readonly templateDisplayContext = input<unknown>();

  // Content template
  private readonly _userContentTemplate =
    contentChild<TemplateRef<typeof this.templateTypes.content>>('content');
  /**
   * Set a custom template for the content.
   * Can also be set using an `<ng-template>` element with `#content` template reference variable.
   */
  public readonly templateContent = input<TemplateRef<typeof this.templateTypes.content> | null>(
    null
  );
  protected readonly contentTemplate = computed(
    () => this._userContentTemplate() ?? this.templateContent()
  );
  /**
   * Context for the content template.
   */
  public readonly templateContentContext = input<unknown>();

  /**
   * Types for the inplace templates.
   */
  public readonly templateTypes = templateTypesFn<{
    /**
     * Type of the template variable for the content template.
     */
    content: ContentTemplateType;
  }>();
}
