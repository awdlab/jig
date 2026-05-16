import type { NgnIconKey } from '@ngneers/controls/icon';
import type { CustomColor, CustomKind, IconType } from '@ngneers/controls-custom-types';

export type NgnActionButtonConfig<T = unknown> = {
  label: string | (() => string);
  value: T;
  action?: (event: PointerEvent) => void;
  icon?: IconType;
  defaultIcon?: NgnIconKey;
  kind?: CustomKind<'button'>;
  color?: CustomColor;
  disabled?: boolean;
  testId?: string;
};
