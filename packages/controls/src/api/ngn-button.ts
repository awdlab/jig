import { CustomKind } from '@ngneers/controls-custom-types';

export type NgnActionButtonConfig<T = unknown> = {
  label: string;
  value: T;
  action?: () => void;
  kind?: CustomKind<'button'>;
  disabled?: boolean;
  testId?: string;
};
