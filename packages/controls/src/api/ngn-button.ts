import type { DefaultIcon } from '@ngneers/controls/icon';
import type { CustomColor, CustomKind, IconType } from '@ngneers/controls-custom-types';

export type NgnActionButtonConfig<T = unknown> = {
  label: string | (() => string);
  value: T;
  action?: (event: PointerEvent) => void;
  icon?: IconType;
  defaultIcon?: DefaultIcon;
  kind?: CustomKind<'button'>;
  color?: CustomColor;
  disabled?: boolean;
  testId?: string;
};
