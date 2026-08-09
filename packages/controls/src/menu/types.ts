import type { NgnActionItem } from '@awdlab/jig/api';

export type MenuItem = MenuItemDefault | MenuItemSeparator;

export type MenuItemDefault = NgnActionItem;

export type MenuItemSeparator = {
  separator: true;
};
