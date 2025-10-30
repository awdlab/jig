import { ButtonKindType } from '@ngneers/controls/custom-types';

export type NgnActionButtonConfig<T = unknown> = {
  label: string;
  value: T;
  action?: () => void;
  kind?: ButtonKindType;
  disabled?: boolean;
  testId?: string;
};
