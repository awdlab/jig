import type { NgnActionItem } from '@ngneers/controls/api';

export type MenuItem = MenuItemDefault | MenuItemSeparator;

export type MenuItemDefault = NgnActionItem;

export type MenuItemSeparator = {
  separator: true;
};
