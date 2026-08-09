import { computed, contentChild, Directive, input, TemplateRef, viewChild } from '@angular/core';
import { templateTypesFn } from '@awdlab/jig/api/ng';
import { AwdBase } from '@awdlab/jig/base';

import type { JigActionItem, JigItem } from '@awdlab/jig/api';

/**
 * The shape the command control hands to the list box: an {@link JigItem} whose
 * `data` carries the original {@link JigActionItem} and whose `value` is its id.
 */
export type CommandItem = JigItem<JigActionItem, string>;

@Directive()
export abstract class CommandTemplates extends AwdBase<'command'> {
  private readonly _defaultItemTemplate =
    viewChild.required<TemplateRef<typeof this.templateTypes.item>>('defaultItemTemplate');
  private readonly _userItemTemplate =
    contentChild<TemplateRef<typeof this.templateTypes.item>>('item');
  /**
   * Set a custom template for a command entry.
   * Can also be set using an `<ng-template>` element with `#item` template reference variable.
   */
  public readonly templateItem = input<TemplateRef<typeof this.templateTypes.item> | null>(null);
  protected readonly itemTemplate = computed(
    () => this._userItemTemplate() ?? this.templateItem() ?? this._defaultItemTemplate()
  );

  private readonly _userGroupTemplate =
    contentChild<TemplateRef<typeof this.templateTypes.item>>('group');
  /**
   * Set a custom template for a group header.
   * Can also be set using an `<ng-template>` element with `#group` template reference variable.
   * Falls back to the list box's own group template.
   */
  public readonly templateGroup = input<TemplateRef<typeof this.templateTypes.item> | null>(null);
  protected readonly groupTemplate = computed(
    () => this._userGroupTemplate() ?? this.templateGroup()
  );

  private readonly _defaultEmptyTemplate =
    viewChild.required<TemplateRef<unknown>>('defaultEmptyTemplate');
  private readonly _userEmptyTemplate = contentChild<TemplateRef<unknown>>('empty');
  /**
   * Set a custom template for the no-results state.
   * Can also be set using an `<ng-template>` element with `#empty` template reference variable.
   */
  public readonly templateEmpty = input<TemplateRef<unknown> | null>(null);
  protected readonly emptyTemplate = computed(
    () => this._userEmptyTemplate() ?? this.templateEmpty() ?? this._defaultEmptyTemplate()
  );

  /**
   * Types for the command templates.
   */
  public readonly templateTypes = templateTypesFn<{
    item: {
      $implicit: CommandItem | undefined;
    };
  }>();
}
