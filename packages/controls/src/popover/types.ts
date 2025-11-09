import { Placement } from '@floating-ui/dom';
import { PositioningSizeConstraints } from '@ngneers/controls/api/ng';

export type Point = {
  x: number;
  y: number;
};

export type Anchor = HTMLElement | Point;

export type PopoverOptions = {
  /**
   * Constraints for the size of the popover.
   */
  sizeConstraints?: PositioningSizeConstraints;
  /**
   * If true, the content of the popover will be cached and not recreated on each open.
   * This is useful for performance when the content is expensive to create.
   */
  cache?: boolean;
  /**
   * The placement of the popover relative to the anchor element.
   */
  placement?: Placement;
  /**
   * The padding of the popover content.
   */
  padding?: number;
};
