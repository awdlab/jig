import type { JigActionItem } from '@awdlab/jig/api';

export type MenuItem = MenuItemDefault | MenuItemSeparator;

export type MenuItemDefault = JigActionItem;

export type MenuItemSeparator = {
  separator: true;
};
