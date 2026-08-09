import { TemplateRef } from '@angular/core';

import type { CustomColor, IconType } from '@awdlab/jig-custom-types';

export type HeaderTemplateType = {
  header?: string;
  closable: boolean;
  closeToast: () => void;
};

export type ContentTemplateType = {
  content?: string;
};

export type AwdToastOptionsMeta = {
  closable?: boolean;
  color?: CustomColor;
  icon?: IconType;
  autoHide?: number | false;
};

export type AwdToastOptions = AwdToastOptionsMeta & {
  header?: string;
  content?: string;
  headerTemplate?: TemplateRef<HeaderTemplateType>;
  contentTemplate?: TemplateRef<ContentTemplateType>;
};

export type AwdToastRef = {
  hide: () => void;
};
