import { Placement } from '@floating-ui/dom';
import { TimeSpan } from '@ngneers/controls/utils';

export type TooltipOptions = {
  /**
   * The placement of the tooltip relative to the anchor element.
   * @default bottom
   */
  readonly placement: Placement;
  /**
   * The offset in Pixels of the tooltip from the anchor element.
   * @default 4
   */
  readonly offset: number;
  /**
   * The delay before the tooltip is shown. If a number is provided, it is interpreted as milliseconds.
   * @default '0.5s'
   */
  readonly showDelay: TimeSpan;
  /**
   * The delay before the tooltip is hidden. If a number is provided, it is interpreted as milliseconds.
   * @default '0.1s'
   */
  readonly hideDelay: TimeSpan;
  /**
   * Whether to show an arrow pointing to the anchor element. `""` is equivalent to `true`.
   * @default true
   */
  readonly showArrow: boolean;

  /**
   * Shows the tooltip on hover.
   * @default true
   */
  readonly showOnHover: boolean;
  /**
   * Shows the tooltip on focus.
   * @default true
   */
  readonly showOnFocus: boolean;
  /**
   * Hides the tooltip (without delay) when the mouse hovers over the tooltip.
   * @default false
   */
  readonly hideOnTooltipHover: boolean;
  /**
   * Hides the tooltip (without delay) when the user clicks on the tooltip.
   * @default true
   */
  readonly hideOnClick: boolean;
};
