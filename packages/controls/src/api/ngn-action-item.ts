import type { IconType } from '@ngneers/controls-custom-types';

export type NgnActionItem = {
  id: string;
  label: string;
  icon?: IconType;
  callback?: () => void;
  disabled?: boolean;
  testId?: string;
  children?: NgnActionItem[];
  route?: string | string[];
};

export type NgnActionItemFlat<T> = Omit<T, 'children'>;
