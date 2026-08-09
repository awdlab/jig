import { TemplateRef } from '@angular/core';

import type { JigActionButtonConfig } from '@awdlab/jig/api';
import type { CustomColor, IconType } from '@awdlab/jig-custom-types';

export type HeaderTemplateType = {
  header?: string;
  closable: boolean;
  closeSnackbar: () => void;
};

export type ContentTemplateType = {
  content?: string;
};

export type JigSnackbarOptionsMeta = {
  closable?: boolean;
  color?: CustomColor;
  icon?: IconType;
  autoHide?: number | false;
  actions?: JigActionButtonConfig[];
  showProgress?: boolean;
  pauseOnHover?: boolean;
  ariaLive?: 'polite' | 'assertive' | 'off';
};

export type JigSnackbarOptions = JigSnackbarOptionsMeta & {
  header?: string;
  content?: string;
  headerTemplate?: TemplateRef<HeaderTemplateType>;
  contentTemplate?: TemplateRef<ContentTemplateType>;
};

export type JigSnackbarRef = {
  hide: () => void;
};
