import type { IconType } from '@awdlab/jig-custom-types';

export type JigActionItem = {
  id: string;
  label: string | (() => string);
  icon?: IconType;
  /**
   * Runs when the item is activated. Receives the triggering DOM event when there is one, so
   * `event.currentTarget` can anchor a popover to the clicked button or menu item.
   */
  callback?: (event?: Event) => void;
  /**
   * Keyboard shortcut that runs this item, as `+`-joined lowercase tokens
   * (`mod+n`, `shift+mod+p`). Rendered as a keycap where the host supports it.
   * Scope is the host's to decide — `jig-command` registers these page-wide, so a
   * palette command fires whether or not the palette is open.
   */
  shortcut?: string;
  disabled?: boolean;
  testId?: string;
  children?: JigActionItem[];
  route?: string | string[];
};

export type JigActionItemFlat<T> = Omit<T, 'children'>;
