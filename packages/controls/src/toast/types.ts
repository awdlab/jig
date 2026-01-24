import { TemplateRef } from '@angular/core';
import { CustomColor, IconType } from '@ngneers/controls-custom-types';

export type HeaderTemplateType = {
  header?: string;
  closable: boolean;
  closeToast: () => void;
};

export type ContentTemplateType = {
  content?: string;
};

export type NgnToastOptions = {
  header?: string;
  content?: string;
  closable?: boolean;
  color?: CustomColor;
  icon?: IconType;
  autoHide?: number | false;
  headerTemplate?: TemplateRef<HeaderTemplateType>;
  contentTemplate?: TemplateRef<ContentTemplateType>;
};

export type NgnToastRef = {
  hide: () => void;
};
