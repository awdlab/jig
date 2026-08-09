import { TemplateRef, Type } from '@angular/core';

import type { PromptDialogBase } from './prompt-dialog-base';
import type { NgnActionButtonConfig } from '@awdlab/jig/api';
import type { CloseBy } from '@awdlab/jig/api/ng';

export type DialogSize = {
  width?: string;
  maxWidth?: string;
  minWidth?: string;
  minHeight?: string;
  maxHeight?: string;
  height?: string;
};

export type DialogConfig<
  T,
  Buttons extends NgnActionButtonConfig<T extends PromptDialogBase<any, infer B> ? B : unknown>[],
> = {
  title?: string;
  size?: DialogSize;
  modal?: boolean;
  closeBy?: CloseBy;
  footerButtons?: Buttons;
  content?: string | TemplateRef<unknown> | Type<T>;
  movable?: boolean;
  resizable?: boolean;
};
