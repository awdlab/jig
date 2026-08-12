import { computed, contentChild, Directive, input, TemplateRef, viewChild } from '@angular/core';
import { templateTypesFn } from '@awdlab/jig/api/ng';
import { ValueControlBase } from '@awdlab/jig/base';

import type { JigItem } from '@awdlab/jig/api';

@Directive()
export abstract class TagInputTemplates extends ValueControlBase<'tagInput', string[] | null> {
  // Tag template
  private readonly _defaultTagTemplate =
    viewChild.required<TemplateRef<typeof this.templateTypes.tag>>('defaultTagTemplate');
  private readonly _userTagTemplate =
    contentChild<TemplateRef<typeof this.templateTypes.tag>>('tag');
  /**
   * Set a custom template for a single tag. The context carries the tag, its
   * index, and a `remove` callback.
   * Can also be set using an `<ng-template>` element with `#tag` template reference variable.
   */
  public readonly templateTag = input<TemplateRef<typeof this.templateTypes.tag> | null>(null);
  protected readonly tagTemplate = computed(
    () => this._userTagTemplate() ?? this.templateTag() ?? this._defaultTagTemplate()
  );

  // Suggestion template
  private readonly _userSuggestionTemplate =
    contentChild<TemplateRef<typeof this.templateTypes.suggestion>>('suggestion');
  /**
   * Set a custom template for a suggestion in the dropdown.
   * Can also be set using an `<ng-template>` element with `#suggestion` template reference variable.
   */
  public readonly templateSuggestion = input<TemplateRef<
    typeof this.templateTypes.suggestion
  > | null>(null);
  protected readonly suggestionTemplate = computed(
    () => this._userSuggestionTemplate() ?? this.templateSuggestion()
  );

  /**
   * Types for the tag input templates.
   */
  public readonly templateTypes = templateTypesFn<{
    tag: {
      $implicit: string;
      index: number;
      remove: () => void;
    };
    suggestion: {
      $implicit: JigItem<unknown, string> | undefined;
    };
  }>();
}
