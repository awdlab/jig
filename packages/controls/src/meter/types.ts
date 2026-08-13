import type { IconType } from '@awdlab/jig-custom-types';

/**
 * A single measured slice of a {@link JigMeter}.
 */
export type MeterItem = {
  /** Text shown in the legend for this item. */
  label: string;
  /** The measured amount. Negative values are treated as `0`. */
  value: number;
  /**
   * CSS color for the item's segment and legend swatch.
   * Falls back to the theme's meter palette, cycled by item position.
   */
  color?: string;
  /** Icon rendered next to the label in the legend. */
  icon?: IconType;
};

export type LabelTemplateType = {
  $implicit: MeterItem;
  /** The item's share of the meter total, unrounded (`0`–`100`). */
  percentage: number;
};
