import { TemplateRef } from '@angular/core';

import type { CustomColor, IconType } from '@ngneers/controls-custom-types';

export type HeaderTemplateType = {
  header?: string;
  closable: boolean;
  closeToast: () => void;
};

export type ContentTemplateType = {
  content?: string;
};

export type NgnToastOptionsMeta = {
  closable?: boolean;
  color?: CustomColor;
  icon?: IconType;
  autoHide?: number | false;
};

export type NgnToastOptions = NgnToastOptionsMeta & {
  header?: string;
  content?: string;
  headerTemplate?: TemplateRef<HeaderTemplateType>;
  contentTemplate?: TemplateRef<ContentTemplateType>;
};

export type NgnToastRef = {
  hide: () => void;
};
