export type MenuItem = MenuItemDefault | MenuItemSeparator;

export type MenuItemDefault = {
  id: string;
  label: string;
  icon?: string;
  callback?: () => void;
  disabled?: boolean;
  testId?: string;
  children?: MenuItem[];
};

export type MenuItemSeparator = {
  separator: true;
};
