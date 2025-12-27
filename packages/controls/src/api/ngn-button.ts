import { DefaultIcon } from '@ngneers/controls/icon';
import { CustomKind, IconType } from '@ngneers/controls-custom-types';

export type NgnActionButtonConfig<T = unknown> = {
  label: string;
  value: T;
  action?: (event: PointerEvent) => void;
  icon?: IconType;
  defaultIcon?: DefaultIcon;
  kind?: CustomKind<'button'>;
  disabled?: boolean;
  testId?: string;
};
