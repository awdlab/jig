export type MenuItem = {
  id: string;
  label: string;
  icon?: string;
  callback?: () => void;
  disabled?: boolean;
  testId?: string;
  children?: MenuItem[];
};
