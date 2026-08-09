import type { IconType } from '@awdlab/jig-custom-types';

export type NgnActionItem = {
  id: string;
  label: string | (() => string);
  icon?: IconType;
  callback?: () => void;
  /**
   * Keyboard shortcut that runs this item, as `+`-joined lowercase tokens
   * (`mod+n`, `shift+mod+p`). Rendered as a keycap where the host supports it.
   * Scope is the host's to decide — `awd-command` registers these page-wide, so a
   * palette command fires whether or not the palette is open.
   */
  shortcut?: string;
  disabled?: boolean;
  testId?: string;
  children?: NgnActionItem[];
  route?: string | string[];
};

export type NgnActionItemFlat<T> = Omit<T, 'children'>;
