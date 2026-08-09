import type { NgnIconKey } from '@awdlab/jig/icon';
import type { CustomColor, CustomKind, IconType } from '@awdlab/jig-custom-types';

export type NgnActionButtonConfig<T = unknown> = {
  label: string | (() => string);
  value: T;
  /** Runs on click, or on the keyboard {@link NgnActionButtonConfig.shortcut}, where no pointer event exists. */
  action?: (event?: PointerEvent) => void;
  /**
   * Shortcut config string, e.g. `mod+s`. Registered with the nearest ancestor
   * `[ngnKeyboardShortcut]` scope, so it fires only while focus is inside that container.
   */
  shortcut?: string;
  icon?: IconType;
  defaultIcon?: NgnIconKey;
  kind?: CustomKind<'button'>;
  color?: CustomColor;
  disabled?: boolean;
  testId?: string;
};
