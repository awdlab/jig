import { PositioningSizeConstraints } from '@ngneers/controls/api';

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
};
