import { TemplateRef } from '@angular/core';

import type { NgnActionButtonConfig } from '@awdlab/jig/api';
import type { CustomColor, IconType } from '@awdlab/jig-custom-types';

export type HeaderTemplateType = {
  header?: string;
  closable: boolean;
  closeSnackbar: () => void;
};

export type ContentTemplateType = {
  content?: string;
};

export type NgnSnackbarOptionsMeta = {
  closable?: boolean;
  color?: CustomColor;
  icon?: IconType;
  autoHide?: number | false;
  actions?: NgnActionButtonConfig[];
  showProgress?: boolean;
  pauseOnHover?: boolean;
  ariaLive?: 'polite' | 'assertive' | 'off';
};

export type NgnSnackbarOptions = NgnSnackbarOptionsMeta & {
  header?: string;
  content?: string;
  headerTemplate?: TemplateRef<HeaderTemplateType>;
  contentTemplate?: TemplateRef<ContentTemplateType>;
};

export type NgnSnackbarRef = {
  hide: () => void;
};
