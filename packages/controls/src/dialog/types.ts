import { TemplateRef, Type } from '@angular/core';
import { NgnActionButtonConfig } from '@ngneers/controls/api';

export type DialogSize = {
  width?: string;
  maxWidth?: string;
  minWidth?: string;
  minHeight?: string;
  maxHeight?: string;
  height?: string;
};

export type DialogCloseBy = 'any' | 'escape' | 'none';

export type DialogConfig<T, Buttons extends NgnActionButtonConfig<unknown>[]> = {
  title?: string;
  size?: DialogSize;
  modal?: boolean;
  closeBy?: DialogCloseBy;
  footerButtons?: Buttons;
  content?: string | TemplateRef<unknown> | Type<T>;
  movable?: boolean;
  resizable?: boolean;
};
