import { booleanAttribute, computed, Directive, input, model } from '@angular/core';
import { optionalBooleanAttribute } from '@awdlab/jig/utils-ng';

import { ValueControlBase } from './value-control-base';

import type { ControlName } from '@awdlab/jig-themes/templates';

/**
 * The inputs every item-collection control shares — list box, dropdown list and
 * tree. Keeps their selection, filtering and virtualization surface identical so
 * the three never drift apart again.
 */
@Directive()
export abstract class CollectionControlBase<
  C extends ControlName,
  Value,
  Items extends readonly object[],
  Multiple extends boolean,
  Filter,
> extends ValueControlBase<C, Value> {
  /**
   * The items to display.
   */
  public readonly items = input.required<Items>();
  /**
   * Whether items can be selected by the user.
   * @default true
   */
  public readonly selectable = input(true, { transform: booleanAttribute });
  /**
   * Enable this to allow the user to select multiple values.
   * When enabled, the value of the control becomes an array of selected items.
   * @default false
   */
  public readonly multiple = input<Multiple>();
  /**
   * Whether to use a checkbox to indicate selection state.
   *
   * This option is true per default when {@link multiple} is `true`.
   * @default multiple()
   */
  public readonly checkbox = input(undefined, { transform: optionalBooleanAttribute });
  /**
   * Whether the list is virtualized.
   * @default false
   */
  public readonly virtual = input(false, { transform: booleanAttribute });
  /**
   * When {@link virtual} is enabled, this defines the height of each item in the list.
   */
  public readonly itemHeight = input<number>();
  /**
   * Accepts a boolean value that determines whether the filter is enabled.
   * Alternatively, you can provide a `FilterConfig` to customize the filter behavior.
   * @default false
   */
  public readonly filter = input<Filter | boolean>(false);
  /**
   * The text the items are filtered by. Two-way, so a host that renders its own
   * filter field can read back what the user typed.
   * @default null
   */
  public readonly filterText = model<string | null>(null);

  /** Whether selection is rendered as checkboxes: {@link checkbox}, or {@link multiple} when unset. */
  protected readonly showCheckboxes = computed(
    () => this.checkbox() ?? (this.multiple() as boolean | undefined) ?? false
  );
}
