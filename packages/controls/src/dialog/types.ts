import { TemplateRef, Type } from '@angular/core';

import type { NgnActionButtonConfig } from '@ngneers/controls/api';
import type { CloseBy } from '@ngneers/controls/api/ng';

export type DialogSize = {
  width?: string;
  maxWidth?: string;
  minWidth?: string;
  minHeight?: string;
  maxHeight?: string;
  height?: string;
};

export type DialogConfig<T, Buttons extends NgnActionButtonConfig<unknown>[]> = {
  title?: string;
  size?: DialogSize;
  modal?: boolean;
  closeBy?: CloseBy;
  footerButtons?: Buttons;
  content?: string | TemplateRef<unknown> | Type<T>;
  movable?: boolean;
  resizable?: boolean;
};
