import { computed, contentChild, Directive, input, TemplateRef } from '@angular/core';
import { AwdBase } from '@awdlab/jig/base';

@Directive()
export abstract class TabsTemplates extends AwdBase<'tabs'> {
  // Header left template
  private readonly _userHeaderLeftTemplate = contentChild<TemplateRef<unknown>>('headerLeft');
  /**
   * Set a custom template for the left side of the tabs header.
   * Can also be set using an `<ng-template>` element with `#headerLeft` template reference variable.
   */
  public readonly templateHeaderLeft = input<TemplateRef<unknown> | null>(null);
  protected readonly headerLeftTemplate = computed(
    () => this._userHeaderLeftTemplate() ?? this.templateHeaderLeft()
  );

  // Header right template
  private readonly _userHeaderRightTemplate = contentChild<TemplateRef<unknown>>('headerRight');
  /**
   * Set a custom template for the right side of the tabs header.
   * Can also be set using an `<ng-template>` element with `#headerRight` template reference variable.
   */
  public readonly templateHeaderRight = input<TemplateRef<unknown> | null>(null);
  protected readonly headerRightTemplate = computed(
    () => this._userHeaderRightTemplate() ?? this.templateHeaderRight()
  );
}
