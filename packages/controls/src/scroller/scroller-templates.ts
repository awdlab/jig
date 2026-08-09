import { computed, contentChild, Directive, input, TemplateRef } from '@angular/core';
import { templateTypesFn } from '@awdlab/jig/api/ng';
import { AwdBase } from '@awdlab/jig/base';

@Directive()
export abstract class ScrollerTemplates<T> extends AwdBase<'scroller'> {
  /**
   * The template to be used for rendering each item in the scroller.
   * Can also be set using the `item` content child.
   */
  public readonly templateItem = input<TemplateRef<typeof this.templateTypes.item> | null>(null);
  private readonly _userItemTemplate =
    contentChild<TemplateRef<typeof this.templateTypes.item>>('item');
  protected readonly itemTemplate = computed(() => this._userItemTemplate() ?? this.templateItem());

  /**
   * Template types for the scroller.
   * Can be used with the {@link AwdTemplate} directive for type safe ng-templates.
   */
  public readonly templateTypes = templateTypesFn<{
    item: {
      $implicit: T;
      index: number;
    };
  }>();
}
