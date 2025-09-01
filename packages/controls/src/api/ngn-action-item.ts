export type NgnActionItem = {
  id: string;
  label: string;
  icon?: string;
  callback?: () => void;
  disabled?: boolean;
  testId?: string;
  children?: NgnActionItem[];
  route?: string | string[];
};

export type NgnActionItemFlat<T> = Omit<T, 'children'>;
