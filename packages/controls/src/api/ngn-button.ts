import { ButtonKindType } from '@ngneers/controls/custom-types';

export type NgnActionButtonConfig = {
  label: string;
  action?: () => void;
  kind?: ButtonKindType;
  disabled?: boolean;
  testId?: string;
};
